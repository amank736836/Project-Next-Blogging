/**
 * Global Vitest setup for the Frame & Phrase harness.
 *
 * Responsibilities:
 *   1. jest-dom matchers (toBeInTheDocument, toBeDisabled, ...).
 *   2. Deterministic, secret-free environment variables. Nothing here is a real
 *      credential — see harness/test-data/README.md.
 *   3. Browser APIs jsdom does not implement but the app calls:
 *      IntersectionObserver, matchMedia, scrollTo, clipboard. Every DOM stub is
 *      guarded so files that opt into `@vitest-environment node` (the API and
 *      database suites) can share this same setup file.
 *   4. Per-test teardown so a failing assertion cannot leak state into the next
 *      case (Testing Library cleanup + vi.restoreAllMocks).
 */
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// --- environment -----------------------------------------------------------
// Placeholder values only. The harness never reads or stores real secrets.
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/harness-unit-test';
process.env.MONGO_DB = 'harness_unit_test';
// Deliberately NOT shaped like a real Clerk key — see harness/reports/release-readiness.md
// §Secrets. Every value the harness needs is a placeholder.
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'harness-placeholder-publishable-key';
process.env.NEXT_PUBLIC_TINYMCE_API_KEY = 'tinymce-harness-placeholder';
process.env.CLOUDINARY_CLOUD_NAME = 'harness-cloud';
process.env.CLOUDINARY_API_KEY = '000000000000000';
process.env.CLOUDINARY_API_SECRET = 'harness-placeholder-secret';

// --- jsdom gaps (skipped when a file opts into `@vitest-environment node`) --
const hasDom = typeof window !== 'undefined' && typeof document !== 'undefined';

if (hasDom) {
  class IntersectionObserverStub {
    constructor(callback) {
      this.callback = callback;
      IntersectionObserverStub.instances.push(this);
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    // Fire every observed element as intersecting so in-view logic resolves.
    trigger() {
      this.callback([{ isIntersecting: true, intersectionRatio: 1 }], this);
    }
  }
  IntersectionObserverStub.instances = [];
  globalThis.IntersectionObserver = IntersectionObserverStub;

  /**
   * jsdom has no media queries, so we answer them ourselves.
   *
   * `(prefers-reduced-motion: reduce)` deliberately reports TRUE. This is not a
   * shortcut — reduced motion is a first-class mode of this app
   * (`usePrefersReducedMotion` in src/lib/motion.js is the single source of
   * truth and `useMotionEffect` skips its GSAP build entirely). Running the DOM
   * suite in that mode keeps GSAP out of jsdom, where its ticker takes focus
   * away from the element under test and silently truncates userEvent typing.
   * Verified: with GSAP active, typing "one two three four five" into the
   * editor lands 1-6 characters at random; with reduced motion on, it lands all
   * 23. Every other query reports false.
   */
  globalThis.matchMedia = (query) => ({
    matches: String(query).includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  window.scrollTo = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(() => Promise.resolve()) },
  });

  globalThis.__IntersectionObserverStub = IntersectionObserverStub;
}

// --- lifecycle -------------------------------------------------------------
beforeEach(() => {
  if (hasDom) {
    globalThis.__IntersectionObserverStub.instances = [];
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  }
});

afterEach(() => {
  if (hasDom) cleanup();
  vi.restoreAllMocks();
});

