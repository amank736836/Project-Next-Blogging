'use client';
/**
 * Shared motion layer.
 * -------------------------------------------------------------------------
 * Every animation in the app goes through these helpers so the whole site
 * moves with one vocabulary (expo-out, 0.9s reveals, 0.06 stagger) and so
 * `prefers-reduced-motion` is honoured in exactly one place.
 *
 * GSAP is registered once, lazily, in the browser only.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const isBrowser = typeof window !== 'undefined';
const useIsoLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
export { useIsoLayoutEffect };

let registered = false;

/** Register plugins on first use (browser only). */
export function gsapOnce() {
  if (!isBrowser) return null;
  if (!registered) {
    registered = true;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'expo.out', duration: 0.9 });
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
  return gsap;
}

export const MOTION = {
  duration: 0.9,
  stagger: 0.06,
  start: 'top 86%',
  ease: 'expo.out',
};

/** True when the user asked the OS to reduce motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return reduced;
}

/**
 * Build animations for one component inside a GSAP context scoped to the
 * returned ref. Tweens and ScrollTriggers created in `build` are reverted
 * automatically on unmount, so route changes never leak triggers.
 *
 * `build` only runs when motion is allowed, and it runs in a layout effect —
 * before the browser paints — so nothing flashes or pops in.
 *
 * @param {(g: typeof gsap, self: HTMLElement) => void} build
 * @param {unknown[]} deps
 */
export function useMotionEffect(build, deps = []) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!node || reduced || !build) return;
    const g = gsapOnce();
    if (!g) return;

    const ctx = g.context(() => {
      build(g, node);
    }, node);

    return () => ctx.revert();
    // `build` is intentionally excluded: callers pass an inline closure, and
    // `deps` is the explicit contract for when the animation should be rebuilt.
  }, [reduced, ...deps]);

  return { ref, reduced };
}

/** Refresh ScrollTrigger once fonts and images have settled. */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    if (!gsapOnce()) return;
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    refresh();
    window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready?.then(refresh).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, []);
}

/** Split text into words (and chars) for expressive type reveals. */
export function splitWords(text) {
  if (!text) return [];
  return String(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i, arr) => ({ word, chars: word.split(''), last: i === arr.length - 1 }));
}

/**
 * Document / element scroll read-out.
 * Pass an id (without `#`) to measure one element's travel — used for the
 * reading progress bar on article pages.
 */
export function useScrollInfo(targetId) {
  const [state, setState] = useState({ progress: 0, y: 0, dir: 'up' });
  const last = useRef(0);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY || 0;
      const el = targetId ? document.getElementById(targetId) : null;
      let progress = 0;

      if (el) {
        const rect = el.getBoundingClientRect();
        const total = Math.max(rect.height - window.innerHeight, 1);
        progress = gsap.utils.clamp(0, 1, -rect.top / total);
      } else {
        const total = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        progress = gsap.utils.clamp(0, 1, y / total);
      }

      setState({ progress, y, dir: y > last.y ? 'down' : 'up' });
      last.y = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  return state;
}

/**
 * Magnetic pointer follow: the node leans toward the cursor and springs back
 * on leave. Disabled automatically under reduced motion.
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    const xTo = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3.out' });

    const move = (e) => {
      const r = node.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength * 0.7);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);
    return () => {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', leave);
    };
  }, [reduced, strength]);

  return ref;
}

/** Publishes --mx/--my (pointer position within the node) for CSS spotlights. */
export function usePointerVars(ref) {
  useEffect(() => {
    const node = ref?.current;
    if (!node) return;
    let frame = 0;
    const move = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = node.getBoundingClientRect();
        node.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        node.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    };
    node.addEventListener('pointermove', move);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', move);
    };
  }, [ref]);
}

/** Fires once the node is in view — handy for "start" states and counters. */
export function useInView({ threshold = 0.3, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}

/** Animated number that counts up when it scrolls into view. */
export function useCountUp(to, { duration = 1.4, decimals = 0, suffix = '', prefix = '' } = {}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [tweened, setTweened] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!inView || done.current || reduced) return;
    done.current = true;
    const proxy = { v: 0 };
    gsapOnce()?.to(proxy, {
      v: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => setTweened(Number(proxy.v.toFixed(decimals))),
    });
  }, [inView, reduced, to, duration, decimals]);

  // Reduced motion shows the final number immediately — no effect, no flicker.
  const value = reduced ? to : tweened;

  const format = useCallback(
    (n) => `${prefix}${Number(n).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`,
    [prefix, suffix, decimals]
  );

  return [ref, format(value)];
}

export { gsap, ScrollTrigger };
