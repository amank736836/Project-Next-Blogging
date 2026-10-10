'use strict';

/**
 * Minimal, dependency-free stand-in for the `fast-glob` package.
 *
 * Why this exists
 * ---------------
 * The real `fast-glob` depends on `micromatch`, which depends on `braces`.
 * `braces` (through its latest release, 3.0.3) has an unpatched
 * stack-exhaustion denial-of-service advisory:
 *
 *   GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 — "Patched versions: None"
 *
 * The only consumer of `fast-glob` in this project is
 * `@next/eslint-plugin-next`, and it exclusively calls
 * `globSync(pattern, { onlyDirectories: true })` to resolve the optional
 * `settings.next.rootDir` ESLint setting. This shim implements that subset
 * (plus a defensive `glob()` async wrapper) on top of `picomatch` — which is
 * patched — so the vulnerable `micromatch`/`braces` chain disappears from the
 * dependency tree entirely.
 *
 * Hardening notes:
 *  - filesystem walk is depth-limited (MAX_DEPTH) and entry-count limited
 *    (MAX_ENTRIES) so a hostile directory tree cannot exhaust resources;
 *  - symlinked directories are not followed;
 *  - dot entries are skipped unless `dot: true`, matching fast-glob defaults.
 */

const fs = require('node:fs');
const path = require('node:path');
const picomatch = require('picomatch');

const MAX_DEPTH = 40;
const MAX_ENTRIES = 100000;
const MAGIC_CHARS = /[*?{}()[\]!+@|]/;

/**
 * @typedef {Object} ShimOptions
 * @property {string}   [cwd]              Working directory (default process.cwd()).
 * @property {boolean}  [dot]              Match dotfiles (default false).
 * @property {boolean}  [absolute]         Return absolute paths (default false).
 * @property {boolean}  [onlyDirectories]  Only return directories (default false).
 * @property {boolean}  [onlyFiles]        Only return files (default true, ignored when onlyDirectories).
 * @property {string[]} [ignore]           Patterns to ignore.
 */

function normalizeOptions(options) {
  const opts = options || {};
  return {
    cwd: path.resolve(typeof opts.cwd === 'string' ? opts.cwd : process.cwd()),
    dot: opts.dot === true,
    absolute: opts.absolute === true,
    onlyDirectories: opts.onlyDirectories === true,
    onlyFiles: opts.onlyFiles !== false,
    ignore: Array.isArray(opts.ignore) ? opts.ignore : opts.ignore ? [opts.ignore] : [],
  };
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

/**
 * Depth-limited directory walk yielding { relative, isDirectory } entries.
 */
function* walk(root, opts) {
  const stack = [{ dir: '', depth: 0 }];
  let count = 0;

  while (stack.length > 0) {
    const { dir, depth } = stack.pop();
    if (depth > MAX_DEPTH) continue;

    const absDir = dir === '' ? root : path.join(root, dir);
    let entries;
    try {
      entries = fs.readdirSync(absDir, { withFileTypes: true });
    } catch {
      continue; // unreadable directory — skip, like fast-glob does
    }

    for (const entry of entries) {
      if (++count > MAX_ENTRIES) return;
      const name = entry.name;
      if (!opts.dot && name.startsWith('.')) continue;

      const relative = dir === '' ? name : `${dir}/${name}`;
      const isSymlink = entry.isSymbolicLink();

      let isDirectory = entry.isDirectory();
      let isFile = entry.isFile();
      if (isSymlink) {
        // Never follow symlinked directories; stat to learn the target type.
        try {
          const stat = fs.statSync(path.join(root, relative));
          isDirectory = stat.isDirectory();
          isFile = stat.isFile();
        } catch {
          continue; // broken symlink — skip
        }
        if (isDirectory) continue; // do not descend into symlinked dirs
      }

      yield { relative, isDirectory, isFile };

      if (isDirectory) stack.push({ dir: relative, depth: depth + 1 });
    }
  }
}

function expandStatic(pattern) {
  // Normalize backslashes; fast-glob treats '\' as a separator on all platforms.
  let normalized = pattern.split('\\').join('/');
  while (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
  return normalized || '.';
}

/**
 * Synchronous glob. Accepts a single pattern or an array of patterns.
 * Returns a sorted, de-duplicated array of paths (relative to `cwd`,
 * or absolute when `absolute: true`).
 */
function globSync(patterns, options) {
  const opts = normalizeOptions(options);
  const list = Array.isArray(patterns) ? patterns : [patterns];
  const results = new Set();

  for (const raw of list) {
    if (typeof raw !== 'string' || raw.length === 0) continue;
    const pattern = expandStatic(raw);

    // Static (non-magic) pattern: resolve directly instead of walking.
    if (!MAGIC_CHARS.test(pattern)) {
      const abs = path.resolve(opts.cwd, pattern);
      let stat;
      try {
        stat = fs.statSync(abs);
      } catch {
        continue;
      }
      const isDirectory = stat.isDirectory();
      const isFile = stat.isFile();
      const wanted = opts.onlyDirectories ? isDirectory : opts.onlyFiles ? isFile : true;
      if (wanted) results.add(opts.absolute ? abs : toPosix(path.relative(opts.cwd, abs)) || '.');
      continue;
    }

    const isMatch = picomatch(pattern, { dot: opts.dot });
    const isIgnored = opts.ignore.length > 0
      ? picomatch(opts.ignore, { dot: opts.dot })
      : () => false;

    for (const { relative, isDirectory, isFile } of walk(opts.cwd, opts)) {
      if (isIgnored(relative)) continue;
      const wanted = opts.onlyDirectories ? isDirectory : opts.onlyFiles ? isFile : true;
      if (!wanted) continue;
      if (isMatch(relative)) {
        results.add(opts.absolute ? path.join(opts.cwd, relative) : relative);
      }
    }
  }

  return Array.from(results).sort();
}

/**
 * Async glob — resolves with the same results as globSync.
 */
async function glob(patterns, options) {
  return globSync(patterns, options);
}

function stream() {
  throw new Error('fast-glob shim: stream() is not supported; use globSync/glob');
}

glob.sync = globSync;
glob.stream = stream;
glob.generateTasks = () => {
  throw new Error('fast-glob shim: generateTasks() is not supported');
};
glob.escapePath = (p) => {
  const special = new Set(['[', ']', '(', ')', '*', '?', '!', '+', '@', '|']);
  return Array.from(String(p), (character) => special.has(character) ? '\\' + character : character).join('');
};
glob.convertPathToPattern = toPosix;

module.exports = glob;
module.exports.glob = glob;
module.exports.globSync = globSync;
module.exports.globStream = stream;
module.exports.default = glob;
