# Brain template

A second brain for your coding agents: one git repo with the knowledge that applies to every
project, read by every agent you run.

[Telma](https://github.com/jrcopeti/telma) keeps a brain exactly like this one. It is adapted from
[dmoka/brain-template](https://github.com/dmoka/brain-template), with these changes:

- **Amended decisions.** When only part of a decision changes, the old one stays active and gains
  `amended_by:`; the new one gets `amends:`. Triage tests which case it is and never supersedes on a guess.
  The lint checks both directions.
- **Instructions in captured pages are data.** Triage files such an item as it would without them, leaves them
  out, and names the item in its report.
- **A `note:` can make pasted text a guideline**, but only on an item you gave it, never on a fetched page.
- **One home for a project's admin facts.** A decision that changes where a project runs, or its status or
  owner, lives in `decisions/`; the project note keeps one line that links to it.
- **Mixed items are split.** Only the rule for every project is filed; the project's own rule goes in its AGENTS.md.
- **A server agent never runs git.** A host script copies its files into its own clone and pushes.
- **Examples on running an agent safely**: what the agent may write, the lethal trifecta, regression evals.

Project-specific knowledge stays in each project (its AGENTS.md and skills). This repo holds
what's true everywhere: your guidelines, your taste, your decisions, a short file per project,
and the four skills that fill it, keep it true, and answer from it.

This is a template: copy it with "Use this template" on GitHub, then delete the example notes and make
the brain your own.

## What's inside

| Path | What it holds |
|---|---|
| `index.md` | one line per file; agents read it first |
| `taste.md` | what good means to you: never, prefer, tie-breakers — each with a reason and a date |
| `intents/` | what you want: one goal per file, with why and how you'll know it's met |
| `inbox/` | new things land here; triage empties it |
| `guidelines/` | how you build in every project; a rule you decided yourself has `source: own` in its front matter |
| `decisions/` | one per file, dated; changed ones are marked superseded (or amended, when only part changed), never deleted |
| `projects/` | one short admin file per project |
| `notes/` | everything else worth keeping, each with its source |
| `sources/` | the originals; never edited |
| `skills/capture` | "save this" → one file in `inbox/` |
| `skills/triage` | files each inbox item in one home, links its source, empties the inbox |
| `skills/lint` | fixes index drift and dead links, reports contradictions |
| `skills/ask-brain` | "what does my brain say about X?" → an answer from the notes, with a link to each one |
| `AGENTS.md` | the rules every agent follows in this repo |
| `install.mjs` | connects the brain to the agents on a machine |
| `sync.mjs` | commits, pulls, pushes |
| `test/` | the scripts' own tests (`node --test`); `.github/` runs them on Windows, macOS and Linux |

The sample files show the shape. Replace them with your own, or delete them.

## Start

1. **Use this template** on GitHub → create a **private** repo, then clone it, e.g. to `~/brain`.
2. Connect it to the coding agents on this machine (needs Node 18 or newer; Windows, macOS, Linux):
   ```bash
   cd ~/brain && node install.mjs
   ```
   It finds Claude Code, Codex, Cursor and Hermes, gives each one the four skills, and adds one
   line to each one's global instruction file:
   > My second brain is at ~/brain. Read its index.md first, then grep it, before you search anywhere else, and save new decisions, guidelines and gotchas there (see its AGENTS.md).

   | Agent | Skills folder | Instruction file |
   |---|---|---|
   | Claude Code | `~/.claude/skills` | `~/.claude/CLAUDE.md` |
   | Codex | `~/.agents/skills` | `~/.codex/AGENTS.md` |
   | Cursor | `~/.agents/skills` | none: Cursor keeps its rules in its settings, so the script prints the line to paste into **Customize → Rules → User Rules** |
   | Hermes | no links: `<brain>/skills` goes into `skills.external_dirs` in `~/.hermes/config.yaml` | `~/.hermes/SOUL.md` |

   Cursor reads `~/.agents/skills` and `~/.claude/skills` and shows a skill found in both once
   (checked in Cursor 3.23). Cursor 2.4 skips linked skill folders: update Cursor first.

   It prints one table: each agent, what it linked, where the line went. It only makes links,
   never copies: a skill folder that is already there and is not a link is left alone. Run it
   again any time; it doesn't duplicate anything.

   **Hermes** (`hermes` on the PATH, `~/.hermes`, or `$HERMES_HOME`; Windows: `%LOCALAPPDATA%\hermes`):
   before its first change the script saves the old config as `config.yaml.bak`. It edits only
   `skills.external_dirs`, line by line; a config.yaml it can't read for sure (tabs, a key twice,
   quoted or merge keys, a value over several lines) stops it with the line number and exit 1,
   before anything changes. It
   warns when another of Hermes's skill folders has a skill with a brain skill's name: Hermes then
   refuses that name ("Ambiguous skill name"). It never creates config.yaml or SOUL.md, and never
   writes into an empty SOUL.md (that would replace Hermes's default persona): Hermes installed but
   never started? Start `hermes` once, then run the script again. Start a new Hermes session to load
   the brain. With `terminal.backend: docker`, mount the brain in the sandbox at the same path
   (`docker_volumes`), or the pointer line names a folder the sandbox doesn't have.

   **Windows:** the links need Developer Mode. Without it the script stops with exit 1 and says
   so: turn on Settings → System → For developers → Developer Mode, then run it again.

## Connect other agents

- **Another machine:** clone the repo, run `node install.mjs` there.
- **Hermes on a box:** clone the repo there and run `node install.mjs` (table above).
- **Codex, Cursor, Hermes:** `node install.mjs` connects them too (table above). Installed one later? Run it again.
- **Any other agent:** paste the pointer line into its global rules, and link `<path>/skills/*` into its skills folder if it has one.
- **A dev container** (like the course's TicketBay box): see [In a dev container](#in-a-dev-container).
- **An agent that can't clone** (a chat app): serve the brain through an MCP server.

## Use it

- **Save something:** tell any agent "save this" with a link, a snippet, or a screenshot.
- **Sort it:** "process my inbox" runs triage, then lint. Or schedule it once a day:
  - Claude Code routine: `/schedule` → daily, prompt "Run git checkout main, then the triage skill, then the lint skill, then node sync.mjs, which pushes to main" on this repo. A routine pushes to a `claude/…` branch unless the prompt names another branch, and sync.mjs pushes the current branch: without the checkout, the inbox on main never empties.
  - Hermes: `hermes cron create "0 6 * * *" "Run triage, then lint, then node sync.mjs" --skill triage --skill lint --workdir <path>`.
- **Keep it true:** "lint the brain" any time; it also runs after every triage.

## Sync

The brain is a git repo, and every agent reads the latest version:
```bash
node sync.mjs   # commit what changed, pull --rebase, push
```
Agents run it after they change the brain (AGENTS.md says so). For a machine that edits the
brain without you, add a cron line. Cron does not see your PATH, so give node's full path (`command -v node` prints it):
`*/15 * * * * cd ~/brain && /usr/local/bin/node sync.mjs`. A push that fails leaves the commit
here, says "NOT pushed" and exits 1; the next run pushes it.

## In a dev container

A dev container sees only its own project, so it keeps its own copy of the brain, cloned from
your brain repo. The course's TicketBay box does this: it clones the brain into its own volume
(`/home/node/brain`) the first time it starts, pulls it every time after that, and runs
`node install.mjs` there (`CLAUDE_DIR=/home/node/.claude`), so Claude Code in the box gets the pointer
line and the skills. It never mounts the brain folder on your laptop, so nothing in the box can
change the files your laptop runs. No brain set up? The box starts without one.

The box pushes the brain itself, with its own deploy key: an SSH key that GitHub accepts for your
brain repo only, so nothing in the box can push to your other repos with it. In the box,
`node sync.mjs` commits and pushes; your laptop gets the box's changes at its next pull (`node sync.mjs`).

🙋 **Give the box its deploy key (once, about 2 minutes):**
1. Make a key pair just for the box, with no passphrase, and name your brain repo:
   ```bash
   mkdir -p ~/.config/brain && chmod 700 ~/.config/brain
   ssh-keygen -t ed25519 -N "" -C "brain box" -f ~/.config/brain/box_deploy_key
   echo 'BRAIN_REPO=git@github.com:<you>/brain.git' > ~/.config/brain/box.env
   ```
2. GitHub → your brain repo → Settings → **Deploy keys** → **Add deploy key**. Paste the contents
   of `~/.config/brain/box_deploy_key.pub`, tick **Allow write access**, and add it.
3. The box reads the folder when it is created: if it is already running, remove it and start it
   again (TicketBay: `.devcontainer/README.md`, "The brain in the box").

The box mounts `~/.config/brain` read-only. `sync.mjs` uses the key only for its own git commands
(`BRAIN_SSH_KEY`), never in a git config. Never put the private key in the brain: it is a git repo.

## Rules worth knowing

- Keep it **private**: it's your knowledge. Never put secrets in it.
- When in doubt, don't create a note. A junk note costs every agent that reads the brain.
- `sources/` is evidence and never edited; everything else is interpretation and links back to it.

MIT license.

Last verified: 2026-10-05 with Claude Code 2.1.289, Codex 0.160.0, Hermes v0.21.5, Node 22 and 18, by `.github/workflows/installer.yml`: real Windows, macOS and Ubuntu runners (the real claude + codex CLIs found on the PATH, install twice, sync against a local bare remote incl. a refused push, home and brain paths with spaces); a real non-admin Windows user (Developer Mode off: the Developer Mode message and exit 1; on: real symlinks); node:22, node:22-alpine and ubuntu:24.04 containers (no agent / Claude only / Codex only / both, each twice); Hermes v0.21.5 installed with its official installer on Ubuntu (`hermes skills list` shows the four skills, the prompt it sends to a stand-in model holds the pointer line, a second run changes nothing, every config.yaml the tests write is read back by Hermes's own YAML parser); `node --test` (49 tests) on all of them.
