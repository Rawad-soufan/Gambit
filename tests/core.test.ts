import assert from 'node:assert/strict';
import { test } from 'node:test';
import { makeSeedEntries } from '../src/data/seed';
import { estimatedMax, searchEntries, volume } from '../src/lib/calculations';
import { createLiftRepository } from '../src/lib/repository';
import { liftSchema, loginSchema } from '../src/lib/validation';

test('estimated strength and volume respond to edited lift values', () => {
  assert.equal(estimatedMax({ weightKg: 150, reps: 1 }), 150);
  assert.ok(Math.abs(estimatedMax({ weightKg: 100, reps: 5 }) - 116.6666667) < 0.0001);
  assert.equal(volume({ weightKg: 100, reps: 5, sets: 3 }), 1500);
  assert.equal(estimatedMax({ weightKg: 150, reps: 3 }), 165);
  assert.equal(estimatedMax({ weightKg: 100, reps: 3 }), 110.00000000000001);
});

test('search matches notes and full exercise names while applying the exercise filter', () => {
  const entries = makeSeedEntries();
  assert.equal(searchEntries(entries, 'paused', 'bench').length, 2);
  assert.equal(searchEntries(entries, 'bench press', 'all').length, 3);
  assert.equal(searchEntries(entries, 'paused', 'squat').length, 0);
});

test('login and lift validation reject invalid forms and preserve decimal weights', () => {
  const valid = { exercise: 'squat', weightKg: '82.5', sets: '3', reps: '5', date: '2026-01-01', notes: '' };
  assert.equal(liftSchema.parse(valid).weightKg, 82.5);
  for (const change of [{ weightKg: '' }, { weightKg: '-1' }, { weightKg: 'abc' }, { weightKg: '501' },
    { sets: '0' }, { sets: '1.5' }, { reps: '11' }, { exercise: 'curl' }, { date: '2026-02-30' },
    { date: '2999-01-01' }, { notes: 'a'.repeat(301) }]) {
    assert.equal(liftSchema.safeParse({ ...valid, ...change }).success, false, JSON.stringify(change));
  }
  assert.equal(loginSchema.safeParse({ email: '', password: '' }).success, false);
  assert.equal(loginSchema.safeParse({ email: 'not-email', password: 'hello' }).success, false);
});

test('first launch seeds once and CRUD survives a new repository including an empty collection', async () => {
  let persisted: string | null = null;
  let seeds = 0;
  const adapter = { getItem: async () => persisted, setItem: async (_key: string, value: string) => { persisted = value; } };
  const seed = () => { seeds++; return makeSeedEntries(); };
  const repository = createLiftRepository(adapter);
  const original = await repository.load(seed);
  const created = { ...original[0]!, id: 'new', weightKg: 82.5 };
  await repository.save([...original, created]);
  let loaded = await createLiftRepository(adapter).load(seed);
  assert.equal(loaded.at(-1)?.weightKg, 82.5);
  await repository.save(loaded.map(entry => entry.id === 'new' ? { ...entry, notes: 'Edited' } : entry));
  loaded = await createLiftRepository(adapter).load(seed);
  assert.equal(loaded.find(entry => entry.id === 'new')?.notes, 'Edited');
  await repository.save(loaded.filter(entry => entry.id !== 'new'));
  assert.equal((await createLiftRepository(adapter).load(seed)).length, original.length);
  await repository.save([]);
  assert.deepEqual(await createLiftRepository(adapter).load(seed), []);
  assert.equal(seeds, 1);
});

test('read failures and corrupted data never silently seed or overwrite storage', async () => {
  let writes = 0;
  let seeds = 0;
  const seed = () => { seeds++; return makeSeedEntries(); };
  for (const raw of ['broken json', '{}', '[{"id":"bad"}]']) {
    const repository = createLiftRepository({ getItem: async () => raw, setItem: async () => { writes++; } });
    await assert.rejects(repository.load(seed));
  }
  const repository = createLiftRepository({ getItem: async () => { throw new Error('read failed'); }, setItem: async () => { writes++; } });
  await assert.rejects(repository.load(seed));
  assert.equal(writes, 0); assert.equal(seeds, 0);
});

test('a storage write failure is propagated instead of being reported as success', async () => {
  const repository = createLiftRepository({ getItem: async () => '[]', setItem: async () => { throw new Error('storage full'); } });
  await assert.rejects(repository.save(makeSeedEntries()), /storage full/);
});
