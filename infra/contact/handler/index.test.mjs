import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";

process.env.TABLE_NAME = "contact-test";
process.env.SITE_URL = "https://nomadops.io";
process.env.NOTIFY_EMAIL = "inbox@example.com";
process.env.RATE_LIMIT = "2";

const { DynamoDBClient } = await import("@aws-sdk/client-dynamodb");
const { SESClient } = await import("@aws-sdk/client-ses");

const sent = { ddb: [], ses: [] };
let counter = 0;
DynamoDBClient.prototype.send = async (cmd) => {
  sent.ddb.push(cmd);
  if (cmd.constructor.name === "UpdateItemCommand") return { Attributes: { count: { N: String(++counter) } } };
  return {};
};
SESClient.prototype.send = async (cmd) => { sent.ses.push(cmd); return {}; };

const { handler } = await import("./index.mjs");

const post = (fields, extra = {}) => ({
  requestContext: { http: { method: "POST", sourceIp: extra.ip || "203.0.113.9" } },
  headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://nomadops.io", "user-agent": "test", ...(extra.headers || {}) },
  body: new URLSearchParams(fields).toString(),
  isBase64Encoded: false,
});
const valid = { name: "Ada", email: "ada@example.com", message: "Hello there", website: "" };

beforeEach(() => { sent.ddb.length = 0; sent.ses.length = 0; counter = 0; });

test("GET redirects to the contact section", async () => {
  const res = await handler({ requestContext: { http: { method: "GET" } }, headers: {} });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.Location, "https://nomadops.io/#contact");
});

test("valid post stores, emails, redirects to thanks", async () => {
  const res = await handler(post(valid));
  assert.equal(res.headers.Location, "https://nomadops.io/thanks/");
  const put = sent.ddb.find((c) => c.constructor.name === "PutItemCommand");
  assert.ok(put, "message stored");
  assert.equal(put.input.Item.email.S, "ada@example.com");
  assert.equal(put.input.Item.pk.S.startsWith("msg#"), true);
  assert.equal(sent.ses.length, 1);
  assert.deepEqual(sent.ses[0].input.ReplyToAddresses, ["ada@example.com"]);
});

test("honeypot filled: pretend success, store nothing", async () => {
  const res = await handler(post({ ...valid, website: "http://spam.example" }));
  assert.equal(res.headers.Location, "https://nomadops.io/thanks/");
  assert.equal(sent.ddb.length, 0);
  assert.equal(sent.ses.length, 0);
});

test("foreign origin: pretend success, store nothing", async () => {
  const res = await handler(post(valid, { headers: { origin: "https://evil.example" } }));
  assert.equal(res.headers.Location, "https://nomadops.io/thanks/");
  assert.equal(sent.ddb.length, 0);
});

test("missing origin is tolerated", async () => {
  const ev = post(valid); delete ev.headers.origin;
  const res = await handler(ev);
  assert.equal(res.headers.Location, "https://nomadops.io/thanks/");
  assert.equal(sent.ses.length, 1);
});

test("bad email or empty message: sorry, nothing stored", async () => {
  for (const bad of [{ ...valid, email: "nope" }, { ...valid, message: "   " }, { ...valid, name: "" }]) {
    const res = await handler(post(bad));
    assert.equal(res.headers.Location, "https://nomadops.io/sorry/");
  }
  assert.equal(sent.ddb.length, 0);
});

test("wrong content type: sorry", async () => {
  const res = await handler(post(valid, { headers: { "content-type": "application/json" } }));
  assert.equal(res.headers.Location, "https://nomadops.io/sorry/");
});

test("rate limit: third submission in the window is refused", async () => {
  await handler(post(valid)); await handler(post(valid));
  const res = await handler(post(valid));
  assert.equal(res.headers.Location, "https://nomadops.io/sorry/");
  assert.equal(sent.ses.length, 2);
});

test("SES failure after storing still returns sorry and logs", async () => {
  SESClient.prototype.send = async () => { throw new Error("boom"); };
  const res = await handler(post(valid));
  assert.equal(res.headers.Location, "https://nomadops.io/sorry/");
  SESClient.prototype.send = async (cmd) => { sent.ses.push(cmd); return {}; };
});

test("base64 body is decoded", async () => {
  const ev = post(valid); ev.body = Buffer.from(ev.body).toString("base64"); ev.isBase64Encoded = true;
  const res = await handler(ev);
  assert.equal(res.headers.Location, "https://nomadops.io/thanks/");
});
