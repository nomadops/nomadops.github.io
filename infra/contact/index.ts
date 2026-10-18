// Contact form backend for nomadops.io: one Lambda behind a Function URL,
// a DynamoDB table for messages and rate limiting, and SES for the notification.
//
//   pulumi config set email you@nomadops.io
//   pulumi config set aws:region eu-west-1
//   pulumi up
//
// The first `up` sends a verification email to the address; click the link
// before the first form submission. Put the `functionUrl` output into
// src/_data/site.json as `formAction`.

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const email = config.require("email");
const siteUrl = config.get("siteUrl") ?? "https://nomadops.io";
const messageTtlDays = config.getNumber("messageTtlDays") ?? 0;

const table = new aws.dynamodb.Table("contact-messages", {
  billingMode: "PAY_PER_REQUEST",
  hashKey: "pk",
  attributes: [{ name: "pk", type: "S" }],
  ttl: { attributeName: "expires_at", enabled: true },
  pointInTimeRecovery: { enabled: true },
  tags: { app: "nomadops.io", component: "contact" },
});

const identity = new aws.ses.EmailIdentity("contact-sender", { email });

const role = new aws.iam.Role("contact-fn-role", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
});

new aws.iam.RolePolicyAttachment("contact-fn-logs", {
  role,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

new aws.iam.RolePolicy("contact-fn-access", {
  role,
  policy: pulumi.all([table.arn, identity.arn]).apply(([tableArn, identityArn]) =>
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
      SENDER_EMAIL: email,
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
export const senderIdentity = identity.email;
