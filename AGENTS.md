# Working on mstack

Read README.md and CONTRIBUTING.md before editing. Keep runtime skills self-contained
under skills/. Keep personal account settings, model defaults, paths, and credentials
outside the package. Existing repository and host instructions override skill defaults.

Work in a dedicated Git worktree under .worktrees/ and preserve unrelated changes.
Keep upstream/ byte-identical to upstream.lock.json. Adapt behavior in skills/; do not
patch the source snapshot. Use a full commit SHA for source refreshes and review the
upstream diff before changing the pin.

Run node scripts/check.mjs, node --test tests/package.test.mjs, and uvx prek run -a.
Tests validate packaging and integrity, not model behavior. Describe runtime checks
and gaps honestly. Do not add hooks, automations, or user configuration as a side
effect of installing the plugin.
