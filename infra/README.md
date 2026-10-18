# Infrastructure

Everything nomadops.io runs on lives here as Pulumi. The stacks are applied from GitHub Actions, except for two first steps that have to happen before Actions can: the bucket that holds state, and the roles Actions assumes.

| Directory | What | Applied by |
|---|---|---|
| `bootstrap/` | The Pulumi state bucket | once, from a laptop, by `bootstrap.sh` |
| `access/` | GitHub OIDC provider and the two roles the Infra workflow assumes | first `up` from a laptop by `bootstrap.sh`, then the Infra workflow |
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

Stack config is committed in `infra/*/Pulumi.prod.yaml`: region, state bucket name, the Route 53 zone for nomadops.io, the contact email.

1. **Run the bootstrap script** from a laptop with the `nomadops-dev` profile, `pulumi`, `aws`, `npm` and (optionally) a logged-in `gh`:
   ```sh
   ./infra/bootstrap.sh
   ```
   It asks for a passphrase, shows the AWS identity it is about to use, then: creates the state bucket with the `bootstrap/` stack on Pulumi's local backend and moves that stack's state into the bucket; runs the first `up` of `access/` (CI can't assume a role that doesn't exist yet); sets the repository secret `PULUMI_CONFIG_PASSPHRASE` and the variables `PULUMI_STATE_BUCKET`, `AWS_INFRA_DEPLOY_ROLE_ARN`, `AWS_INFRA_PREVIEW_ROLE_ARN` (or prints them, with `--no-github` or no `gh`). Every `pulumi up` shows its preview and waits for a yes; `--yes` skips that. Bucket names are global: if `nomadops-pulumi-state` is taken, change `stateBucket` in `bootstrap/` and `access/` `Pulumi.prod.yaml` and run again.
2. Merge; the Infra workflow runs `pulumi up` for `access`, `contact` and `site`. From here on it previews and applies `access` like the other stacks.
3. **Run the script again.** It finds the site stack's outputs and sets `SITE_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID` and `AWS_SITE_DEPLOY_ROLE_ARN`, and prints the contact function URL to put into `src/_data/site.json` as `formAction` and, origin only, into `site/Pulumi.prod.yaml` as `contactFormOrigin`.
4. Push to `main`: the Deploy workflow fills the bucket. Check `https://<distributionDomain>/`.
5. The site stack creates the Route 53 alias records for `nomadops.io` and `www`, so DNS cuts over on that `up`. Confirm both hostnames, then disable GitHub Pages, delete `pages.yml` and `src/CNAME`, and make the repository private.

The script is a wrapper over `pulumi login`, `pulumi stack select --create`, `pulumi up` and `gh variable set`; each step is skipped when it has already happened, so it is safe to run again at any point.

## Day to day

- Site content: merge to `main`, the Deploy workflow does the rest.
- Infra: open a PR touching `infra/`, read the preview comment, merge.
- The contact inbox is the DynamoDB table; the email is a copy. See `contact/README.md`.
