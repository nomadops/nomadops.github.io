// Contact form backend for nomadops.io: one Lambda behind a Function URL,
// a DynamoDB table for messages and rate limiting, and SES for the notification.
//
// Config lives in Pulumi.prod.yaml: aws:region, email (recipient), route53ZoneId
// (verifies the domain with DKIM and sends from contact-form@<domain>). Without a
// zone id the recipient address itself is verified and used as the sender, and
// SES emails it a verification link on the first `up`.
//
// Put the `functionUrl` output into src/_data/site.json as `formAction`.

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const email = config.require("email");                 // receives the messages
const siteUrl = config.get("siteUrl") ?? "https://nomadops.io";
const messageTtlDays = config.getNumber("messageTtlDays") ?? 0;
const zoneId = config.get("route53ZoneId");            // set: verify the domain (DKIM) and send from it
const domain = config.get("domain") ?? new URL(siteUrl).hostname;
const senderEmail = zoneId ? (config.get("senderEmail") ?? `contact-form@${domain}`) : email;

const table = new aws.dynamodb.Table("contact-messages", {
  billingMode: "PAY_PER_REQUEST",
  hashKey: "pk",
  attributes: [{ name: "pk", type: "S" }],
  ttl: { attributeName: "expires_at", enabled: true },
  pointInTimeRecovery: { enabled: true },
  tags: { app: "nomadops.io", component: "contact" },
});

// With the zone in Route 53, verify the whole domain with DKIM: better deliverability, and in
// the SES sandbox a verified domain covers both the sender and the recipient. Otherwise verify
// the one address and send from it.
let identityArn: pulumi.Output<string>;
if (zoneId) {
  const domainIdentity = new aws.sesv2.EmailIdentity("contact-domain", {
    emailIdentity: domain,
    dkimSigningAttributes: { nextSigningKeyLength: "RSA_2048_BIT" },
  });
  domainIdentity.dkimSigningAttributes.tokens.apply((tokens) =>
    tokens.map((token, i) => new aws.route53.Record(`contact-dkim-${i}`, {
      zoneId,
      name: `${token}._domainkey.${domain}`,
      type: "CNAME",
      ttl: 600,
      records: [`${token}.dkim.amazonses.com`],
    })));
  identityArn = domainIdentity.arn;
} else {
  identityArn = new aws.ses.EmailIdentity("contact-sender", { email }).arn;
}

const role = new aws.iam.Role("contact-fn-role", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
});

new aws.iam.RolePolicyAttachment("contact-fn-logs", {
  role,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

new aws.iam.RolePolicy("contact-fn-access", {
  role,
  policy: pulumi.all([table.arn, identityArn]).apply(([tableArn, identityArn]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        { Effect: "Allow", Action: ["dynamodb:PutItem", "dynamodb:UpdateItem"], Resource: tableArn },
        { Effect: "Allow", Action: ["ses:SendEmail", "ses:SendRawEmail"], Resource: identityArn },
      ],
    })),
});

const fn = new aws.lambda.Function("contact", {
  runtime: aws.lambda.Runtime.NodeJS22dX,
  handler: "index.handler",
  role: role.arn,
  code: new pulumi.asset.AssetArchive({ "index.mjs": new pulumi.asset.FileAsset("./handler/index.mjs") }),
  memorySize: 128,
  timeout: 10,
  environment: {
    variables: {
      TABLE_NAME: table.name,
      SITE_URL: siteUrl,
      NOTIFY_EMAIL: email,
      SENDER_EMAIL: senderEmail,
      ALLOWED_ORIGINS: siteUrl,
      RATE_LIMIT: "5",
      RATE_WINDOW_SECONDS: "3600",
      MESSAGE_TTL_DAYS: String(messageTtlDays),
    },
  },
  tags: { app: "nomadops.io", component: "contact" },
});

const url = new aws.lambda.FunctionUrl("contact-url", {
  functionName: fn.name,
  authorizationType: "NONE",
});

export const functionUrl = url.functionUrl;
export const tableName = table.name;
export const senderAddress = senderEmail;
export const sesIdentityArn = identityArn;
