# Test tools

Everything needed to run the suites, plus the environment contract the application imposes.
Read [setup.md](setup.md) first — nothing else runs until those six variables exist.

## What is in this folder

| Card | Covers |
| --- | --- |
| [setup.md](setup.md) | The six-variable environment contract, and the exact failure each missing variable causes |
| [api/](api/README.md) | The in-process request harness and the live smoke script |
| [ui/](ui/README.md) | jsdom, Testing Library, and the four mocks in `automation/utilities/mocks/` |
| [database/](database/README.md) | The real Mongoose schema in-process, and the in-memory persistence fake |
| [performance/](performance/README.md) | What was measured, what was not, and how to start |
| [security/](security/README.md) | What was checked and, honestly, what was never run |

## Commands

All scripts were added to `package.json` as part of this harness. Nothing else in the
project's tooling was changed, and `src/` is untouched.

| Command | Runs | Needs a server |
| --- | --- | --- |
| `npm test` | all 92 Vitest checks | No |
| `npm run test:watch` | the same, in watch mode | No |
| `npm run test:coverage` | the same, writing `test-results/latest/coverage/` | No |
| `npm run test:api` | `automation/api/**` (26 checks) | No |
| `npm run test:ui` | `automation/ui/**` (48 checks) | No |
| `npm run test:db` | `automation/database/**` (18 checks) | No |
| `npm run test:smoke` | `automation/scripts/api-smoke.mjs` (20 checks) | **Yes** |

The last one is the only command that talks to a running application. Everything else runs
the application's real code in-process.

## Frameworks, and why each one

| Tool | Version | Why it is here |
| --- | --- | --- |
| [Vitest](https://vitest.dev) | ^3.2.7 | The project had **no** test framework. Vitest was chosen over Jest because the app is a Vite-adjacent ESM/JSX codebase and Vitest needs no Babel transform to read JSX. Adding a framework was unavoidable, so the one with the least configuration was picked. |
| `@vitejs/plugin-react` | ^4.7.0 | Required only because the project writes JSX inside `.js` files |
| `jsdom` | ^25.0.1 | The DOM environment for component tests |
| `@testing-library/react` | — | Component rendering and queries |
| `@testing-library/jest-dom` | — | The `toBeInTheDocument`-style matchers |
| `@testing-library/user-event` | — | Realistic interaction, including focus and keyboard events |
| `@vitest/coverage-v8` | ^3.2.7 | Coverage provider matching the runner |
| *(none)* | — | The smoke script is written against Node's built-in `fetch` and `FormData`. Zero dependencies, so it runs anywhere Node 22 does. |

## Deliberate non-choices

These were considered and rejected:

* **Playwright / Cypress.** No browser is available in this environment, so a browser suite
  could be written but never run — and an unrunnable suite is worse than none, because it
  rots silently. `NOT_EXECUTED` is recorded per scenario instead.
* **`mongodb-memory-server`.** It downloads a `mongod` binary at install time from a host
  that is not reachable here. The in-memory persistence fake plus the real schema is the
  substitute, with its limits documented in [database/](database/README.md).
* **OWASP ZAP / Burp / nuclei.** Not installed and not run. The security work here is
  hand-written assertions against the real handlers, which is narrower but verifiable.
* **MSW (Mock Service Worker).** `vi.fn()` on `PostService` is enough, and adds no worker
  registration to debug.
