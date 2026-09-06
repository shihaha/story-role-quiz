import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname.replace(/^\/(.:)/, '$1'));
const out = resolve(root, '.tmp-sim');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
execFileSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'),
  'src/data/types.ts', 'src/data/questions.ts', 'src/data/roles.ts', 'src/utils/matching.ts',
  '--target', 'es2020', '--module', 'commonjs', '--moduleResolution', 'node',
  '--outDir', '.tmp-sim', '--skipLibCheck', 'true', '--esModuleInterop', 'true',
], { cwd: root, stdio: 'inherit' });
writeFileSync(resolve(out, 'package.json'), '{"type":"commonjs"}');
const require = createRequire(resolve(out, 'runner.cjs'));
const { QUESTIONS } = require(resolve(out, 'data/questions.js'));
const { ROLES } = require(resolve(out, 'data/roles.js'));
const { averageVectors, buildResult } = require(resolve(out, 'utils/matching.js'));

function pureDistanceResult(coords) {
  return ROLES
    .map((role) => ({ role, d: Math.sqrt(role.coords.reduce((sum, c, i) => sum + (coords[i] - c) ** 2, 0)) }))
    .sort((a, b) => a.d - b.d)[0].role;
}

function blockAverage(answers, start, end, dim) {
  const vals = [];
  for (let i = start; i <= end; i += 1) {
    const value = answers[i]?.[dim];
    if (value !== null && value !== undefined) vals.push(value);
  }
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : NaN;
}

function sampleAnswerSet() {
  return QUESTIONS.map((q) => q.options[Math.floor(Math.random() * q.options.length)].vector);
}

function gaussian() {
  let u = 0;
  let v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function answersForLatent(latent, randomChance = 0.06) {
  return QUESTIONS.map((q) => {
    if (Math.random() < randomChance) return q.options[Math.floor(Math.random() * q.options.length)].vector;
    let best = q.options[0];
    let bestDist = Infinity;
    for (const option of q.options) {
      let sum = 0;
      let n = 0;
      option.vector.forEach((value, idx) => {
        if (value === null) return;
        sum += (value - latent[idx]) ** 2;
        n += 1;
      });
      const d = n ? sum / n : 0;
      if (d < bestDist) { bestDist = d; best = option; }
    }
    return best.vector;
  });
}

const counts = Object.fromEntries(ROLES.map((r) => [r.id, 0]));
const pureCounts = Object.fromEntries(ROLES.map((r) => [r.id, 0]));
const N = Number(process.argv[2] || 200000);
for (let i = 0; i < N; i += 1) {
  const answers = sampleAnswerSet();
  const coords = averageVectors(answers);
  counts[buildResult(coords, answers).role.id] += 1;
  pureCounts[pureDistanceResult(coords).id] += 1;
}
console.log('\nCurrent-rule distribution');
for (const role of ROLES) {
  const count = counts[role.id];
  console.log(role.id.padEnd(28), String(count).padStart(7), `${(count / N * 100).toFixed(2)}%`);
}
console.log('\nPure-distance distribution');
for (const role of ROLES) {
  const count = pureCounts[role.id];
  console.log(role.id.padEnd(28), String(count).padStart(7), `${(count / N * 100).toFixed(2)}%`);
}

console.log('\nArchetype recovery');
for (const target of ROLES) {
  const answers = QUESTIONS.map((q) => {
    let best = q.options[0];
    let bestDist = Infinity;
    for (const option of q.options) {
      let sum = 0;
      let n = 0;
      option.vector.forEach((v, idx) => {
        if (v === null) return;
        sum += (v - target.coords[idx]) ** 2;
        n += 1;
      });
      const d = n ? sum / n : 0;
      if (d < bestDist) { bestDist = d; best = option; }
    }
    return best.vector;
  });
  if (target.id === 'need-a-real-ending') answers[31] = QUESTIONS[31].options[3].vector;
  if (target.id === 'wait-for-clearer-signal') answers[31] = QUESTIONS[31].options[2].vector;
  const coords = averageVectors(answers);
  const result = buildResult(coords, answers);
  const pure = pureDistanceResult(coords);
  console.log(target.id.padEnd(28), 'rule=>', result.role.id, result.role.id === target.id ? 'OK' : 'MISS', '| pure=>', pure.id, pure.id === target.id ? 'OK' : 'MISS');
  if (['cooling-means-something', 'wait-for-clearer-signal', 'leave-before-rejection', 'need-a-real-ending'].includes(target.id)) {
    console.log('  blocks', {
      signalU: blockAverage(answers, 1, 5, 0).toFixed(2),
      rejectionR: blockAverage(answers, 11, 15, 2).toFixed(2),
      approachA: blockAverage(answers, 16, 19, 3).toFixed(2),
      q29: answers[28],
      q31: answers[30],
      q32: answers[31],
      coords,
    });
  }
}

console.log('\nNoisy coherent recovery (800 profiles per archetype)');
for (const target of ROLES) {
  let correct = 0;
  const trials = 800;
  const outcomes = {};
  for (let i = 0; i < trials; i += 1) {
    const latent = target.coords.map((value) => Math.max(0, Math.min(10, value + gaussian() * 0.8)));
    const answers = answersForLatent(latent, 0.05);
    if (target.id === 'need-a-real-ending' && Math.random() < 0.9) answers[31] = QUESTIONS[31].options[3].vector;
    if (target.id === 'wait-for-clearer-signal' && Math.random() < 0.9) answers[31] = QUESTIONS[31].options[2].vector;
    const coords = averageVectors(answers);
    const id = buildResult(coords, answers).role.id;
    outcomes[id] = (outcomes[id] || 0) + 1;
    if (id === target.id) correct += 1;
  }
  const misses = Object.entries(outcomes)
    .filter(([id]) => id !== target.id)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => `${id}:${count}`)
    .join(', ');
  console.log(target.id.padEnd(28), `${(correct / trials * 100).toFixed(1)}%`, misses ? `| misses ${misses}` : '');
}
