---
name: work-issue
description: Implement one GitHub issue end to end and open a PR that passes the quality gate. Never merges.
argument-hint: <issue-number> [--worktree]
---

Implement issue #$ARGUMENTS in `goargus/goargus`.

Prefix every `gh` call with `export GH_CONFIG_DIR=~/.config/gh`.

## Rules that do not bend

- **One issue per PR.** If you find something broken that this issue does not
  name, report it, do not fix it.
- **Never merge.** You open the PR and stop. A human merges.
- **Never push to `main`.** The ruleset blocks it. Do not use the admin bypass.
- **Never open a red PR.** All three gates pass locally first.
- **Touch only the files the issue lists.** If the change genuinely needs a
  file the issue does not name, add it and say so under Notes for review.

## Phase 1: Read the contract

```
gh issue view $ARGUMENTS --json number,title,body,labels,state
```

Stop immediately if any of these is true:

- The issue is closed.
- It carries the `human` label. That task needs a person, not an agent.
- It has no **Files** section or no **Verification** section. It is not ready
  to implement. Say so and point at `/decompose`. Do not guess the files.

Report the `agent:*` label so the operator knows which model tier this was
sized for.

## Phase 2: Isolate

`git status` must be clean before you start.

Default, in place:

```
git checkout main && git pull
git checkout -b issue-$ARGUMENTS
```

With `--worktree`, when other issues are in flight:

```
git worktree add ../landing_page-issue-$ARGUMENTS -b issue-$ARGUMENTS origin/main
cd ../landing_page-issue-$ARGUMENTS && npm ci
```

## Phase 3: Implement

Work the issue's **Tasks** in order.

Match the code already in the file you are editing. This repo uses Vue 3 with
`<script setup>`, Tailwind, and `vite-plugin-pages` file-based routing. Two
components still use the Options API; that is tracked separately, do not
convert them as a side effect.

If the work turns out materially larger than the contract describes, stop and
report it. Do not expand scope to make it fit.

## Phase 4: Verify locally

All three must pass, in this order:

```
npm run lint      # 0 errors
npm run test:ci   # all pass
npm run build     # succeeds
```

Then run whatever the issue's own **Verification** section specifies. If it
names an expected count, hit that count exactly.

A failing gate means you keep working. It does not mean you open the PR with
a caveat.

## Phase 5: Open the PR

```
git push -u origin issue-$ARGUMENTS
gh pr create --repo goargus/goargus --base main --head issue-$ARGUMENTS \
  --title "<type>: <what changed>" --body "<filled template>"
```

The body follows `.github/pull_request_template.md`:

- `Closes #$ARGUMENTS` on the first line.
- Every Verification box ticked with real numbers, for example
  `npm run test:ci passes, 77 of 77`. Never tick a box you did not run.
- Notes for review names anything the reviewer should look at closely.

Writing style for commits, PR titles and PR bodies: no em dashes, and never
the "it is not X, it is Y" construction. State the point and drop the
discarded half.

No AI fingerprints. Commit messages, PR titles and PR bodies carry no
`Co-Authored-By: Claude ...`, no `Claude-Session:` line, no "Generated with
Claude Code" footer. The commit message ends on its last content line.

## Phase 6: Report and stop

Wait for the `gate` check to report, then give the operator the PR URL and the
check result.

Stop there. Do not merge, do not add it to the merge queue, do not close the
issue. The human decides.
