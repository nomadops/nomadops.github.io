# Infrastructure

Everything nomadops.io runs on lives here as Pulumi. The stacks are applied from GitHub Actions, except for two first steps that have to happen before Actions can: the bucket that holds state, and the roles Actions assumes.

| Directory | What | Applied by |
|---|---|---|
| `bootstrap/` | The Pulumi state bucket | once, from a laptop, on the local backend |
| `access/` | GitHub OIDC provider and the two roles the Infra workflow assumes | first `up` from a laptop, then the Infra workflow |
| `site/` | S3 bucket, CloudFront distribution, ACM certificate, security headers, www redirect, the narrow role the Deploy workflow uses | the Infra workflow (Pulumi) |
| `contact/` | Lambda + Function URL, DynamoDB table, SES identity and IAM for the contact form | the Infra workflow (Pulumi) |

## The line between infra and deploy

Pulumi owns every resource and its configuration, including the contact function's code, which is small and tied to its IAM. The Deploy workflow owns artifacts only: it syncs the built site into the existing bucket and invalidates CloudFront. An infra change never deploys the site; a site deploy never creates a resource.

## Workflows

- **CI** (`ci.yml`, pull requests): builds the site, checks it, fails on any `<script>`, typechecks both Pulumi programs, runs the contact handler tests.
- **Infra** (`infra.yml`, changes under `infra/`): `pulumi preview` on pull requests, commented on the PR; `pulumi up` on `main`. Assumes `nomadops-infra-preview` (read-only) or `nomadops-infra-deploy` through OIDC. Does nothing until the `PULUMI_STATE_BUCKET` repository variable is set.
- **Deploy site** (`deploy.yml`, pushes to `main`): build, sync to S3, invalidate. Assumes the site stack's deploy role, which can only write that bucket and invalidate that distribution. Does nothing until the `SITE_BUCKET` repository variable is set.

Only first-party actions are used (`actions/*`, `aws-actions/*`, `pulumi/*`); everything else is the AWS CLI in a `run:` step.

## First-time setup

Everything regional lives in `eu-west-1` (the `nomadops-dev` account). The one exception is the ACM certificate, which CloudFront requires in `us-east-1`; the site program creates it there through a second provider.

1. **Bootstrap the state bucket**, once, on Pulumi's local backend (the bucket can't hold its own state):
   ```sh
   export AWS_PROFILE=nomadops-dev
   cd infra/bootstrap && npm install
   pulumi login --local
   pulumi stack select prod --create
   pulumi up
   ```
   Then switch to the S3 backend for everything else: `pulumi login s3://nomadops-pulumi-state`.
2. **Create the CI roles**, first `up` from the laptop (CI can't assume a role that doesn't exist yet):
   ```sh
   cd ../access && npm install
   pulumi stack select prod --create
   pulumi up
   pulumi stack output
   ```
   From here on the Infra workflow previews and applies `access` like the other stacks.
3. **Repository settings** (Settings → Secrets and variables → Actions):
   - Secret `PULUMI_CONFIG_PASSPHRASE`: any long random string; it encrypts stack secrets in the state bucket. Keep it somewhere safe.
   - Variables `AWS_INFRA_DEPLOY_ROLE_ARN` and `AWS_INFRA_PREVIEW_ROLE_ARN` from the access stack's outputs, and `PULUMI_STATE_BUCKET` (`nomadops-pulumi-state`).
4. **Stack config** is committed in `infra/*/Pulumi.prod.yaml`: region `eu-west-1`, the Route 53 zone for nomadops.io, and the contact email (set it before the first `up`).
5. Merge; the Infra workflow runs `pulumi up` for the site and contact stacks. Read the job output for `functionUrl`, `bucketName`, `distributionId`, `deployRoleArn`.
6. More repository variables, from those outputs: `SITE_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `AWS_SITE_DEPLOY_ROLE_ARN`. Put `functionUrl` into `src/_data/site.json` as `formAction` and `contactFormOrigin` into `site/Pulumi.prod.yaml`.
7. Push to `main`: the Deploy workflow fills the bucket. Check `https://<distributionDomain>/`.
8. The site stack creates the Route 53 alias records for `nomadops.io` and `www`, so DNS cuts over on that `up`. Confirm both hostnames, then disable GitHub Pages, delete `pages.yml` and `src/CNAME`, and make the repository private.

## Day to day

- Site content: merge to `main`, the Deploy workflow does the rest.
- Infra: open a PR touching `infra/`, read the preview comment, merge.
- The contact inbox is the DynamoDB table; the email is a copy. See `contact/README.md`.
