---
source: own
captured_at: 2026-02-05T10:00:00Z
captured_by: you
note: "example source for the agent-safety and eval notes"
fetch: text-only
---

Notes from a talk on running an agent safely.

- Prompt injection is data that reads like instructions; the model is not a security boundary.
- Private data, untrusted input and a way out in one session is the lethal trifecta. Cut one leg per job.
- An eval is a task plus graders. Run each task several times; pass^k asks whether all k tries work.
