import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const paths = [
  'LICENSE', 'README.md',
  'skills/poteto-mode/playbooks/bug-fix.md',
  'skills/poteto-mode/playbooks/feature.md',
  'skills/interrogate/SKILL.md',
  'skills/principle-model-the-domain/SKILL.md',
  'skills/principle-prove-it-works/SKILL.md',
];
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function assertCommit(ref) {
  if (!/^[a-f0-9]{40}$/.test(ref ?? '')) throw new Error('Use a full lowercase 40-character commit SHA');
}

export async function sync(ref, directory = root) {
  assertCommit(ref);
  // Fetch everything before changing the local snapshot.
  const files = await Promise.all(paths.map(async (path) => {
    const url = `https://raw.githubusercontent.com/cursor/plugins/${ref}/pstack/${path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    return [path, Buffer.from(await response.arrayBuffer())];
  }));
  const lock = { repository: 'https://github.com/cursor/plugins', subtree: 'pstack', commit: ref, files: {} };
  for (const [path, bytes] of files) {
    const target = resolve(directory, 'upstream', path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
    lock.files[path] = digest(bytes);
  }
  await writeFile(resolve(directory, 'upstream.lock.json'), `${JSON.stringify(lock, null, 2)}\n`);
}

export async function verify(directory = root) {
  const lock = JSON.parse(await readFile(resolve(directory, 'upstream.lock.json'), 'utf8'));
  assertCommit(lock.commit);
  if (lock.repository !== 'https://github.com/cursor/plugins' || lock.subtree !== 'pstack') {
    throw new Error('Unexpected upstream source');
  }
  if (JSON.stringify(Object.keys(lock.files).sort()) !== JSON.stringify([...paths].sort())) {
    throw new Error('Upstream file set differs from the selected source paths');
  }
  for (const path of paths) {
    const actual = digest(await readFile(resolve(directory, 'upstream', path)));
    if (actual !== lock.files[path]) throw new Error(`Upstream integrity mismatch: ${path}`);
  }
  const diskPaths = await readdir(resolve(directory, 'upstream'), { recursive: true, withFileTypes: true });
  if (diskPaths.filter((entry) => entry.isFile()).length !== paths.length) {
    throw new Error('Unexpected files in upstream snapshot');
  }
  return lock;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, ref] = process.argv.slice(2);
    if (command === 'sync') await sync(ref);
    else if (command === 'verify') await verify();
    else throw new Error('Usage: node scripts/upstream.mjs verify | sync FULL_COMMIT_SHA');
    console.log(`Upstream ${command}: OK`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
