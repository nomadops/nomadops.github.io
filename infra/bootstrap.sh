#!/usr/bin/env bash
# Bootstrap the AWS side of nomadops.io, once, from a laptop. Everything after
# this runs from GitHub Actions.
#
#   1. The Pulumi state bucket (bootstrap/). Created on Pulumi's local backend,
#      then its state is moved into the bucket it created, so nothing stays on
#      this machine.
#   2. The GitHub OIDC provider and the two CI roles (access/): the one `up`
#      CI cannot do for itself.
#   3. The repository secret and variables the Infra and Deploy workflows read,
#      set with gh when it is installed and logged in, printed otherwise.
#
# Re-running is safe. Steps that already happened are skipped, and step 3 also
# picks up the outputs of stacks the Infra workflow has applied since, so run it
# again after the first Infra run to set the SITE_* variables.
set -euo pipefail

usage() {
  cat <<'EOF'
usage: infra/bootstrap.sh [--yes] [--no-github]

  --yes        no confirmations; pulumi up --yes
  --no-github  print the repository settings instead of applying them with gh

environment
  AWS_PROFILE               AWS CLI profile (default nomadops-dev)
  PULUMI_STACK              stack name (default prod); reads infra/*/Pulumi.<stack>.yaml
  PULUMI_CONFIG_PASSPHRASE  passphrase for stack secrets; prompted for when unset.
                            The repository secret of the same name must hold the same value.
  GITHUB_REPO               owner/repo for the settings (default: the access stack's githubRepo)
EOF
}

here=$(cd "$(dirname "$0")" && pwd)
stack=${PULUMI_STACK:-prod}
yes=0
github=1

for arg in "$@"; do
  case $arg in
    -y|--yes) yes=1 ;;
    --no-github) github=0 ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
done

say()  { printf '\n==> %s\n' "$*"; }
note() { printf '    %s\n' "$*"; }
die()  { printf 'bootstrap: %s\n' "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "$1 is required ($2)"; }

confirm() {
  [ "$yes" = 1 ] && return 0
  local answer
  read -r -p "    $1 [y/N] " answer
  case $answer in y|Y|yes|YES) return 0 ;; *) return 1 ;; esac
}

# A value from Pulumi.<stack>.yaml. The files are ours and flat, so no YAML parser:
# "  <key>: <value>" with an optional trailing comment.
config_value() { # file key
  sed -n "s/^  $2: *//p" "$1" | sed 's/[[:space:]]*#.*$//; s/^"\(.*\)"$/\1/' | head -n 1
}

pulumi_up() { if [ "$yes" = 1 ]; then pulumi up --yes; else pulumi up; fi; }
login_local() { pulumi login --local >/dev/null; }
login_s3()    { pulumi login "s3://$bucket" >/dev/null; }
stack_exists() { (cd "$1" && pulumi stack select "$stack" >/dev/null 2>&1); }   # on the current backend
output() { (cd "$1" && pulumi stack output "$2" 2>/dev/null) || true; }
npm_ci() { npm ci --no-audit --no-fund --loglevel=error; }

# The bucket exists now, so its own stack can live in it: export from the local
# backend, import into the S3 backend, drop the local copy.
move_bootstrap_state() {
  local export_file
  export_file=$(mktemp -t nomadops-bootstrap-state.XXXXXX)
  (cd "$here/bootstrap" && pulumi stack export --file "$export_file")
  login_s3
  (cd "$here/bootstrap" && pulumi stack select "$stack" --create && pulumi stack import --file "$export_file")
  note "preview against the moved state; it should report no changes"
  (cd "$here/bootstrap" && { [ -d node_modules ] || npm_ci; } && pulumi preview)
  login_local
  (cd "$here/bootstrap" && pulumi stack rm "$stack" --yes --force)   # state only; the bucket stays
  login_s3
  note "bootstrap stack state is in s3://$bucket now (export kept at $export_file)"
}

# AWS allows one OIDC provider per URL. If the account already has one for GitHub
# (an earlier Actions setup), the access stack adopts it instead of creating it.
adopt_github_oidc() {
  local arn
  arn=$(aws iam list-open-id-connect-providers --query 'OpenIDConnectProviderList[].Arn' --output text \
    | tr '\t' '\n' | grep 'oidc-provider/token.actions.githubusercontent.com$' || true)
  [ -n "$arn" ] || return 0
  pulumi stack export | grep -q 'OpenIdConnectProvider::github-oidc"' && return 0
  note "the account already has a GitHub OIDC provider ($arn); importing it into the access stack"
  pulumi import aws:iam/openIdConnectProvider:OpenIdConnectProvider github-oidc "$arn" \
    --yes --protect=false --generate-code=false
}

need pulumi "https://www.pulumi.com/docs/install/"
need aws "https://aws.amazon.com/cli/"
need npm "Node.js 22"

bootstrap_cfg=$here/bootstrap/Pulumi.$stack.yaml
access_cfg=$here/access/Pulumi.$stack.yaml
[ -f "$bootstrap_cfg" ] || die "no $bootstrap_cfg"
[ -f "$access_cfg" ] || die "no $access_cfg"

region=$(config_value "$bootstrap_cfg" "aws:region")
bucket=$(config_value "$bootstrap_cfg" "nomadops-bootstrap:stateBucket")
access_bucket=$(config_value "$access_cfg" "nomadops-access:stateBucket")
[ -n "$region" ] || die "no aws:region in $bootstrap_cfg"
[ -n "$bucket" ] || die "no stateBucket in $bootstrap_cfg"
[ "$bucket" = "$access_bucket" ] || die "stateBucket differs: $bucket (bootstrap) vs $access_bucket (access)"

repo=${GITHUB_REPO:-$(config_value "$access_cfg" "nomadops-access:githubRepo")}
[ -n "$repo" ] || repo=$(git -C "$here" remote get-url origin 2>/dev/null | sed -E 's#.*github\.com[:/]##; s#\.git$##')
[ -n "$repo" ] || repo=nomadops/nomadops.github.io

export AWS_PROFILE=${AWS_PROFILE:-nomadops-dev}
export AWS_REGION=$region AWS_DEFAULT_REGION=$region

# One passphrase for every stack: the workflow decrypts them all with the
# PULUMI_CONFIG_PASSPHRASE repository secret, so it has to match what is used here.
if [ -n "${PULUMI_CONFIG_PASSPHRASE_FILE:-}" ] && [ -z "${PULUMI_CONFIG_PASSPHRASE:-}" ]; then
  PULUMI_CONFIG_PASSPHRASE=$(cat "$PULUMI_CONFIG_PASSPHRASE_FILE")
  unset PULUMI_CONFIG_PASSPHRASE_FILE
fi
if [ -z "${PULUMI_CONFIG_PASSPHRASE:-}" ]; then
  say "Pulumi passphrase"
  note "Encrypts stack secrets in the state bucket. Keep a copy somewhere safe:"
  note "the PULUMI_CONFIG_PASSPHRASE repository secret must hold the same value."
  read -r -s -p "    Passphrase: " PULUMI_CONFIG_PASSPHRASE; echo
  read -r -s -p "    Again: " again; echo
  [ -n "$PULUMI_CONFIG_PASSPHRASE" ] || die "empty passphrase"
  [ "$PULUMI_CONFIG_PASSPHRASE" = "$again" ] || die "passphrases do not match"
fi
export PULUMI_CONFIG_PASSPHRASE

say "AWS identity"
account=$(aws sts get-caller-identity --query Account --output text) || die "no credentials for profile $AWS_PROFILE"
caller=$(aws sts get-caller-identity --query Arn --output text)
note "profile $AWS_PROFILE, region $region"
note "account $account, caller $caller"
note "repository $repo, stack $stack"
confirm "Bootstrap this account?" || die "stopped"

say "1/3 State bucket s3://$bucket"
if head=$(aws s3api head-bucket --bucket "$bucket" 2>&1); then
  status=ours
else
  case $head in
    *"(404)"*) status=missing ;;
    *"(403)"*) status=taken ;;
    *) die "aws s3api head-bucket: $head" ;;
  esac
fi
case $status in
  taken)
    die "s3://$bucket belongs to another AWS account. Bucket names are global: change stateBucket in $bootstrap_cfg and $access_cfg and run again." ;;
  missing)
    note "not found; creating it with the bootstrap stack on Pulumi's local backend"
    login_local
    (cd "$here/bootstrap" && npm_ci && pulumi stack select "$stack" --create && pulumi_up)
    move_bootstrap_state ;;
  ours)
    login_s3
    if stack_exists "$here/bootstrap"; then
      note "exists, and the bootstrap stack already lives in it"
    else
      login_local
      if stack_exists "$here/bootstrap"; then
        note "exists; the bootstrap stack is still on this machine's local backend, moving it"
        move_bootstrap_state
      else
        note "exists, but no bootstrap stack manages it; leaving it alone"
        login_s3
      fi
    fi ;;
esac

say "2/3 GitHub Actions access: OIDC provider and roles"
login_s3
(cd "$here/access" && npm_ci && pulumi stack select "$stack" --create && adopt_github_oidc && pulumi_up)
deploy_role=$(output "$here/access" infraDeployRoleArn)
preview_role=$(output "$here/access" infraPreviewRoleArn)
[ -n "$deploy_role" ] && [ -n "$preview_role" ] || die "the access stack has no role outputs; read the pulumi output above"

say "3/3 Repository settings for $repo"
vars="PULUMI_STATE_BUCKET=$bucket
AWS_INFRA_DEPLOY_ROLE_ARN=$deploy_role
AWS_INFRA_PREVIEW_ROLE_ARN=$preview_role"

# Outputs of stacks the Infra workflow has applied already, if any.
site_ready=0
if stack_exists "$here/site"; then
  site_bucket=$(output "$here/site" bucketName)
  distribution=$(output "$here/site" distributionId)
  site_role=$(output "$here/site" deployRoleArn)
  case $distribution in
    ""|"("*) note "the site stack is applied but has no distribution yet (certificate pending); SITE_* variables come later" ;;
    *) site_ready=1
       vars="$vars
SITE_BUCKET=$site_bucket
CLOUDFRONT_DISTRIBUTION_ID=$distribution
AWS_SITE_DEPLOY_ROLE_ARN=$site_role" ;;
  esac
else
  note "the site stack is not applied yet; run this again after the first Infra run for SITE_BUCKET, CLOUDFRONT_DISTRIBUTION_ID, AWS_SITE_DEPLOY_ROLE_ARN"
fi
function_url=""
if stack_exists "$here/contact"; then
  function_url=$(output "$here/contact" functionUrl)
fi

note "secret   PULUMI_CONFIG_PASSPHRASE  (the passphrase used above)"
printf '%s\n' "$vars" | while IFS='=' read -r name value; do
  note "variable $name=$value"
done

if [ "$github" = 1 ] && command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  if confirm "Set these on $repo with gh?"; then
    printf '%s' "$PULUMI_CONFIG_PASSPHRASE" | gh secret set PULUMI_CONFIG_PASSPHRASE --repo "$repo"
    printf '%s\n' "$vars" | while IFS='=' read -r name value; do
      gh variable set "$name" --repo "$repo" --body "$value"
    done
    note "set"
  else
    note "not set; Settings → Secrets and variables → Actions on github.com/$repo"
  fi
else
  [ "$github" = 1 ] && note "gh is not installed or not logged in"
  note "set them by hand: Settings → Secrets and variables → Actions on github.com/$repo"
fi

say "Done"
note "pulumi is logged in to s3://$bucket; every stack under infra/ uses it from here on."
if [ "$site_ready" = 1 ]; then
  note "Push to main: the Deploy workflow fills the bucket and invalidates CloudFront."
else
  note "Merge to main: the Infra workflow applies access, contact and site. Then run this again for the SITE_* variables."
fi
if [ -n "$function_url" ]; then
  origin=$(printf '%s' "$function_url" | sed -E 's#^(https?://[^/]+).*#\1#')
  note "contact form: formAction in src/_data/site.json is $function_url"
  note "and contactFormOrigin in site/Pulumi.$stack.yaml is $origin"
fi
