// GitHub Actions access: the OIDC provider and the two roles the Infra workflow
// assumes. First `up` from a laptop (CI cannot assume a role that does not exist
// yet); after that the Infra workflow previews and applies it like any other stack.
//
//   cd infra/access && npm install
//   pulumi login s3://nomadops-pulumi-state     # created by infra/bootstrap
//   pulumi stack select prod --create
//   pulumi up

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const githubRepo = config.get("githubRepo") ?? "nomadops/nomadops.github.io";
const stateBucketName = config.require("stateBucket");

const tags = { app: "nomadops.io", component: "access" };

const github = new aws.iam.OpenIdConnectProvider("github-oidc", {
  url: "https://token.actions.githubusercontent.com",
  clientIdLists: ["sts.amazonaws.com"],
  // AWS validates GitHub's issuer against its own trust store; the API still requires a value.
  thumbprintLists: ["6938fd4d98bab03faadb97b34396831e3780aea1"],
  tags,
});

const trust = (subject: string) => github.arn.apply((providerArn) => JSON.stringify({
  Version: "2012-10-17",
  Statement: [{
    Effect: "Allow",
    Action: "sts:AssumeRoleWithWebIdentity",
    Principal: { Federated: providerArn },
    Condition: {
      StringEquals: { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      StringLike: { "token.actions.githubusercontent.com:sub": subject },
    },
  }],
}));

// `pulumi up` on pushes to main. Broad on purpose: it creates buckets, distributions,
// certificates, functions, tables and IAM roles. Trust is what limits it: only this
// repository's main branch can assume it, for an hour at a time.
const deploy = new aws.iam.Role("infra-deploy", {
  name: "nomadops-infra-deploy",
  description: "Pulumi up from GitHub Actions on main.",
  maxSessionDuration: 3600,
  assumeRolePolicy: trust(`repo:${githubRepo}:ref:refs/heads/main`),
  managedPolicyArns: [aws.iam.ManagedPolicy.AdministratorAccess],
  tags,
});

// `pulumi preview` on pull requests: read-only on AWS, plus the state bucket (previews take a lock).
const preview = new aws.iam.Role("infra-preview", {
  name: "nomadops-infra-preview",
  description: "Pulumi preview from GitHub Actions on pull requests.",
  maxSessionDuration: 3600,
  assumeRolePolicy: trust(`repo:${githubRepo}:pull_request`),
  managedPolicyArns: [aws.iam.ManagedPolicy.ReadOnlyAccess],
  tags,
});

new aws.iam.RolePolicy("infra-preview-state", {
  role: preview,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      { Effect: "Allow", Action: ["s3:ListBucket"], Resource: `arn:aws:s3:::${stateBucketName}` },
      { Effect: "Allow", Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"], Resource: `arn:aws:s3:::${stateBucketName}/*` },
    ],
  }),
});

export const oidcProviderArn = github.arn;
export const infraDeployRoleArn = deploy.arn;
export const infraPreviewRoleArn = preview.arn;
