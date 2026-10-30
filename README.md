# mstack

Personal engineering workflows for Codex, adapted from [Lauren Tan's pstack](https://github.com/cursor/plugins/tree/main/pstack), with optional T3 Code integration.

Use `$mstack` to understand a system, implement a change, and verify the behavior.
Use `$mstack-review` for a focused review that reports concrete defects and evidence.

This is an unofficial, focused adaptation. It is not a complete pstack port and is not
affiliated with Cursor, OpenAI, or T3 Code. The initial version keeps two skills and
reads detailed playbooks only when needed.

## Install

In a recent Codex CLI with plugin support:

```sh
codex plugin marketplace add MatthewMckee4/mstack
codex plugin add mstack@mstack
codex plugin list --json
```

Start a new task so the skill catalog reloads. Select the installed skill from the
skill picker if its displayed identity is namespaced by the host.

```text
$mstack This retry path creates duplicate rows. Reproduce it, fix the cause, and verify it.
$mstack-review Review this branch against main for concrete regressions.
```

Skills support normal discovery as well as explicit invocation. There are no session
hooks: invoking mstack does not establish a persistent mode across new tasks.
Installation does not edit AGENTS.md, install agent profiles, change models, or start
monitors or automations. Personal configuration stays with the user's own setup.

## Codex and T3 Code

Standalone Codex uses its available tools and native delegation, with serial fallbacks.
Inside T3, the adapter discovers live providers and models, preserves requested model
options, uses isolated child worktrees, and tracks delegated task IDs. It links PRs and
uses T3's watcher when monitoring is requested. It never creates top-level conversations
as a substitute for subagents. Host rules and the user's browser choice remain authoritative.

The integration is instructions for existing T3 tools, not an MCP server or extension
that adds those capabilities. A missing tool is reported or handled by a documented
fallback. No model access, credentials, Cursor hooks, Bugbot, or Benny automation ships here.

## Updating and removing

```sh
codex plugin marketplace upgrade mstack
codex plugin remove mstack@mstack
codex plugin add mstack@mstack
```

To uninstall completely, remove the plugin and then its marketplace registration:

```sh
codex plugin remove mstack@mstack
codex plugin marketplace remove mstack
```

## Provenance and verification

Lauren Tan created pstack's original workflows. mstack rewrites selected ideas for
Codex and T3: understand callers and data first, fix observed root causes, isolate
parallel writes, and verify real behavior. [NOTICE](NOTICE) records attribution.
[upstream.lock.json](upstream.lock.json) pins selected unmodified source files and
SHA-256 hashes; upstream/ is source evidence, not an active plugin. Runtime instructions
are maintained separately under skills/ rather than generated from the snapshot.

Package checks verify manifests, runtime reference links, and the upstream snapshot.
Tests exercise tamper detection and invalid-package rejection. They do not prove
model behavior or live T3 delegation. See [CONTRIBUTING.md](CONTRIBUTING.md) for checks
and the runtime smoke-test procedure.

MIT licensed. See [LICENSE](LICENSE) and [upstream/LICENSE](upstream/LICENSE).
