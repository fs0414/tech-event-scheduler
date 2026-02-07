# =============================================================================
# Cloudflare credentials (injected via environment variables)
# =============================================================================
variable "cloudflare_api_token" {
  description = "Cloudflare API token (TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (TF_VAR_cloudflare_account_id)"
  type        = string
  sensitive   = true
}
