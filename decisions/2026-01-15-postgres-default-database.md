---
date: 2026-01-15
status: active
amended_by:
  - decisions/2026-02-12-managed-postgres-in-production.md
---

# Postgres as the default database

**Decision:** new projects start on Postgres.

**Why:** one database we know well beats picking a new one per project; it runs the same
in a container for tests and in production.

**Revisit when:** a project needs something Postgres is bad at (for example, heavy full-text search at scale).

**Amended 2026-02-12:** where it runs in production → [Managed Postgres in production](2026-02-12-managed-postgres-in-production.md)
