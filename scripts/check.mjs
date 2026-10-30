import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, verify } from './upstream.mjs';

export async function check(directory = root) {
  const json = async (path) => JSON.parse(await readFile(resolve(directory, path), 'utf8'));
  const plugin = await json('.codex-plugin/plugin.json');
  const market = await json('.agents/plugins/marketplace.json');
  const pkg = await json('package.json');
  assert.equal(plugin.name, 'mstack');
  assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
  assert.equal(plugin.version, pkg.version);
  assert.equal(plugin.skills, './skills/');
  assert.equal(market.name, 'mstack');
  assert.equal(market.plugins.length, 1);
  assert.equal(market.plugins[0].name, plugin.name);
  assert.deepEqual(market.plugins[0].source, { source: 'local', path: './' });
  assert.ok(plugin.interface.displayName && plugin.interface.shortDescription);

  const names = await readdir(resolve(directory, 'skills'));
  assert.deepEqual(names.sort(), ['mstack', 'mstack-review']);
  for (const name of names) {
    const skill = await readFile(resolve(directory, 'skills', name, 'SKILL.md'), 'utf8');
    assert.ok(skill.startsWith(`---\nname: ${name}\ndescription: `), `Invalid skill frontmatter: ${name}`);
    const meta = await readFile(resolve(directory, 'skills', name, 'agents/openai.yaml'), 'utf8');
    assert.ok(meta.includes(`$${name}`), `Missing invocation: ${name}`);
    await checkLinks(resolve(directory, 'skills', name), directory);
  }
  await verify(directory);
  return { skills: names.length, version: plugin.version };
}

async function checkLinks(folder, directory) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) await checkLinks(path, directory);
    else if (entry.name.endsWith('.md')) {
      const markdown = await readFile(path, 'utf8');
      for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = match[1].split('#')[0];
        if (!target || /^[a-z]+:/i.test(target)) continue;
        const full = resolve(dirname(path), target);
        assert.ok(full.startsWith(`${resolve(directory, 'skills')}${sep}`), `Skill link escapes package: ${target}`);
        assert.ok((await stat(full)).isFile(), `Broken skill link: ${target}`);
      }
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(await check()); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
