// Bootstrap: the one bucket Pulumi state lives in. Applied once from a laptop by
// ../bootstrap.sh, which creates it on Pulumi's local backend (the bucket cannot
// hold its own state yet) and then moves this stack's state into the bucket.
// By hand, that is:
//
//   cd infra/bootstrap && npm install
//   pulumi login --local
//   pulumi stack select prod --create
//   pulumi up
//   pulumi stack export --file state.json
//   pulumi login s3://<stateBucket>
//   pulumi stack select prod --create && pulumi stack import --file state.json
//
// Every other stack in infra/ logs in to s3://<stateBucket>.

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const stateBucketName = config.require("stateBucket");

const state = new aws.s3.Bucket("pulumi-state", {
  bucket: stateBucketName,
  tags: { app: "nomadops.io", component: "bootstrap" },
}, { protect: true });

new aws.s3.BucketVersioningV2("pulumi-state-versioning", {
  bucket: state.id,
  versioningConfiguration: { status: "Enabled" },
});

new aws.s3.BucketServerSideEncryptionConfigurationV2("pulumi-state-encryption", {
  bucket: state.id,
  rules: [{ applyServerSideEncryptionByDefault: { sseAlgorithm: "AES256" } }],
});

new aws.s3.BucketPublicAccessBlock("pulumi-state-public-access-block", {
  bucket: state.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});

export const stateBucket = state.bucket;
