# fast-glob shim (security override)

This vendored package is wired in through the root `package.json`:

```json
"overrides": {
  "fast-glob": "file:tools/glob-shim"
}
```

It replaces the real `fast-glob` everywhere in the dependency tree so that
`micromatch` and `braces` are no longer installed.

## Why

`braces` (through its latest release, 3.0.3) is affected by an unpatched
stack-exhaustion DoS advisory:

- [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) — *Patched versions: None*

The only consumer of `fast-glob` here is `@next/eslint-plugin-next`, which
just calls `globSync(pattern, { onlyDirectories: true })` for the optional
`settings.next.rootDir` ESLint setting. This shim implements that subset on
top of the patched `picomatch`, with depth and entry-count limits on the
filesystem walk.

## Supported API

- `globSync(pattern | pattern[], options)` — `cwd`, `dot`, `absolute`,
  `onlyDirectories`, `onlyFiles`, `ignore`
- `glob(...)` — async wrapper resolving to the same results
- `escapePath`, `convertPathToPattern`
- `stream()` / `generateTasks()` — throw, they are unused in this project

If a future dependency needs more of the fast-glob API, revisit this shim or
drop the override once `braces` ships a patched release.
