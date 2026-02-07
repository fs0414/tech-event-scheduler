terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  # Remote state (Cloudflare R2)
  # backend "s3" {
  #   bucket                      = "terraform-state"
  #   key                         = "tech-event-scheduler/prod/terraform.tfstate"
  #   region                      = "auto"
  #   skip_credentials_validation = true
  #   skip_metadata_api_check     = true
  #   skip_region_validation      = true
  #   skip_requesting_account_id  = true
  #   skip_s3_checksum            = true
  #   endpoints = {
  #     s3 = "https://<account_id>.r2.cloudflarestorage.com"
  #   }
  # }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

locals {
  project_name = "tech-event-scheduler"
}

# =============================================================================
# D1 Database
# =============================================================================
module "d1" {
  source = "../../modules/d1"

  account_id = var.cloudflare_account_id
  name       = local.project_name
}

# =============================================================================
# Workers
# =============================================================================
# Workers are deployed via CI/CD using wrangler deploy
#
# Deployment steps:
#   cd apps/api && wrangler deploy
#   cd apps/web && wrangler deploy
#
# Configure D1 binding in wrangler.toml:
#   [[d1_databases]]
#   binding = "DB"
#   database_name = "tech-event-scheduler"
#   database_id = "<output.d1_database_id>"
# =============================================================================
