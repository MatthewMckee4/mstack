# Review procedure

Establish the scope from the user's request. For a branch review, determine the intended
base and inspect the merge-base diff, plus staged, unstaged, and relevant untracked work.
Do not assume a clean working tree or silently exclude uncommitted changes. Record the
reviewed head and any working-tree scope. For a PR, read its stated intent and current head.

Trace changed behavior into its callers, contracts, error paths, and tests. Concentrate
on regressions introduced by the change. Use distinct lenses when useful: correctness,
authorization at the owning boundary, compatibility, concurrency, and realistic failure
handling. A full security audit is a separate scope unless requested.

Prefer a failing test, repro command, or observable incorrect result. When execution is
blocked, a concrete source-level counterexample may still be actionable: identify its
inputs and path, label it unexecuted, and do not present it as reproduced. Keep speculative
future risks and stylistic preferences out of the findings.

Independent reviewers receive the goal, exact scope and base, relevant instructions,
expected output, and permission boundaries. Each returns a location, failure mechanism,
impact, and evidence. Keep their repro files isolated. A worktree starts from a commit;
it does not automatically contain the parent's uncommitted changes. Supply a reviewed
patch or snapshot when needed, and confirm what the reviewer actually saw.

The parent checks each finding against the actual scope, reruns feasible reproductions,
and merges duplicate root causes. A child's report alone is not independent verification.
Do not suppress a concrete source-level bug solely because the environment cannot run it.

Report findings in descending importance with precise locations and evidence. State
coverage gaps and unexecuted checks. If none survive, say so and retain material limits.
Do not apply fixes, post comments, or request changes on the host unless authorized.
