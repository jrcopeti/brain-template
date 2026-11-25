# Index

Read this first. One line per file: what it is, so you know whether to open it.

## Intents
- [Example app: public launch](intents/example-app-public-launch.md) — the goal, why, and the check that says it's done.

## Guidelines
- [Integration tests use a real database](guidelines/integration-tests-real-database.md) — never mock the database in integration tests; start a real one in a container.
- [Test behavior, not implementation](guidelines/test-behavior-not-implementation.md) — test through the public API; a refactor that changes no behavior must not break a test.

## Decisions
- [2026-01-15 Postgres as the default database](decisions/2026-01-15-postgres-default-database.md) — new projects start on Postgres unless there is a reason not to; amended for production hosting.
- [2026-02-03 The agent writes only to the brain's folders](decisions/2026-02-03-agent-writes-only-to-the-brain-folders.md) — the agent can't push or edit its skills; a host script syncs its files.
- [2026-02-12 Managed Postgres in production](decisions/2026-02-12-managed-postgres-in-production.md) — production uses a managed service; tests keep a container. Amends the Postgres default.

## Projects
- [Example app](projects/example-app.md) — what it is, where it runs, its status.

## Notes
- [Why mocks hide database bugs](notes/why-mocks-hide-database-bugs.md) — the failure modes a mocked database misses, with the source.
- [The lethal trifecta](notes/lethal-trifecta.md) — private data, untrusted input and a way out in one session; cut one leg per job.
- [Regression evals](notes/regression-evals.md) — tasks from real failures, graded on output, run several times (pass^k).
