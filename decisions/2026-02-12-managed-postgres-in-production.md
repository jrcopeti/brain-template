---
date: 2026-02-12
status: active
amends: decisions/2026-01-15-postgres-default-database.md
---

# Managed Postgres in production

**Decision:** production runs on a managed Postgres service, not a self-hosted container. Tests still use a
container.

**Why:** backups and upgrades are not worth our time. The earlier choice of Postgres stands; only where it runs
in production changes.
