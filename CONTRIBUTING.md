# Contributing

Use Node.js 22 or newer for the package tools. They have no npm dependencies.
Create an isolated worktree before making changes:

```sh
git worktree add .worktrees/my-change -b my-change
cd .worktrees/my-change
node scripts/check.mjs
node --test tests/package.test.mjs
uvx prek run -a
```

Runtime instructions live in skills/. The selected unmodified pstack references live
in upstream/ and are not registered skills. To refresh them, select and review an
upstream commit, then run:

```sh
node scripts/upstream.mjs sync FULL_40_CHARACTER_COMMIT_SHA
git diff -- upstream/ upstream.lock.json
node scripts/check.mjs
```

This updates source evidence, not runtime behavior. Port relevant changes into the
Codex instructions deliberately. Keep the license and NOTICE attribution intact.

For behavior changes, exercise a realistic task in a disposable repository and record
what actually happened. Include the host, model when exposed, skill discovery, tool
routing, scope preservation, and acceptance-check result. Structural tests alone do
not establish that a model follows a workflow. Live T3 routing requires a T3 session;
plain Codex must remain usable without that server.

Plugin installation can be tested in a temporary CODEX_HOME. Never use a smoke test
to alter a contributor's normal Codex configuration or enable recurring work.
