import { initDb, upsertProject, insertSnapshot, getAllSnapshots, getProject } from './database.js';
import { Snapshot } from '../types.js';

export function runSeed() {
  initDb();

  const pizza = getProject('pizza-app');
  if (!pizza) {
    upsertProject({
      id: 'pizza-app',
      name: 'pizza-app',
      repoPath: './pizza-app',
      description: 'Artisan pizza delivery ordering service with Stripe checkout integration',
      createdAt: '2026-09-18T10:00:00Z',
    });
    insertSnapshot({
      id: 'snap_pizza_init',
      project: 'pizza-app',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      git: {
        branch: 'feature/stripe-webhook',
        diffSummary: 'src/checkout.js (+42/-3), src/webhook.js (+15/-0)',
        lastCommitMessage: 'wip: add checkout',
        uncommittedFiles: ['src/checkout.js', 'src/webhook.js'],
        additions: 57,
        deletions: 3,
      },
      tests: { failing: ['webhook_signature_test (AssertionError: signature mismatch)'], passing: 12 },
      todos: [{ file: 'src/checkout.js', line: 42, text: 'fix signature validation before charging customer card' }],
    });
  }

  const existing = getAllSnapshots();
  if (existing.length > 5) {
    console.log(`Database already contains ${existing.length} snapshots. Skipping full reseed.`);
    return;
  }

  console.log('Seeding initial projects and snapshot history...');

  // 1. payment-service (Failing test state)
  upsertProject({
    id: 'payment-service',
    name: 'payment-service',
    repoPath: './repos/payment-service',
    description: 'High-throughput Stripe & Adyen payment gateway microservice with webhook reconciliation',
    createdAt: '2026-09-15T10:00:00Z',
  });

  const paymentSnapshots: Snapshot[] = [
    {
      id: 'snap_pay_4',
      project: 'payment-service',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4h ago
      git: {
        branch: 'feat/stripe-webhooks',
        diffSummary: 'src/handlers/webhook.ts (+68/-14), src/auth/jwt.ts (+24/-9), tests/webhook.test.ts (+52/-4)',
        lastCommitMessage: 'wip: migrate raw body parsing to express middleware',
        uncommittedFiles: ['src/handlers/webhook.ts', 'src/auth/jwt.ts', 'tests/webhook.test.ts', 'src/types/stripe.d.ts'],
        additions: 163,
        deletions: 27,
      },
      tests: {
        failing: ['tests/webhook.test.ts:44 (InvalidSignatureError: raw payload stream already drained)'],
        passing: 32,
      },
      todos: [
        { file: 'src/auth/jwt.ts', line: 42, text: 'cache Stripe public signing secret in Redis with 10m TTL' },
        { file: 'src/handlers/webhook.ts', line: 89, text: 'add idempotency key deduplication before persisting charge.succeeded' },
      ],
    },
    {
      id: 'snap_pay_3',
      project: 'payment-service',
      timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), // yesterday
      git: {
        branch: 'feat/stripe-webhooks',
        diffSummary: 'src/handlers/webhook.ts (+30/-2), tests/webhook.test.ts (+40/-0)',
        lastCommitMessage: 'feat: add initial webhook route scaffold',
        uncommittedFiles: ['src/handlers/webhook.ts'],
        additions: 70,
        deletions: 2,
      },
      tests: { failing: ['tests/webhook.test.ts:18 (404 route not found)'], passing: 30 },
      todos: [{ file: 'src/auth/jwt.ts', line: 42, text: 'cache Stripe public signing secret in Redis with 10m TTL' }],
    },
    {
      id: 'snap_pay_2',
      project: 'payment-service',
      timestamp: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
      git: {
        branch: 'feat/stripe-webhooks',
        diffSummary: 'src/types/stripe.d.ts (+19/-0)',
        lastCommitMessage: 'types: declare Stripe event types',
        uncommittedFiles: [],
        additions: 19,
        deletions: 0,
      },
      tests: { failing: [], passing: 30 },
      todos: [],
    },
    {
      id: 'snap_pay_1',
      project: 'payment-service',
      timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
      git: {
        branch: 'main',
        diffSummary: 'clean working tree',
        lastCommitMessage: 'release: v1.8.2 hotfix for auth token refreshes',
        uncommittedFiles: [],
        additions: 0,
        deletions: 0,
      },
      tests: { failing: [], passing: 30 },
      todos: [],
    },
  ];

  // 2. orchestrator-cli (Unresolved TODOs state)
  upsertProject({
    id: 'orchestrator-cli',
    name: 'orchestrator-cli',
    repoPath: './repos/orchestrator-cli',
    description: 'Distributed job runner CLI with concurrency throttling and multi-node work dispatching',
    createdAt: '2026-09-14T08:00:00Z',
  });

  const orchestratorSnapshots: Snapshot[] = [
    {
      id: 'snap_orch_3',
      project: 'orchestrator-cli',
      timestamp: new Date(Date.now() - 9 * 3600 * 1000).toISOString(), // 9h ago
      git: {
        branch: 'fix/concurrency-race',
        diffSummary: 'internal/worker/pool.go (+83/-31), cmd/dispatch.go (+18/-6), internal/worker/pool_test.go (+94/-12)',
        lastCommitMessage: 'fix: replace unbuffered channels with sync.Cond in worker pool',
        uncommittedFiles: ['internal/worker/pool.go', 'cmd/dispatch.go'],
        additions: 195,
        deletions: 49,
      },
      tests: { failing: [], passing: 44 },
      todos: [
        { file: 'internal/worker/pool.go', line: 118, text: 'enforce context.WithTimeout(ctx, 3*time.Second) on drain loop' },
        { file: 'cmd/dispatch.go', line: 67, text: 'emit structured telemetry metric for pool starvation events' },
        { file: 'internal/queue/sqs.go', line: 142, text: 'handle batch delete partial failure return codes' },
      ],
    },
    {
      id: 'snap_orch_2',
      project: 'orchestrator-cli',
      timestamp: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
      git: {
        branch: 'fix/concurrency-race',
        diffSummary: 'internal/worker/pool_test.go (+60/-5)',
        lastCommitMessage: 'test: reproduce race condition with -race flag',
        uncommittedFiles: ['internal/worker/pool_test.go'],
        additions: 60,
        deletions: 5,
      },
      tests: { failing: ['internal/worker/pool_test.go:58 (DATA RACE detected)'], passing: 40 },
      todos: [{ file: 'internal/worker/pool.go', line: 118, text: 'enforce context.WithTimeout' }],
    },
    {
      id: 'snap_orch_1',
      project: 'orchestrator-cli',
      timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      git: {
        branch: 'main',
        diffSummary: 'clean working tree',
        lastCommitMessage: 'perf: benchmark dispatcher throughput under 10k tasks',
        uncommittedFiles: [],
        additions: 0,
        deletions: 0,
      },
      tests: { failing: [], passing: 41 },
      todos: [],
    },
  ];

  // 3. mobile-app-sync (Clean state)
  upsertProject({
    id: 'mobile-app-sync',
    name: 'mobile-app-sync',
    repoPath: './repos/mobile-app-sync',
    description: 'React Native local-first offline storage engine with CRDT conflict resolution',
    createdAt: '2026-09-12T12:00:00Z',
  });

  const mobileSnapshots: Snapshot[] = [
    {
      id: 'snap_mob_3',
      project: 'mobile-app-sync',
      timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(), // yesterday
      git: {
        branch: 'release/v2.4.0',
        diffSummary: 'src/sync/engine.ts (+112/-48), src/db/migrations/v12.sql (+34/-0), test/sync_offline.spec.ts (+145/-22)',
        lastCommitMessage: 'chore(release): bump version to v2.4.0-rc.1',
        uncommittedFiles: [],
        additions: 291,
        deletions: 70,
      },
      tests: { failing: [], passing: 48 },
      todos: [],
    },
    {
      id: 'snap_mob_2',
      project: 'mobile-app-sync',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      git: {
        branch: 'release/v2.4.0',
        diffSummary: 'src/db/migrations/v12.sql (+34/-0)',
        lastCommitMessage: 'migration: add sqlite index on sync_seq_num',
        uncommittedFiles: ['src/db/migrations/v12.sql'],
        additions: 34,
        deletions: 0,
      },
      tests: { failing: [], passing: 47 },
      todos: [],
    },
    {
      id: 'snap_mob_1',
      project: 'mobile-app-sync',
      timestamp: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
      git: {
        branch: 'feat/crdt-resolver',
        diffSummary: 'src/sync/engine.ts (+180/-10)',
        lastCommitMessage: 'feat: implement LWW element set conflict resolver',
        uncommittedFiles: [],
        additions: 180,
        deletions: 10,
      },
      tests: { failing: [], passing: 45 },
      todos: [],
    },
  ];

  // 4. analytics-pipeline (Warning state)
  upsertProject({
    id: 'analytics-pipeline',
    name: 'analytics-pipeline',
    repoPath: './repos/analytics-pipeline',
    description: 'Embedded DuckDB analytics worker generating columnar Parquet extracts for cloud lakes',
    createdAt: '2026-09-10T14:00:00Z',
  });

  const analyticsSnapshots: Snapshot[] = [
    {
      id: 'snap_ana_2',
      project: 'analytics-pipeline',
      timestamp: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
      git: {
        branch: 'chore/duckdb-upgrade',
        diffSummary: 'pipelines/export_parquet.py (+41/-12), requirements.txt (+2/-2)',
        lastCommitMessage: 'chore: upgrade duckdb to 1.1.0 and enable snappy compression',
        uncommittedFiles: ['pipelines/export_parquet.py'],
        additions: 43,
        deletions: 14,
      },
      tests: { failing: [], passing: 19 },
      todos: [
        { file: 'pipelines/export_parquet.py', line: 72, text: 'bound DuckDB worker threads dynamically via cgroup cpu.max' },
      ],
    },
    {
      id: 'snap_ana_1',
      project: 'analytics-pipeline',
      timestamp: new Date(Date.now() - 92 * 3600 * 1000).toISOString(),
      git: {
        branch: 'chore/duckdb-upgrade',
        diffSummary: 'requirements.txt (+2/-2)',
        lastCommitMessage: 'benchmark: test duckdb 1.1.0 window function throughput',
        uncommittedFiles: [],
        additions: 2,
        deletions: 2,
      },
      tests: { failing: [], passing: 19 },
      todos: [],
    },
  ];

  // 5. pizza-app (The PRD canonical demo repo)
  upsertProject({
    id: 'pizza-app',
    name: 'pizza-app',
    repoPath: './pizza-app',
    description: 'Artisan pizza delivery ordering service with Stripe checkout integration',
    createdAt: '2026-09-18T10:00:00Z',
  });

  const pizzaSnapshots: Snapshot[] = [
    {
      id: 'snap_pizza_3',
      project: 'pizza-app',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2h ago
      git: {
        branch: 'feature/stripe-webhook',
        diffSummary: 'src/checkout.js (+42/-3), src/webhook.js (+15/-0)',
        lastCommitMessage: 'wip: add checkout',
        uncommittedFiles: ['src/checkout.js', 'src/webhook.js'],
        additions: 57,
        deletions: 3,
      },
      tests: { failing: ['webhook_signature_test (AssertionError: signature mismatch)'], passing: 12 },
      todos: [{ file: 'src/checkout.js', line: 42, text: 'fix signature validation before charging customer card' }],
    },
    {
      id: 'snap_pizza_2',
      project: 'pizza-app',
      timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      git: {
        branch: 'feature/stripe-webhook',
        diffSummary: 'tests/webhook.test.js (+66/-0)',
        lastCommitMessage: 'wip: add initial tests',
        uncommittedFiles: [],
        additions: 66,
        deletions: 0,
      },
      tests: { failing: ['webhook_signature_test'], passing: 12 },
      todos: [{ file: 'src/checkout.js', line: 42, text: 'fix signature validation' }],
    },
    {
      id: 'snap_pizza_1',
      project: 'pizza-app',
      timestamp: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
      git: {
        branch: 'main',
        diffSummary: 'package.json (+10/-0)',
        lastCommitMessage: 'initial commit',
        uncommittedFiles: [],
        additions: 10,
        deletions: 0,
      },
      tests: { failing: [], passing: 12 },
      todos: [],
    },
  ];

  // Insert all snapshots into SQLite
  const allToInsert = [
    ...pizzaSnapshots,
    ...paymentSnapshots,
    ...orchestratorSnapshots,
    ...mobileSnapshots,
    ...analyticsSnapshots,
  ];

  for (const snap of allToInsert) {
    insertSnapshot(snap);
  }

  console.log(`Seeded ${allToInsert.length} snapshots across 5 projects into SQLite.`);
}

// Run if called directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runSeed();
}
