# Task playbooks

Read the section that matches the task. Combine sections only when the work needs it.
A playbook is a method within the request, not permission to publish or start a daemon.

## Investigation

Trace the entry point, callers, data, and relevant history. State competing explanations
and run the smallest useful probes. Return a cited explanation with observed behavior
and remaining uncertainty. A read-only question stays read-only.

## Bug fix

Reproduce the failure on the affected surface. If it cannot be reached, name the
blocked check and gather the closest evidence without claiming reproduction.
Narrow the cause with discriminating experiments. Confirm the mechanism before fixing.
Add a regression test when a useful local test exists, observe it fail, make the fix,
and observe it pass. Rerun the original reproduction and required checks. Report the
root cause, changed behavior, and the checks that support the result.

## Feature

Trace the existing path and define the acceptance behavior, data shape, and boundaries.
Resolve consequential design forks before implementing. Identify independent work and
shared writes before any fan-out; isolate writers or serialize them. Implement the
smallest complete behavior, update affected contracts and guidance, and verify the
acceptance behavior on the actual surface.

## Refactor or migration

Name the behavior to preserve and establish a baseline. Trace all callers and affected
contracts. Move callers coherently, remove obsolete paths, and compare the meaningful
behavior before and after. Preserve append-only or compatibility contracts imposed by
the repository. Avoid a broad rewrite without evidence that it is needed.

## Performance

Define the workload and metric. Measure a baseline with the environment recorded.
Profile to locate the bottleneck. Change one hypothesis at a time and compare equivalent
runs, including variance and relevant resource costs. Retain only supported improvements.
A microbenchmark improvement does not establish an end-user improvement.

## Review

Follow [review](review.md). Findings need a concrete failure mechanism and evidence.
A clean review is a valid outcome; do not create style objections to fill a quota.

## Shipping or PR follow-up

Inspect the intended diff and current head, run required checks, and use the repository's
commit and PR workflow. Publish only within the request. Resolve substantive feedback
and conflicts, rerun checks affected by later edits, and report the exact head reviewed.
In T3, use its linking and monitoring tools as described in [T3 Code](t3.md).
Merge or deploy only when authorized and required protections are satisfied.

## Long or multi-phase work

Keep a concise checkpoint: objective, current head, completed evidence, remaining work,
and unresolved decisions. Separate independent deliverables from coupled changes.
Use durable tasks, recurring schedules, or new top-level conversations only when that
lifecycle is requested. On interruption, leave a resumable checkpoint; do not assume
an in-memory plan or skill survives into another session.
