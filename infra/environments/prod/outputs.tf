output "d1_database_id" {
  description = "D1 database ID (set in wrangler.toml)"
  value       = module.d1.id
}

output "d1_database_name" {
  description = "D1 database name"
  value       = module.d1.name
}
