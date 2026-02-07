# =============================================================================
# Production Environment Configuration
# =============================================================================
#
# All secrets are injected via environment variables:
#   - TF_VAR_cloudflare_api_token
#   - TF_VAR_cloudflare_account_id
#
# Usage:
#   cd infra/environments/prod
#   source ../../.env
#   terraform init
#   terraform plan
#   terraform apply
# =============================================================================
