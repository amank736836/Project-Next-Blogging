# Frame & Phrase — Test Harness

Single source of truth for **what this project does, what has been tested, how it was
tested, what passed and failed, and how to reproduce any of it.**

Everything in this folder is derived from the repository at
`amank736836/Project-Next-Blogging`, commit `9d413cd`. Nothing here is aspirational:
where something could not be verified it is marked `UNKNOWN / REQUIRES VALIDATION` or
`NOT_EXECUTED`.

---

## Quick start

```bash
npm install          # 613 app packages + 148 harness devDependencies

npm run lint         # eslint — 0 errors, 0 warnings
npm test             # 92 automated tests (Vitest), ~18 s, no database needed
npm run test:coverage

# Live server smoke test (needs a running server — see below)
MONGO_URI="mongodb://127.0.0.1:27017/x?serverSelectionTimeoutMS=1500" \
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_<placeholder>" \
CLERK_SECRET_KEY="sk_test_<placeholder>" \
  npm run build && npx next start -H 0.0.0.0 -p 3000

npm run test:smoke   # 20 checks against http://127.0.0.1:3000
```

**No test requires a real MongoDB, Cloudinary account or Clerk tenant.** The unit and API
suites run in-process against an in-memory store that validates with the *real* Mongoose
schema; the smoke suite talks to a running server and asserts the behaviour that results
from the services being absent.

### Where does what live?

| I want to… | Go to |
| --- | --- |
| Understand the product | [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) |
| Understand the technical design | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Know what is tested and how | [TESTING_STRATEGY.md](TESTING_STRATEGY.md) |
| Know the current state right now | [TESTING_STATUS.md](TESTING_STATUS.md) |
| Read the requirements | [requirements/](requirements/) |
| Read how a feature behaves | [features/](features/) |
| Find scenarios by type (security, edge, perf…) | [test-scenarios/](test-scenarios/) |
| Find test cases by module | [test-cases/](test-cases/) |
| Run or extend the automation | [automation/](automation/) |
| Get or add test data | [test-data/](test-data/) |
| See what actually ran, and when | [test-results/](test-results/) |
| See raw proof | [evidence/](evidence/) |
| File or look up a defect | [bugs/](bugs/) |
| Read coverage / traceability / release readiness | [reports/](reports/) |
| Set up a tool | [test-tools/](test-tools/) |
| Instruct an AI agent | [ai/](ai/) |

---

## How this harness is organised

```text
harness/
├── README.md                 ← you are here
├── PROJECT_OVERVIEW.md       what the product is
├── ARCHITECTURE.md           how it is built
├── TESTING_STRATEGY.md       what we test, at which level, and why
├── TESTING_STATUS.md         live status board (start here)
│
├── requirements/             REQ-xxx — functional, non-functional, business rules
├── features/                 FEAT-xxx — one folder per feature, full feature card
├── test-scenarios/           SCN-xxx — scenario catalogues grouped by test type
├── test-cases/               TC-xxx  — executable case sheets grouped by module
├── test-tools/               per-tool setup and usage cards
├── automation/               Vitest suites + scripts (the runnable part)
├── test-data/                fixtures, valid/invalid/edge inputs (no secrets)
├── test-results/             RUN-xxx — latest, historical, summaries
├── evidence/                 logs, raw API responses, DB output, screenshots
├── bugs/                     BUG-xxx — open/ and resolved/
├── reports/                  coverage, traceability, regression, release readiness
└── ai/                       instructions for an AI agent doing the testing
```

### Documentation vs. execution

This split is deliberate and must be maintained:

* **`requirements/`, `features/`, `test-scenarios/`, `test-cases/`** describe what
  *should* happen. They never contain results.
* **`test-results/`, `evidence/`, `reports/`, `bugs/`** describe what *did* happen. They
  are only ever written after a real execution.

A test case with no execution behind it carries `Status: NOT_RUN`. A result with no
evidence link is treated as unverified.

### ID scheme

| Prefix | Meaning | Registry |
| --- | --- | --- |
| `REQ-xxx` | Requirement | [requirements/](requirements/README.md) |
| `FEAT-xxx` | Feature | [features/README.md](features/README.md) |
| `SCN-<TYPE>-xx` | Test scenario (`FN`, `NEG`, `EDGE`, `INT`, `REG`, `PERF`, `SEC`, `API`, `DB`, `UI`, `SMOKE`) | [test-scenarios/](test-scenarios/README.md) |
| `TC-<TYPE>-xxx` | Test case (`API`, `DB`, `UI`, `NEG`, `EDGE`, `SEC`, `INT`, `PERF`, `REG`) | [test-cases/](test-cases/README.md) |
| `SMK-xx` | Live-server smoke check | [automation/scripts/api-smoke.mjs](automation/scripts/api-smoke.mjs) |
| `BUG-xxx` | Defect | [bugs/README.md](bugs/README.md) |
| `RUN-xxx` | Execution record | [test-results/README.md](test-results/README.md) |

IDs are permanent. `BUG-009` was withdrawn after being disproven by a test — the number
stays retired rather than being reused.

---

## How do I…

### Run the whole suite

```bash
npm test                 # 92 Vitest tests (api + database + ui)
npm run test:api         # 26 tests, node environment
npm run test:db          # 18 tests, node environment
npm run test:ui          # 48 tests, jsdom environment
npm run test:smoke       # 20 live checks (requires a running server)
npm run test:coverage    # writes harness/test-results/latest/coverage/
npm run lint             # eslint over src/ and harness/
```

The orchestrator `automation/scripts/run-all.sh` runs lint → unit → build → smoke in
order and writes a combined record.

### Add a new feature

1. Add the requirement to `requirements/functional-requirements.md` (`REQ-xxx`).
2. Create `features/FEAT-xxx-<name>/` from `features/README.md`'s template and fill in the
   feature card — every field, or write `UNKNOWN / REQUIRES VALIDATION`.
3. Add scenarios to the feature's `test-scenarios.md` and cross-list them in the relevant
   `test-scenarios/<type>.md` suite.
4. Write case sheets in `test-cases/<module>/`.
5. Add automation under `automation/<layer>/`, naming each `it()` with its `TC-` id.
6. Add the row to `reports/traceability.md` and bump `reports/coverage.md`.

### Add a new test

* Automated → `harness/automation/{api|database|ui}/<thing>.test.{js,jsx}`.
  Start the file with `// @vitest-environment node` if it touches `Request`/`FormData`
  (jsdom's `Request.formData()` hangs — see `automation/README.md`).
* Manual → a case sheet in `test-cases/`, plus a scenario entry.

### Record a bug

Copy `bugs/README.md`'s template into `bugs/open/BUG-xxx-<slug>.md`. Decide immediately
whether it needs a regression test; if it does, add the test first and link it.

### Update coverage

Never edit the numbers by hand. Run `npm run test:coverage`, then regenerate
`reports/coverage.md` from `harness/test-results/latest/coverage/coverage-summary.json`.

### How should an AI agent use this harness?

Read **[ai/test-agent-instructions.md](ai/test-agent-instructions.md)** first. The short
version:

```text
Analyze → Plan → Test → Record → Verify → Report
```

Never claim a test passed unless you executed it in this session and have the output.
`NOT_EXECUTED` is an acceptable answer; a fabricated `PASS` is not.

---

## Ground rules

1. **Do not invent.** Every statement traces to source code, config, an existing document,
   or a recorded execution.
2. **Never fake results.** Unexecuted means `NOT_EXECUTED`.
3. **Never store secrets.** Only placeholders and `${ENV_VAR}` references live here.
   Verified: see `reports/release-readiness.md` §Secrets scan.
4. **Do not modify `src/` to make a test pass.** The only application-adjacent files this
   harness touches are `package.json` (scripts + devDependencies), `eslint.config.mjs`
   (ignore generated output) and `.gitignore` (ignore generated output) — all listed in
   `TESTING_STRATEGY.md` §Changes made to the repository.
5. **Reuse before adding.** The project had *no* test framework, so Vitest was introduced
   deliberately and minimally. Nothing else was added.
