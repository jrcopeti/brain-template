// Tests for skills/lint/scripts/lint.py on a small brain in a temporary folder. Run: node --test
// Needs Python 3 (python3 or python on the PATH); without it the tests are skipped.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repo = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const lintScript = path.join(repo, "skills", "lint", "scripts", "lint.py");
const python = ["python3", "python"].find(
  (cmd) => spawnSync(cmd, ["-c", "import sys; sys.exit(sys.version_info[0] != 3)"]).status === 0,
);
const needsPython = { skip: !python && "no Python 3 on the PATH" };

// A brain with the given files (path → text); index.md lists every one of them.
function brain(files) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "brain-lint-")));
  const index = ["# Index"];
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.join(root, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
    index.push(`- [${rel}](${rel}) — test file`);
  }
  fs.writeFileSync(path.join(root, "index.md"), index.join("\n") + "\n");
  return root;
}

function lint(root) {
  const r = spawnSync(python, [lintScript, "--root", root], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
}

test("the template itself has no lint problems", needsPython, () => {
  const r = lint(repo);
  assert.equal(r.code, 0, r.out);
  assert.doesNotMatch(r.out, /Problems:/);
});

test("a guideline with `source: own` in its front matter passes", needsPython, () => {
  const r = lint(brain({ "guidelines/use-pnpm.md": "---\nsource: own\n---\n# Use pnpm, never npm\n" }));
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /brain lint: clean/);
});

test("`source: own` passes in notes too, in any case and in quotes", needsPython, () => {
  const r = lint(brain({
    "notes/a.md": "---\ntitle: A\nsource: Own\n---\n# A\n",
    "notes/b.md": "---\nsource: \"OWN\"\n---\n# B\n",
  }));
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /brain lint: clean/);
});

test("a guideline with no source still fails", needsPython, () => {
  const r = lint(brain({ "guidelines/use-pnpm.md": "# Use pnpm, never npm\n" }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /no source cited: guidelines\/use-pnpm\.md/);
});

test("`source: own` outside the front matter does not count", needsPython, () => {
  const r = lint(brain({ "guidelines/use-pnpm.md": "# Use pnpm, never npm\n\nsource: own\n" }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /no source cited: guidelines\/use-pnpm\.md/);
});

test("another front-matter source value does not count", needsPython, () => {
  const r = lint(brain({ "guidelines/use-pnpm.md": "---\nsource: someone\n---\n# Use pnpm, never npm\n" }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /no source cited: guidelines\/use-pnpm\.md/);
});

const decision = (fm) => `---\ndate: 2026-01-01\nsource: own\n${fm}\n---\n# D\n`;

test("an amended decision and its amends: pointing at each other pass", needsPython, () => {
  const r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: active\namended_by: decisions/2026-02-01-new.md"),
    "decisions/2026-02-01-new.md": decision("status: active\namends: decisions/2026-01-01-old.md"),
  }));
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /brain lint: clean/);
});

test("an amended_by that points to nothing, or to no decision, fails", needsPython, () => {
  for (const by of ["decisions/2026-02-01-gone.md", "decisions", "notes/n.md"]) {
    const r = lint(brain({
      "decisions/2026-01-01-old.md": decision(`status: active\namended_by: ${by}`),
      "notes/n.md": "---\nsource: own\n---\n# N\n",
    }));
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, /amended_by: decisions\/2026-01-01-old\.md/);
  }
});

test("an amends: without amended_by on the older decision fails, and the reverse", needsPython, () => {
  let r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: active"),
    "decisions/2026-02-01-new.md": decision("status: active\namends: decisions/2026-01-01-old.md"),
  }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /amends: decisions\/2026-02-01-new\.md/);
  r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: active\namended_by: decisions/2026-02-01-new.md"),
    "decisions/2026-02-01-new.md": decision("status: active"),
  }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /amended_by: decisions\/2026-01-01-old\.md/);
});

test("a supersedes: without superseded_by on the older decision fails", needsPython, () => {
  const r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: active"),
    "decisions/2026-02-01-new.md": decision("status: active\nsupersedes: decisions/2026-01-01-old.md"),
  }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /supersedes: decisions\/2026-02-01-new\.md/);
});

test("a decision amended twice lists both, inline or as a list", needsPython, () => {
  for (const by of ["[decisions/2026-02-01-b.md, decisions/2026-03-01-c.md]",
                    "\n  - decisions/2026-02-01-b.md\n  - decisions/2026-03-01-c.md"]) {
    const r = lint(brain({
      "decisions/2026-01-01-a.md": decision(`status: active\namended_by: ${by}`),
      "decisions/2026-02-01-b.md": decision("status: active\namends: decisions/2026-01-01-a.md"),
      "decisions/2026-03-01-c.md": decision("status: active\namends: decisions/2026-01-01-a.md"),
    }));
    assert.equal(r.code, 0, r.out);
  }
});

test("a superseded pair pointing at each other passes, with quotes or ./ paths", needsPython, () => {
  const r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: 'superseded'\nsuperseded_by: ./decisions/2026-02-01-new.md"),
    "decisions/2026-02-01-new.md": decision("status: active\nsupersedes: \"decisions/2026-01-01-old.md\""),
  }));
  assert.equal(r.code, 0, r.out);
});

test("superseded_by without supersedes: back, or without its status, fails", needsPython, () => {
  let r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: superseded\nsuperseded_by: decisions/2026-02-01-new.md"),
    "decisions/2026-02-01-new.md": decision("status: active"),
  }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /superseded_by: decisions\/2026-01-01-old\.md names decisions\/2026-02-01-new\.md, which has no supersedes: back/);
  r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: active\nsuperseded_by: decisions/2026-02-01-new.md"),
    "decisions/2026-02-01-new.md": decision("status: active\nsupersedes: decisions/2026-01-01-old.md"),
  }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /superseded_by: decisions\/2026-01-01-old\.md is set, but its status isn't superseded/);
  r = lint(brain({ "decisions/2026-01-01-old.md": decision("status: superseded") }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /superseded decision without an existing superseded_by: decisions\/2026-01-01-old\.md/);
});

test("a list with one entry that is no decision fails", needsPython, () => {
  const r = lint(brain({
    "decisions/2026-01-01-old.md": decision("status: superseded\nsuperseded_by: [decisions/2026-02-01-new.md, decisions/typo.md]"),
    "decisions/2026-02-01-new.md": decision("status: active\nsupersedes: decisions/2026-01-01-old.md"),
  }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /names decisions\/typo\.md, which is no decision/);
});

test("a decision that names itself fails", needsPython, () => {
  const r = lint(brain({
    "decisions/2026-02-01-new.md": decision("status: active\namends: decisions/2026-02-01-new.md\namended_by: decisions/2026-02-01-new.md"),
  }));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /amends: decisions\/2026-02-01-new\.md names itself/);
});
