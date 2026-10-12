/**
 * UI-038 · Scroll-trigger re-measurement — src/lib/motion.js
 *
 * A ScrollTrigger caches the start/end offsets it measured when it was created.
 * Anything that changes the document height afterwards leaves those numbers
 * stale, and a trigger whose start is past the end of the page can never fire —
 * so whatever it was supposed to reveal stays at its pre-reveal state forever.
 * That is BUG-023: a band of blank page where the footer's brand block and link
 * columns should be, on every interior page reached by a route change.
 *
 * The three cases below pin the three measurements the hook owes us:
 *   1. once on mount,
 *   2. again on `deps` change (PageShell passes the pathname),
 *   3. again whenever the document grows or shrinks, and
 *   4. never keeping a trigger whose element has left the document.
 *
 * GSAP is mocked throughout: the real plugin needs layout, and jsdom has none.
 *
 * Traceability: REQ-022 / FEAT-010 / SCN-UI-50
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

const refresh = vi.fn();
const registerPlugin = vi.fn();
const defaults = vi.fn();
const config = vi.fn();

/** Stand-ins for the plugin's trigger list — the real one lives in a browser. */
let triggers = [];

vi.mock('gsap', () => ({
  default: { registerPlugin, defaults, to: vi.fn(), from: vi.fn() },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    getAll: () => triggers,
    refresh,
    config,
    addEventListener: vi.fn(),
    sort: vi.fn(),
    isRefreshing: false,
  },
}));

const { useScrollTriggerRefresh } = await import('@/lib/motion.js');

function Probe({ dep }) {
  useScrollTriggerRefresh([dep]);
  return <div data-testid="probe">probe</div>;
}

/** Lets the hook's requestAnimationFrame callback run. */
const settle = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

let resizeCallbacks = [];
let previousResizeObserver;

beforeEach(() => {
  refresh.mockClear();
  triggers = [];
  resizeCallbacks = [];
  previousResizeObserver = globalThis.ResizeObserver;
  // jsdom implements neither the observer nor a real document height.
  globalThis.ResizeObserver = class {
    constructor(callback) {
      resizeCallbacks.push(callback);
    }
    observe() {}
    disconnect() {
      resizeCallbacks = [];
    }
  };
});

afterEach(() => {
  globalThis.ResizeObserver = previousResizeObserver;
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 0, configurable: true });
});

const setDocumentHeight = (height) => {
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: height, configurable: true });
};

describe('useScrollTriggerRefresh', () => {
  it('TC-UI-038 re-measures once on mount', async () => {
    setDocumentHeight(2000);
    render(<Probe dep="a" />);
    await settle();

    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('TC-UI-039 re-measures when the route changes', async () => {
    setDocumentHeight(2000);
    const { rerender } = render(<Probe dep="a" />);
    await settle();
    expect(refresh).toHaveBeenCalledTimes(1);

    // PageShell re-renders with a new pathname after a client-side navigation.
    rerender(<Probe dep="b" />);
    await settle();

    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it('TC-UI-040 re-measures when the document height changes', async () => {
    setDocumentHeight(2000);
    render(<Probe dep="a" />);
    await settle();
    expect(refresh).toHaveBeenCalledTimes(1);

    // A route swap, or images/fonts settling, moves the end of the document.
    setDocumentHeight(3500);
    resizeCallbacks.forEach((callback) => callback([{ target: document.documentElement }]));
    await settle();
    expect(refresh).toHaveBeenCalledTimes(2);

    // A resize that does not change the height must not re-measure.
    resizeCallbacks.forEach((callback) => callback([{ target: document.documentElement }]));
    await settle();
    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it('TC-UI-041 drops triggers whose element has left the document', async () => {
    setDocumentHeight(2000);
    const detached = document.createElement('div');
    const attached = document.createElement('div');
    document.body.appendChild(attached);
    const killDetached = vi.fn();
    const killAttached = vi.fn();
    triggers = [
      { trigger: detached, kill: killDetached },
      { trigger: attached, kill: killAttached },
    ];

    render(<Probe dep="a" />);
    await settle();

    expect(killDetached).toHaveBeenCalledTimes(1);
    expect(killAttached).not.toHaveBeenCalled();
    expect(refresh).toHaveBeenCalledTimes(1);

    attached.remove();
  });
});
