// Hosting for nomadops.io: a private S3 bucket behind CloudFront, an ACM
// certificate, security headers, pretty URLs for Eleventy output, a www →
// apex redirect, and a GitHub OIDC deploy role that can only write this
// bucket and invalidate this distribution.
//
//   pulumi config set aws:region us-east-1
//   pulumi config set domain nomadops.io
//   pulumi config set route53ZoneId Z0123456789ABC   # only if the zone is in Route 53
//   pulumi up
//
// DNS elsewhere? Let the first `up` create the certificate, add the
// `certificateValidationRecords` output at your DNS host, wait for the
// certificate to issue, then set `certificateValidated: true` in
// Pulumi.prod.yaml and let the next `up` create the distribution.
//
// Prerequisite: infra/bootstrap (GitHub OIDC provider, infra roles, state bucket).

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const domain = config.get("domain") ?? "nomadops.io";
const wwwDomain = `www.${domain}`;
const zoneId = config.get("route53ZoneId");
const certificateValidated = config.getBoolean("certificateValidated") ?? false;
const contactFormOrigin = config.get("contactFormOrigin"); // e.g. https://xxxx.lambda-url.us-east-1.on.aws
const githubRepo = config.get("githubRepo") ?? "nomadops/nomadops.github.io";

const tags = { app: "nomadops.io", component: "site" };

// --- Origin bucket -----------------------------------------------------------

const bucket = new aws.s3.Bucket("site", { tags });

new aws.s3.BucketPublicAccessBlock("site-public-access-block", {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});

new aws.s3.BucketVersioningV2("site-versioning", {
  bucket: bucket.id,
  versioningConfiguration: { status: "Enabled" },
});

const oac = new aws.cloudfront.OriginAccessControl("site-oac", {
  originAccessControlOriginType: "s3",
  signingBehavior: "always",
  signingProtocol: "sigv4",
});

// --- Certificate (CloudFront requires us-east-1) -----------------------------

const useast1 = new aws.Provider("useast1", { region: "us-east-1" });

const cert = new aws.acm.Certificate("site-cert", {
  domainName: domain,
  subjectAlternativeNames: [wwwDomain],
  validationMethod: "DNS",
  tags,
}, { provider: useast1 });

const validationRecords = cert.domainValidationOptions.apply((opts) =>
  opts.map((o) => ({ name: o.resourceRecordName, type: o.resourceRecordType, value: o.resourceRecordValue })));

let certArn: pulumi.Output<string> = cert.arn;
if (zoneId) {
  const records = cert.domainValidationOptions.apply((opts) =>
    opts.map((o, i) => new aws.route53.Record(`site-cert-validation-${i}`, {
      zoneId,
      name: o.resourceRecordName,
      type: o.resourceRecordType,
      records: [o.resourceRecordValue],
      ttl: 300,
      allowOverwrite: true,
    })));
  const validation = new aws.acm.CertificateValidation("site-cert-validation", {
    certificateArn: cert.arn,
    validationRecordFqdns: records.apply((rs) => rs.map((r) => r.fqdn)),
  }, { provider: useast1 });
  certArn = validation.certificateArn;
}

// --- Viewer-request function: www → apex, /about/ → /about/index.html --------

const viewerRequest = new aws.cloudfront.Function("site-viewer-request", {
  runtime: "cloudfront-js-2.0",
  publish: true,
  code: `function handler(event) {
  var request = event.request;
  var host = request.headers.host && request.headers.host.value;
  if (host === "${wwwDomain}") {
    var qs = "";
    var keys = Object.keys(request.querystring || {});
    if (keys.length) {
      qs = "?" + keys.map(function (k) { var v = request.querystring[k]; return v.multiValue ? v.multiValue.map(function (m) { return k + "=" + m.value; }).join("&") : k + "=" + v.value; }).join("&");
    }
    return { statusCode: 301, statusDescription: "Moved Permanently", headers: { location: { value: "https://${domain}" + request.uri + qs } } };
  }
  var uri = request.uri;
  if (uri.endsWith("/")) request.uri = uri + "index.html";
  else if (!uri.split("/").pop().includes(".")) request.uri = uri + "/index.html";
  return request;
}`,
});

// --- Response headers --------------------------------------------------------

const csp = [
  "default-src 'self'",
  "script-src 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  `form-action 'self'${contactFormOrigin ? ` ${contactFormOrigin}` : ""}`,
].join("; ");

const headers = new aws.cloudfront.ResponseHeadersPolicy("site-headers", {
  securityHeadersConfig: {
    strictTransportSecurity: { accessControlMaxAgeSec: 63072000, includeSubdomains: true, override: true },
    contentTypeOptions: { override: true },
    frameOptions: { frameOption: "DENY", override: true },
    referrerPolicy: { referrerPolicy: "strict-origin-when-cross-origin", override: true },
    contentSecurityPolicy: { contentSecurityPolicy: csp, override: true },
  },
});

// --- Distribution ------------------------------------------------------------

const cachingOptimized = "658327ea-f89d-4fab-a63d-7e88639e58f6"; // AWS managed cache policy

const distributionArgs: aws.cloudfront.DistributionArgs = {
  enabled: true,
  isIpv6Enabled: true,
  comment: domain,
  defaultRootObject: "index.html",
  httpVersion: "http2and3",
  priceClass: "PriceClass_100",
  aliases: [domain, wwwDomain],
  origins: [{
    originId: "s3",
    domainName: bucket.bucketRegionalDomainName,
    originAccessControlId: oac.id,
  }],
  defaultCacheBehavior: {
    targetOriginId: "s3",
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD", "OPTIONS"],
    cachedMethods: ["GET", "HEAD"],
    compress: true,
    cachePolicyId: cachingOptimized,
    responseHeadersPolicyId: headers.id,
    functionAssociations: [{ eventType: "viewer-request", functionArn: viewerRequest.arn }],
  },
  customErrorResponses: [
    { errorCode: 403, responseCode: 404, responsePagePath: "/404.html", errorCachingMinTtl: 60 },
    { errorCode: 404, responseCode: 404, responsePagePath: "/404.html", errorCachingMinTtl: 60 },
  ],
  restrictions: { geoRestriction: { restrictionType: "none" } },
  viewerCertificate: {
    acmCertificateArn: certArn,
    sslSupportMethod: "sni-only",
    minimumProtocolVersion: "TLSv1.2_2021",
  },
  tags,
};

// Without Route 53 the certificate is validated by hand; the distribution waits for the flag.
const cdn = (zoneId || certificateValidated)
  ? new aws.cloudfront.Distribution("site", distributionArgs)
  : undefined;

if (cdn) {
  new aws.s3.BucketPolicy("site-bucket-policy", {
    bucket: bucket.id,
    policy: pulumi.all([bucket.arn, cdn.arn]).apply(([bucketArn, cdnArn]) => JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Sid: "AllowCloudFrontRead",
        Effect: "Allow",
        Principal: { Service: "cloudfront.amazonaws.com" },
        Action: "s3:GetObject",
        Resource: `${bucketArn}/*`,
        Condition: { StringEquals: { "AWS:SourceArn": cdnArn } },
      }],
    })),
  });

  if (zoneId) {
    for (const [label, name] of [["apex", domain], ["www", wwwDomain]] as const) {
      for (const type of ["A", "AAAA"] as const) {
        new aws.route53.Record(`site-${label}-${type.toLowerCase()}`, {
          zoneId,
          name,
          type,
          aliases: [{ name: cdn.domainName, zoneId: cdn.hostedZoneId, evaluateTargetHealth: false }],
        });
      }
    }
  }
}

// --- GitHub Actions deploy role (OIDC, no stored keys) -----------------------

// The provider is created once by infra/bootstrap; look it up here.
const oidcProvider = aws.iam.getOpenIdConnectProvider({ url: "https://token.actions.githubusercontent.com" });
const oidcProviderArn = pulumi.output(oidcProvider).apply((p) => p.arn);

const deployRole = new aws.iam.Role("site-deploy", {
  description: "GitHub Actions deploys nomadops.io: write the site bucket, invalidate the distribution.",
  assumeRolePolicy: oidcProviderArn.apply((providerArn) => JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: "sts:AssumeRoleWithWebIdentity",
      Principal: { Federated: providerArn },
      Condition: {
        StringEquals: { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        StringLike: { "token.actions.githubusercontent.com:sub": `repo:${githubRepo}:ref:refs/heads/main` },
      },
    }],
  })),
  tags,
});

new aws.iam.RolePolicy("site-deploy-policy", {
  role: deployRole,
  policy: pulumi.all([bucket.arn, cdn ? cdn.arn : pulumi.output("")]).apply(([bucketArn, cdnArn]) => JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      { Effect: "Allow", Action: ["s3:ListBucket"], Resource: bucketArn },
      { Effect: "Allow", Action: ["s3:PutObject", "s3:DeleteObject"], Resource: `${bucketArn}/*` },
      ...(cdnArn ? [{ Effect: "Allow", Action: ["cloudfront:CreateInvalidation"], Resource: cdnArn }] : []),
    ],
  })),
});

// --- Outputs -----------------------------------------------------------------

export const bucketName = bucket.bucket;
export const distributionId = cdn ? cdn.id : pulumi.output("(created after the certificate is validated)");
export const distributionDomain = cdn ? cdn.domainName : pulumi.output("(created after the certificate is validated)");
export const deployRoleArn = deployRole.arn;
export const certificateValidationRecords = validationRecords;
