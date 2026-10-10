# Testing Strategy

## The starting point

Before this harness existed the repository contained **zero tests and zero test tooling**:

```text
$ node -e "console.log(JSON.stringify(require('./package.json').scripts))"
{"dev":"next dev","build":"next build","start":"next start","lint":"eslint"}
```

`devDependencies` held only `@tailwindcss/postcss`, `eslint`, `eslint-config-next` and
`tailwindcss`. There was no Jest/Vitest/Playwright/Cypress config, no `__tests__`
directory and no `*.test.*` file anywhere in `src/`.

So the rule "reuse existing tools, do not add a framework" could not be satisfied — there
was nothing to reuse. One framework was therefore introduced, chosen to be the minimum that
can test this stack, and nothing else was added.

## Levels, and what each one is allowed to prove

| Level | Tool | Scope | Can prove | Cannot prove |
| --- | --- | --- | --- | --- |
| **Unit — data contract** | Vitest (node) | `src/models/Post.js` | The real Mongoose schema's required/enum/unique/timestamp rules | Anything about a live server |
| **API contract** | Vitest (node) | `src/app/api/**` route handlers | Status codes, response shapes, error paths, authz *absence* — against the **real handler code** with an in-memory store | Real MongoDB query semantics, index behaviour, wire errors |
| **Component / UI** | Vitest + Testing Library (jsdom) | `src/components/**`, `src/app/**/page.js` | Rendered output, client validation, redirect logic, derived values, user interaction | Real Clerk, real TinyMCE, real CSS/layout, real GSAP |
| **Live smoke** | Node script + `fetch` | A running `next start` | Routing, proxy wiring, static/dynamic split, real HTTP status codes, security headers, env-var failure modes | Anything needing a real database or Clerk tenant |
| **Manual / exploratory** | Browser | Whole app | Real auth flows, real uploads, visual/UX regressions | — (nothing automated covers these yet) |
| **Performance** | — | — | **nothing yet** | Everything — see `test-scenarios/performance.md` |
| **Security / VAPT** | Automated where possible, manual otherwise | API + headers | Absence of authN/authZ, header posture, mass assignment | Exploitability in a real browser (no browser in this environment) |

### The key design decision: fake the *storage*, never the *code*

`harness/automation/utilities/fake-post-model.js` does **not** mock `@/models/Post`.
It spies on the statics of the genuine model object that the route handlers imported, and
validates candidates through `new Post(doc).validateSync()`.

Two reasons:

1. Mocking the specifier would also intercept the fake's own import of the schema and
   deadlock module resolution — this was hit and is documented in the module header.
2. More importantly, a re-implemented schema would test a fiction. With the real schema in
   the loop, `TC-DB-*` and `TC-NEG-*` exercise the same validation the application runs.

What the fake explicitly does **not** reproduce is listed in its header: shallow-equality
queries only, unique violations surface as `ValidationError` rather than `E11000`, and no
transactions, projections, sorting, pagination or wire-level behaviour. Those belong in
[test-scenarios/database.md](test-scenarios/database.md) as manual integration cases.

## Prioritisation

Automation was written in this order, and the same order should be used for new work:

1. **Critical business flows** — post CRUD (the only business entity).
2. **High-risk functionality** — authorisation. It is absent server-side, so the tests
   assert the *insecure* behaviour on purpose and are wired to bug IDs. When the fix lands
   they fail loudly and must be inverted.
3. **Regression-prone functionality** — slug derivation, reading time, the auth gate, the
   theme, the arm-then-confirm delete.
4. **APIs** — every handler and every branch.
5. **Database validation** — the schema contract.
6. **Auth** — the client gate.
7. **Important UI workflows** — the composer and the contact form.

## Test naming and layout

* Every `it()` title starts with its `TC-` id: `it('TC-API-003 scopes results to userId …')`.
  This is what makes [reports/traceability.md](reports/traceability.md) mechanically
  checkable — `grep -rhoE "TC-[A-Z]+-[0-9]{3}"` over `automation/` yields the registry.
* Layer directories mirror the app: `automation/api/`, `automation/database/`,
  `automation/ui/`.
* Shared helpers live in `automation/utilities/`, mocks in `automation/utilities/mocks/`.
* Data lives in `test-data/`, never inline in a test, unless it is a one-off literal that
  is clearer in place.

## Environment strategy

| Concern | Decision |
| --- | --- |
| Node environment | `// @vitest-environment node` on API and database files. jsdom's `Request.formData()` **hangs indefinitely** — this cost a debugging cycle and is recorded here so nobody repeats it. |
| DOM environment | jsdom, globally, with stubs for `IntersectionObserver`, `matchMedia`, `scrollTo`, `scrollIntoView` and `navigator.clipboard`. |
| Motion | Reduced-motion reports `true` (see `ARCHITECTURE.md` §Motion). |
| Secrets | `automation/utilities/setup.js` injects **placeholder** values only. No test may read a real credential. |
| Database | Never connected. The fake store is reset in `beforeEach`. |
| Clerk | Mocked at the module boundary. What is tested is *our* reaction to Clerk's values, not Clerk itself. |
| TinyMCE | Replaced by a stand-in that owns its own value, mirroring the real uncontrolled widget. |
| Cloudinary | `upload_stream` replaced by a `vi.fn()`; no network. |

## Changes made to the repository

The task rule was *"do not modify application source unless required to create or run
tests."* **No file under `src/` was changed.** Verified:

```text
$ git status --porcelain src/
(no output)
```

Exactly these files outside `harness/` were touched, all to make the suite runnable
(verified with `git status --porcelain | grep -v '^?? harness/'`):

```text
 M .gitignore
 M eslint.config.mjs
 M package-lock.json
 M package.json
```

| File | Change | Why it was required |
| --- | --- | --- |
| `package.json` | 7 devDependencies + 6 scripts | There was no test runner |
| `package-lock.json` | Lockfile entries for those devDependencies | Consequence of the install |
| `eslint.config.mjs` | 2 entries added to `globalIgnores` | Generated coverage HTML and evidence binaries are not authored code; `npm run lint` would otherwise report 3 warnings |
| `.gitignore` | 5 entries | Keep generated coverage output and binary evidence out of git |

## Tooling added

| Package | Version | Purpose |
| --- | --- | --- |
| `vitest` | ^3.2.7 | Runner |
| `@vitejs/plugin-react` | ^4.7.0 | JSX transform |
| `jsdom` | ^25.0.1 | DOM environment |
| `@testing-library/react` | ^16.3.3 | Component rendering |
| `@testing-library/jest-dom` | ^6.9.1 | DOM matchers |
| `@testing-library/user-event` | ^14.6.7 | Realistic interaction |
| `@vitest/coverage-v8` | ^3.2.7 | Coverage |

Nothing was added for performance, browser automation or security scanning — see
[test-tools/README.md](test-tools/README.md) for what those layers currently use and why.

## What is explicitly out of scope for automation (for now)

* Real Clerk sign-in / sign-up / MFA / session expiry — needs a live tenant.
  [test-scenarios/security.md](test-scenarios/security.md) `SCN-SEC-01`.
* Real Cloudinary uploads and transformations — needs an account.
* Real MongoDB query behaviour, index creation, replica-set failover.
* Visual regression, responsive layout, animation timing — no browser is available in this
  environment and Playwright's browser CDN is not reachable.
* Load and soak testing.

Each of these has a written manual scenario so it is tracked rather than silently missing.

## Exit criteria for a change

A change to `src/` is testable-and-shippable only when:

1. `npm run lint` → 0 errors, 0 warnings.
2. `npm test` → all green, and any security-regression test that was asserting insecure
   behaviour has been **inverted**, not deleted.
3. `npm run build` succeeds with only the documented env vars.
4. `npm run test:smoke` against a running build → 0 failures.
5. New behaviour has a `REQ-` → `FEAT-` → `SCN-` → `TC-` chain and a row in
   `reports/traceability.md`.
