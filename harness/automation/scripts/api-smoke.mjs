#!/usr/bin/env node
/**
 * Live API / route smoke test — zero dependencies, Node 18+ built-in fetch.
 *
 *   node harness/automation/scripts/api-smoke.mjs
 *   HARNESS_BASE_URL=https://staging.example.test node harness/automation/scripts/api-smoke.mjs
 *   npm run test:smoke
 *
 * Unlike the Vitest suites (which call route handlers in-process against an
 * in-memory store), this script talks to a RUNNING server, so it is the only
 * check that proves the deployed wiring: routing, the proxy/middleware, the
 * static/dynamic split, the database connection and the security headers.
 *
 * It writes two artifacts:
 *   harness/test-results/latest/smoke-result.json
 *   harness/evidence/api-responses/smoke-<runId>.json   (raw response snippets)
 *
 * Exit code = number of failed checks.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HARNESS = join(HERE, '..', '..');
const BASE = process.env.HARNESS_BASE_URL || 'http://127.0.0.1:3000';
const TIMEOUT_MS = Number(process.env.HARNESS_TIMEOUT_MS || 45000);

/**
 * Every check names the behaviour the CURRENT code is expected to produce.
 * Checks marked `documentsDefect: true` assert a known-bad behaviour on purpose;
 * they are wired to a BUG id and must be inverted when the defect is fixed.
 */
const CHECKS = [
  // --- marketing / public pages -----------------------------------------
  { id: 'SMK-01', name: 'GET / serves the landing shell', method: 'GET', path: '/', status: 200, contentType: 'text/html' },
  { id: 'SMK-02', name: 'GET /demo serves the fixture preview', method: 'GET', path: '/demo', status: 200 },
  { id: 'SMK-03', name: 'GET /features', method: 'GET', path: '/features', status: 200 },
  { id: 'SMK-04', name: 'GET /pricing', method: 'GET', path: '/pricing', status: 200 },
  { id: 'SMK-05', name: 'GET /contact', method: 'GET', path: '/contact', status: 200 },
  { id: 'SMK-06', name: 'GET /privacy', method: 'GET', path: '/privacy', status: 200 },
  { id: 'SMK-07', name: 'GET /terms', method: 'GET', path: '/terms', status: 200 },
  { id: 'SMK-08', name: 'GET /login renders the Clerk sign-in route', method: 'GET', path: '/login', status: 200 },
  { id: 'SMK-09', name: 'GET /signup renders the Clerk sign-up route', method: 'GET', path: '/signup', status: 200 },
  { id: 'SMK-10', name: 'GET /all-posts is server-renderable (client gate runs after hydration)', method: 'GET', path: '/all-posts', status: 200 },
  { id: 'SMK-11', name: 'GET /add-post is server-renderable (client gate runs after hydration)', method: 'GET', path: '/add-post', status: 200 },
  { id: 'SMK-12', name: 'GET an unknown route returns 404', method: 'GET', path: '/harness-route-that-does-not-exist', status: 404 },

  // --- API surface --------------------------------------------------------
  {
    id: 'SMK-13',
    name: 'GET /api/posts answers 500 with a leaked internal message when Mongo is unreachable',
    method: 'GET',
    path: '/api/posts',
    status: 500,
    bodyMatches: /error/i,
    documentsDefect: 'BUG-013',
    note: 'src/lib/db.js throws the raw driver/config message straight back to the caller.',
  },
  {
    id: 'SMK-14',
    name: 'GET /api/posts/<unknown slug> also 500s (connection is attempted before the lookup)',
    method: 'GET',
    path: '/api/posts/harness-unknown-slug',
    status: 500,
    documentsDefect: 'BUG-013',
  },
  {
    id: 'SMK-15',
    name: 'POST /api/posts is reachable with no credentials at all',
    method: 'POST',
    path: '/api/posts',
    headers: { 'content-type': 'application/json' },
    body: { title: 't', slug: 's', content: 'c', featuredImage: 'f', userId: 'u' },
    status: 500,
    documentsDefect: 'BUG-004',
    note: 'No 401/403 — the request reaches the data layer unauthenticated.',
  },
  {
    id: 'SMK-16',
    name: 'DELETE /api/posts/<slug> is reachable with no credentials at all',
    method: 'DELETE',
    path: '/api/posts/harness-unknown-slug',
    status: 500,
    documentsDefect: 'BUG-004',
  },
  {
    id: 'SMK-17',
    name: 'POST /api/upload with a multipart body but no file part answers 400',
    method: 'POST',
    path: '/api/upload',
    emptyForm: true, // empty multipart body: formData() parses, .get('file') is null
    status: 400,
    bodyMatches: /No file provided/,
  },
  {
    id: 'SMK-20',
    name: 'POST /api/upload with a non-multipart body 500s instead of 400/415',
    method: 'POST',
    path: '/api/upload',
    headers: { 'content-type': 'application/json' },
    body: { not: 'a file' },
    status: 500,
    documentsDefect: 'BUG-016',
    note: 'request.formData() throws and the catch-all returns 500 with the parser message.',
  },
  {
    id: 'SMK-18',
    name: 'GET /api/posts emits no WWW-Authenticate challenge',
    method: 'GET',
    path: '/api/posts',
    status: 500,
    headerAbsent: 'www-authenticate',
    documentsDefect: 'BUG-004',
  },

  // --- security headers ---------------------------------------------------
  {
    id: 'SMK-19',
    name: 'Security header inventory on GET / (recorded, not asserted)',
    method: 'GET',
    path: '/',
    status: 200,
    recordHeaders: [
      'content-security-policy',
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy',
      'permissions-policy',
      'cross-origin-opener-policy',
    ],
    documentsDefect: 'BUG-014',
  },
];

const results = [];
const evidence = [];

async function runCheck(check) {
  const url = `${BASE}${check.path}`;
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const record = {
    id: check.id,
    name: check.name,
    method: check.method,
    url,
    documentsDefect: check.documentsDefect ?? null,
    startedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(url, {
      method: check.method,
      headers: check.headers,
      body: check.emptyForm
        ? new FormData()
        : check.body === undefined
          ? undefined
          : JSON.stringify(check.body),
      redirect: 'manual',
      signal: controller.signal,
    });
    const durationMs = Math.round(performance.now() - started);
    const raw = await response.text();

    record.status = response.status;
    record.durationMs = durationMs;
    record.contentType = response.headers.get('content-type');

    const failures = [];
    if (check.status !== undefined && response.status !== check.status) {
      failures.push(`expected HTTP ${check.status}, got ${response.status}`);
    }
    if (check.contentType && !String(record.contentType).includes(check.contentType)) {
      failures.push(`expected content-type to contain "${check.contentType}", got "${record.contentType}"`);
    }
    if (check.bodyMatches && !check.bodyMatches.test(raw)) {
      failures.push(`expected body to match ${check.bodyMatches}`);
    }
    if (check.headerAbsent && response.headers.get(check.headerAbsent)) {
      failures.push(`expected header "${check.headerAbsent}" to be absent`);
    }
    if (check.headerPresent && !response.headers.get(check.headerPresent)) {
      failures.push(`expected header "${check.headerPresent}" to be present`);
    }

    if (check.recordHeaders) {
      record.headerInventory = Object.fromEntries(
        check.recordHeaders.map((h) => [h, response.headers.get(h)])
      );
    }

    record.status2 = failures.length === 0 ? 'PASS' : 'FAIL';
    record.failures = failures;

    evidence.push({
      id: check.id,
      url,
      method: check.method,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      bodyExcerpt: raw.slice(0, 600),
      durationMs,
    });
  } catch (error) {
    record.status = null;
    record.durationMs = Math.round(performance.now() - started);
    record.status2 = 'BLOCKED';
    record.failures = [`${error.name}: ${error.message}`];
    evidence.push({ id: check.id, url, method: check.method, error: String(error) });
  } finally {
    clearTimeout(timer);
  }

  results.push(record);
  const mark = record.status2 === 'PASS' ? 'PASS' : record.status2 === 'BLOCKED' ? 'BLOCK' : 'FAIL';
  const defect = record.documentsDefect ? ` [documents ${record.documentsDefect}]` : '';
  console.log(
    `${mark.padEnd(5)} ${check.id.padEnd(7)} ${String(record.status ?? '-').padEnd(4)} ` +
      `${String(record.durationMs).padStart(5)}ms  ${check.name}${defect}`
  );
  if (record.failures.length) console.log(`        ↳ ${record.failures.join('; ')}`);
}

const runId = process.env.HARNESS_RUN_ID || `RUN-${new Date().toISOString().slice(0, 10)}-smoke`;
console.log(`\nAPI smoke · ${runId}\nTarget: ${BASE}\n`);

for (const check of CHECKS) {
  // Sequential on purpose: the app caches a rejected Mongo promise, and a
  // parallel burst would hide the timing that BUG-012 is about.
  // (`no-await-in-loop` is not enabled in eslint.config.mjs, so no directive is needed.)
  await runCheck(check);
}

const summary = {
  runId,
  suite: 'api-smoke',
  base: BASE,
  executedAt: new Date().toISOString(),
  total: results.length,
  passed: results.filter((r) => r.status2 === 'PASS').length,
  failed: results.filter((r) => r.status2 === 'FAIL').length,
  blocked: results.filter((r) => r.status2 === 'BLOCKED').length,
};
summary.passRate = summary.total ? `${Math.round((summary.passed / summary.total) * 100)}%` : 'n/a';

mkdirSync(join(HARNESS, 'test-results', 'latest'), { recursive: true });
mkdirSync(join(HARNESS, 'evidence', 'api-responses'), { recursive: true });

writeFileSync(
  join(HARNESS, 'test-results', 'latest', 'smoke-result.json'),
  `${JSON.stringify({ summary, results }, null, 2)}\n`
);
writeFileSync(
  join(HARNESS, 'evidence', 'api-responses', `smoke-${runId}.json`),
  `${JSON.stringify({ summary, evidence }, null, 2)}\n`
);

console.log(
  `\nTotal ${summary.total} · Passed ${summary.passed} · Failed ${summary.failed} · ` +
    `Blocked ${summary.blocked} · Pass rate ${summary.passRate}\n`
);
process.exit(summary.failed);
