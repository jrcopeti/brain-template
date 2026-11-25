# decisions/

One decision per file, named `YYYY-MM-DD-slug.md`, with the date and the reason.

A decision is never deleted. When it changes:
1. write the new decision as a new file,
2. in the old file set `status: superseded` and `superseded_by: decisions/<new file>.md`,
3. in the new file add `supersedes: decisions/<old file>.md`.

When only **part** of a decision changes, amend it instead of superseding the whole file:
1. write the new decision as a new file,
2. leave the old file's status active, add `amended_by: decisions/<new file>.md`, and add one dated line under
   the part that changed: `**Amended YYYY-MM-DD:** <the part> → a link to the new decision`,
3. in the new file add `amends: decisions/<old file>.md`.

The lint checks both directions: `superseded_by:` against `supersedes:`, `amended_by:` against `amends:`, each naming a decision
file, and that a decision with `superseded_by:` has `status: superseded`.
