---
date: 2026-02-03
status: active
---

# The agent writes only to the brain's folders

**Decision:** the agent that keeps the brain can write to `inbox/`, `notes/`, `decisions/`, `projects/` and
`sources/`. It can't push: a host script copies its files into its own clone every 15 minutes and pushes from there.

**Why:** the agent reads untrusted text (captured pages, forwarded mail). If it could edit its own skills or run git
with a login, one planted instruction could change how it behaves or leak the repo. Skills and rule files are
mounted read-only.

**Revisit when:** the agent needs to write somewhere new, or the sync script changes.
