# Contact form backend

The site's contact form posts to a Lambda Function URL in the nomadops AWS account. The function validates the submission (required fields, size limits, a honeypot field, the request origin, a per-IP rate limit), stores it in a DynamoDB table and emails a copy through SES, then redirects the visitor to `/thanks/` (or `/sorry/` if something failed). The site needs no JavaScript for this.

## Deploy

Prerequisites: the Pulumi CLI, Node 20 or later, and an AWS profile with permission to create the Lambda, DynamoDB, SES and IAM resources.

```sh
cd infra/contact
npm install
pulumi stack init prod          # first time only
pulumi config set aws:region eu-west-1
pulumi config set email you@nomadops.io   # receives the messages; also the SES sender
pulumi up
```

1. SES emails the address a verification link on the first `up`. Click it. In SES's default sandbox the function can only send to verified addresses, which is all it needs: the sender and the recipient are the same address.
2. Copy the `functionUrl` output into `src/_data/site.json` as `formAction` and open a PR for the site.
3. Submit the form once from the live site and confirm the email arrives and the row exists in the table.

## Operating it

- Messages live in the DynamoDB table (`pk` = `msg#<uuid>`). The email is a copy; the table is the record.
- Rate limiting: 5 submissions per IP per hour by default (`RATE_LIMIT`, `RATE_WINDOW_SECONDS` on the function). Counter rows expire on their own.
- `messageTtlDays` (Pulumi config) sets an expiry on message rows; `0` keeps them forever.
- Failures land in the function's CloudWatch log group with the string `contact form failure`.
- Cost at contact-form volume is within the AWS free tiers for Lambda and DynamoDB; SES is billed per message after any free allowance.
