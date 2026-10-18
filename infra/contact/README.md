# Contact form backend

The site's contact form posts to a Lambda Function URL in the nomadops AWS account. The function validates the submission (required fields, size limits, a honeypot field, the request origin, a per-IP rate limit), stores it in a DynamoDB table and emails a copy through SES, then redirects the visitor to `/thanks/` (or `/sorry/` if something failed). The site needs no JavaScript for this.

## Deploy

Prerequisites: the Pulumi CLI, Node 20 or later, and an AWS profile with permission to create the Lambda, DynamoDB, SES and IAM resources.

The stack is applied by the Infra workflow (see `../README.md`). Config is in `Pulumi.prod.yaml`: region, the recipient address, and the Route 53 zone.

1. With the zone id set, the stack verifies `nomadops.io` in SES with DKIM records in Route 53 and sends from `contact-form@nomadops.io`. A verified domain satisfies the SES sandbox for both sender and recipient, so no production-access request is needed for a form that only emails the team.
2. Copy the `functionUrl` output into `src/_data/site.json` as `formAction`, and its origin into `../site/Pulumi.prod.yaml` as `contactFormOrigin` (so the CSP allows the post).
3. Submit the form once from the live site and confirm the email arrives and the row exists in the table.

## Operating it

- Messages live in the DynamoDB table (`pk` = `msg#<uuid>`). The email is a copy; the table is the record.
- Rate limiting: 5 submissions per IP per hour by default (`RATE_LIMIT`, `RATE_WINDOW_SECONDS` on the function). Counter rows expire on their own.
- `messageTtlDays` (Pulumi config) sets an expiry on message rows; `0` keeps them forever.
- Failures land in the function's CloudWatch log group with the string `contact form failure`.
- Cost at contact-form volume is within the AWS free tiers for Lambda and DynamoDB; SES is billed per message after any free allowance.
