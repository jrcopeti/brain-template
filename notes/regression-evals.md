# Regression evals

An eval is a task plus graders; a trial is one attempt, and you run several.

- A capability eval starts low. A regression eval sits near 100% and guards against backsliding.
- Start from 20 to 50 tasks taken from real failures, each with a reference answer.
- Grade what the agent produced, not the steps it took.
- pass@k asks whether one of k tries works; pass^k asks whether all of them do. For a regression eval, use pass^k.
- Read the transcripts: a grader that passes everything is measuring nothing.

Source: [sources/2026-02-05-agent-security-notes.md](../sources/2026-02-05-agent-security-notes.md)
