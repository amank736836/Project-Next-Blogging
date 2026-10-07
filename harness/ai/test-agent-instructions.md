# Instructions for an AI testing agent

You are working in a repository that already has a test harness. Read this before touching
anything. It exists so you extend the harness rather than reinvent it — and so you do not
repeat the mistakes already documented here.

## The one rule that matters most

**Never invent a result.** If you did not run it, it is `NOT_EXECUTED`. If you cannot run it
here, it is `BLOCKED` with the reason. A fabricated pass is worse than a missing test,
because it is believed.

Three corollaries:

* Never create a screenshot, a log or a response file you did not produce.
  [`../evidence/screenshots/README.md`](../evidence/screenshots/README.md) is empty on
  purpose and says so.
* Never write an assertion that re-implements the logic under test. If your test would pass
  against a broken application, it tests nothing.
* Never mark something `UNKNOWN / REQUIRES VALIDATION` as verified because it looks obvious.

## Before you write anything: Analyze

Work through this in order. Each step has an existing document — read it instead of
re-deriving it.

| Step | Read |
| --- | --- |
| What is this application? | [../PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) |
| How is it structured, and what runs where? | [../ARCHITECTURE.md](../ARCHITECTURE.md) |
| What is already tested, and what is not? | [../TESTING_STATUS.md](../TESTING_STATUS.md), [../reports/coverage.md](../reports/coverage.md) |
| What must it do? | [../requirements/](../requirements/README.md) — 41 requirements |
| What is already broken? | [../bugs/README.md](../bugs/README.md) — 21 open |
| What are the known traps? | [../test-tools/setup.md](../test-tools/setup.md), [../automation/README.md](../automation/README.md) |

Then verify the current state yourself:

```bash
npm test                     # must be 92/92 before you start
git status --porcelain src/  # must be empty — you are not allowed to change src/
```

If either is wrong, stop and say so. Do not build on a broken baseline.

## Plan

Pick work from [../reports/release-readiness.md](../reports/release-readiness.md) §"What would
change this verdict", in that order. Do not invent a new priority.

For each item, decide before writing code:

1. **Which requirement does it trace to?** If none, the requirement is missing — add it to
   `../requirements/` first.
2. **Does a scenario exist?** Check [../test-scenarios/](../test-scenarios/README.md). Add one
   if not; scenarios are cheap and they are what makes coverage legible.
3. **Is it automatable here?** No browser, no MongoDB, no Clerk tenant, no Cloudinary. If it
   needs one, record it `BLOCKED` with the reason and move on — do not fake it.
4. **Will it be a defect-documenting test?** If the behaviour is wrong today, assert what it
   *actually does* and put the bug id in the title. See below.

Write the plan into the relevant case sheet **before** implementing. A case with
`NOT_RUN` status is a legitimate artefact; a case that appears only after the test passes is
a rationalisation.

## Test

### Constraints that are not negotiable

* **Do not modify `src/`.** If a test seems to need an application change, that is a finding —
  report it, don't make it. The only permitted edits to the repository are adding devDependencies
  and `test*` scripts, both already done.
* **Do not install a new framework.** Vitest, Testing Library and jsdom are in place. Adding
  Playwright or `mongodb-memory-server` here would add a suite that cannot run.
* **No test may touch the network.** `request.js` uses `http://harness.local`, which does not
  resolve, so an accidental fetch fails loudly. Keep it that way.

### The traps that already cost time

Every one of these is real and recorded. Do not rediscover them.

| Trap | Fix |
| --- | --- |
| `vi.mock('@/models/Post', …)` **hangs Vitest forever** | Spy on the real model's statics with `installFakePersistence`. Never mock the model. |
| `await request.formData()` **hangs under jsdom** | Put `// @vitest-environment node` at the top of every API and database test file |
| Vite rejects JSX in `.js` files | Already handled in `../vitest.config.mjs`. Do not rename application files. |
| GSAP steals focus in jsdom, so `userEvent.type` drops characters **intermittently** | `setup.js` reports `prefers-reduced-motion` as matching. Do not fix this by mocking `@/lib/motion` — that was tried and reverted. |
| `vi.useFakeTimers({ shouldAdvanceTime: false })` deadlocks `userEvent` | Use `shouldAdvanceTime: true` with `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` |
| `getByText` fails on text split across JSX boundaries | Function matcher on `element.textContent` with `element.children.length === 0` |
| `getByRole('link', { name: 'Log in' })` finds multiple elements | The desktop and mobile trees both render it. Use `getAllByRole(...)[0]` |
| Mongoose 9: `validateSync()` returns `undefined` when valid; `isRequired` is `undefined` when optional | Assert falsy, never `toBe(false)` |
| `new FormData(iterable)` throws | `new FormData()` then `.append()` |
| A body-less `POST` never reaches the `400` branch | Send a real (possibly empty) multipart body |

### Naming

The test title **is** the traceability link:

```js
it('TC-API-001 returns only published (status=active) posts when no query is sent', …)
```

For a test that documents a defect, name the bug:

```js
it('TC-SEC-004 [BUG-006] serves a DRAFT to any anonymous caller — the route ignores status', …)
```

That title is doing real work. When someone fixes BUG-006 this test goes red, and the title
tells them exactly why and what to do: invert the assertion, don't delete it.

## Record

Every case goes in a sheet under [../test-cases/](../test-cases/README.md) with all 15 fields,
including `Status` (`PASS`/`FAIL`/`BLOCKED`/`NOT_RUN`) and `Automation`
(`AUTOMATED`/`MANUAL`/`PARTIAL`).

Every run goes in [../test-results/latest/](../test-results/README.md) with an execution
record: totals, pass rate, environment, and — critically — **what was not covered**.

Every bug goes in [../bugs/open/](../bugs/README.md) with all 14 fields, a file-and-line root
cause, and a one-command reproduction.

## Verify

Before you say a change is done, run the project's own check and be able to name the code
path it executed:

```bash
bash automation/scripts/run-all.sh
```

Then ask yourself, honestly:

* Which function did the command actually run? If you cannot name one, you verified nothing.
* Did the output match what you expected? A clean exit code is not a pass when the number in
  it is wrong.
* Did you re-run after your last edit? An edit after a green run invalidates it.

If something genuinely cannot be run here, say so in the same sentence as the change. That is
an acceptable outcome. Presenting an unverified change as done is the failure to avoid.

## Report

Update, in this order:

1. [../TESTING_STATUS.md](../TESTING_STATUS.md) — the counts and the coverage table
2. [../reports/coverage.md](../reports/coverage.md) — regenerate from the JSON, don't hand-edit
3. [../reports/traceability.md](../reports/traceability.md) — regenerate the same way
4. [../reports/release-readiness.md](../reports/release-readiness.md) — only if a gate changed

Separate **documentation** (what should happen) from **results** (what happened). A scenario
file never contains a result; an execution record never contains a plan.

## Specific things to know about this project

* **Sixteen checks pass by asserting a defect.** Do not "fix" a red-to-green test by relaxing
  it. If a `TC-SEC-*` test starts failing, a bug was probably fixed — invert the assertion and
  move the bug to `../bugs/resolved/`.
* **The client-side auth gate is not a security control.** `SMK-10` and `SMK-11` prove
  `/all-posts` and `/add-post` return full HTML to anonymous callers. Anything you conclude
  from rendering `AuthLayout` applies to the interface only.
* **`GET /api/posts` defaults to `status=active`.** That single default is the only thing
  keeping drafts out of the public archive. `TC-API-001` guards it. If you touch that route,
  run that test first.
* **Coverage is 36% across a slice, not the whole of `src/`.** `src/components/motion/**` and
  `src/components/demo/**` are excluded by config. Say so whenever you quote the number.
* **The highest-value untested code is four pages** — `post/[slug]`, `all-posts`, `page`,
  `edit-post/[slug]` — 643 lines at 0%, holding three of the four Major bugs. Each needs
  `@clerk/nextjs` and `@/services/config` mocked in the same file. That is the next task.

## Definition of done

* `bash automation/scripts/run-all.sh` exits 0
* `git status --porcelain src/` is empty
* Every new case is in a sheet with all 15 fields
* Every new bug is in `../bugs/open/` with all 14 fields and a regression-test decision
* `TESTING_STATUS.md` and the generated reports match the new counts
* Anything you could not run is marked `NOT_EXECUTED` or `BLOCKED`, with the reason
