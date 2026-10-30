import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { check } from '../scripts/check.mjs';
import { assertCommit, root, verify } from '../scripts/upstream.mjs';

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'mstack-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const path of ['skills', 'upstream', '.codex-plugin', '.agents', 'package.json', 'upstream.lock.json']) {
    await cp(join(root, path), join(directory, path), { recursive: true });
  }
  return directory;
}

test('the distributable package has resolving skills and verified source', async () => {
  assert.deepEqual(await check(), { skills: 2, version: '0.1.0' });
});

test('upstream refresh rejects mutable refs and path injection', () => {
  for (const ref of ['main', 'v1', '../escape', '', undefined]) assert.throws(() => assertCommit(ref));
  assert.doesNotThrow(() => assertCommit('a'.repeat(40)));
});

test('modified upstream content is detected offline', async (t) => {
  const directory = await fixture(t);
  await writeFile(join(directory, 'upstream/LICENSE'), 'changed');
  await assert.rejects(verify(directory), /integrity mismatch: LICENSE/);
});

test('an injected upstream path is rejected before reading it', async (t) => {
  const directory = await fixture(t);
  const path = join(directory, 'upstream.lock.json');
  const lock = JSON.parse(await readFile(path, 'utf8'));
  lock.files['../../outside'] = 'a'.repeat(64);
  await writeFile(path, JSON.stringify(lock));
  await assert.rejects(verify(directory), /file set differs/);
});

test('broken runtime references fail package validation', async (t) => {
  const directory = await fixture(t);
  await rm(join(directory, 'skills/mstack/references/t3.md'));
  await assert.rejects(check(directory), /ENOENT/);
});

test('a marketplace pointing outside the package is rejected', async (t) => {
  const directory = await fixture(t);
  const path = join(directory, '.agents/plugins/marketplace.json');
  const market = JSON.parse(await readFile(path, 'utf8'));
  market.plugins[0].source.path = '../private';
  await writeFile(path, JSON.stringify(market));
  await assert.rejects(check(directory));
});
