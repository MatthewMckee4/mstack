---
name: mstack
description: Apply mstack engineering playbooks to substantial implementation, debugging, refactoring, performance, or investigation tasks. Use when asked for mstack or a rigorous end-to-end engineering workflow.
---

# mstack

Understand the system, make the change the evidence supports, and verify the result.
Adapted from Lauren Tan's pstack. This is a Codex workflow, not a Cursor emulator.

## Start with the task

Read the repository's applicable instructions and inspect its status before editing.
Preserve unrelated work. Follow its worktree, test, browser, commit, and PR rules.
Use available specialist skills when they own the workflow; do not replace an existing
verification harness with improvised orchestration.

Identify the requested outcome and the observable check that would establish it.
For substantial work, state the intended outcome briefly and keep a small plan.
For a one-line change, use the relevant check without the full ceremony.

Read [playbooks](references/playbooks.md) and select only the relevant section.
Read [engineering](references/engineering.md) for implementation or design work.
Use [review](references/review.md) when a review is requested or the change warrants it.

## Choose the runtime

Use [Codex](references/codex.md) for native delegation and serial fallbacks.
When T3 tools are exposed, or the user requests T3 orchestration, read
[T3 Code](references/t3.md) before delegating or managing a PR. Native Codex remains
the fallback when it can satisfy the request; explain any missing capability that
changes the outcome. Do not claim multi-model coverage from repeated passes by one model.

Delegate when it produces independent evidence or useful parallel work, and only
within the active request and host rules. A skill invocation does not override a
host restriction on delegation. Keep integration and final verification with the
parent. Do small or tightly coupled work directly.

## Finish with evidence

Rerun the original reproduction or acceptance check. Run the owning component's
required checks and hooks. Report failures and unavailable checks clearly.
For UI changes, verify the actual surface using the user's chosen browser and the
repository's verification skills. Passing compilation alone does not verify behavior.

Report the outcome, the relevant checks and results, and material limitations.
Separate observed facts from hypotheses. Do not inflate an uncertain result into a pass.
Commits, pushes, PRs, merges, deployment, messages, monitors, and schedules stay within
the user's authorization. Do not add a publishing step merely because a playbook ends.

This skill adds no persistence hooks. Apply it in the current task; do not claim it
will remain active in a new task. Personal models and repository conventions belong
in the user's own configuration, not this package.
