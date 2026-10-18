// nomadops.io contact form backend.
// A plain HTML form posts here (application/x-www-form-urlencoded). The function
// validates the submission, stores it in DynamoDB, emails a copy via SES and
// redirects the visitor back to the site. No JavaScript is needed on the site.

import { createHash, randomUUID } from "node:crypto";
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const TABLE = process.env.TABLE_NAME;
const SITE_URL = (process.env.SITE_URL || "https://nomadops.io").replace(/\/$/, "");
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL || NOTIFY_EMAIL;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || SITE_URL).split(",").map((s) => s.trim().replace(/\/$/, ""));
const RATE_LIMIT = Number(process.env.RATE_LIMIT || 5); // submissions per IP per window
const RATE_WINDOW_SECONDS = Number(process.env.RATE_WINDOW_SECONDS || 3600);
const MESSAGE_TTL_DAYS = Number(process.env.MESSAGE_TTL_DAYS || 0); // 0 = keep forever

const ddb = new DynamoDBClient({});
const ses = new SESClient({});

const redirect = (path) => ({ statusCode: 303, headers: { Location: `${SITE_URL}${path}`, "Cache-Control": "no-store" }, body: "" });
const THANKS = redirect("/thanks/");
const SORRY = redirect("/sorry/");

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || "GET";
  if (method !== "POST") return redirect("/#contact");

  const headers = lower(event.headers || {});
  const ctype = headers["content-type"] || "";
  if (!ctype.startsWith("application/x-www-form-urlencoded")) return SORRY;

  const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
  if (raw.length > 20_000) return SORRY;
  const form = Object.fromEntries(new URLSearchParams(raw));

  // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
  if ((form.website || "").trim() !== "") return THANKS;

  // Origin check: browsers send Origin on cross-site form posts. Missing is tolerated (privacy
  // settings); a present but foreign origin is treated as spam.
  const origin = (headers.origin || "").replace(/\/$/, "");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return THANKS;

  const name = clean(form.name, 200);
  const email = clean(form.email, 254);
  const message = clean(form.message, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return SORRY;

  const ip = event.requestContext?.http?.sourceIp || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
  const now = Math.floor(Date.now() / 1000);

  try {
    if (await overLimit(ipHash, now)) return SORRY;

    const id = randomUUID();
    const item = {
      pk: { S: `msg#${id}` },
      received_at: { S: new Date().toISOString() },
      name: { S: name },
      email: { S: email },
      message: { S: message },
      ip_hash: { S: ipHash },
      user_agent: { S: clean(headers["user-agent"], 500) || "" },
      referer: { S: clean(headers.referer, 500) || "" },
    };
    if (MESSAGE_TTL_DAYS > 0) item.expires_at = { N: String(now + MESSAGE_TTL_DAYS * 86400) };
    await ddb.send(new PutItemCommand({ TableName: TABLE, Item: item }));

    await ses.send(new SendEmailCommand({
      Source: `nomadops.io contact form <${SENDER_EMAIL}>`,
      Destination: { ToAddresses: [NOTIFY_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `nomadops.io: message from ${name}`, Charset: "UTF-8" },
        Body: { Text: { Data: `From: ${name} <${email}>\nReceived: ${item.received_at.S}\nID: ${id}\n\n${message}\n`, Charset: "UTF-8" } },
      },
    }));
    return THANKS;
  } catch (err) {
    console.error("contact form failure", { error: String(err) });
    return SORRY;
  }
};

// One counter item per IP hash and window; TTL cleans it up.
async function overLimit(ipHash, now) {
  const windowStart = now - (now % RATE_WINDOW_SECONDS);
  const res = await ddb.send(new UpdateItemCommand({
    TableName: TABLE,
    Key: { pk: { S: `rate#${ipHash}#${windowStart}` } },
    UpdateExpression: "ADD #c :one SET expires_at = if_not_exists(expires_at, :ttl)",
    ExpressionAttributeNames: { "#c": "count" },
    ExpressionAttributeValues: { ":one": { N: "1" }, ":ttl": { N: String(windowStart + RATE_WINDOW_SECONDS * 2) } },
    ReturnValues: "UPDATED_NEW",
  }));
  return Number(res.Attributes?.count?.N || 0) > RATE_LIMIT;
}

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim().slice(0, max);
}

function lower(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
}
