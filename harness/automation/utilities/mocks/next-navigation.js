/**
 * `next/navigation` mock — gives tests control over router side effects so
 * redirect behaviour can be asserted instead of merely observed.
 */
import { vi } from 'vitest';

const router = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

const navigationState = { pathname: '/', searchParams: new URLSearchParams() };

export function setPathname(pathname) {
  navigationState.pathname = pathname;
  return navigationState;
}

export function getRouterSpy() {
  return router;
}

export function resetRouter() {
  router.push.mockClear();
  router.replace.mockClear();
  router.back.mockClear();
  router.forward.mockClear();
  router.refresh.mockClear();
  router.prefetch.mockClear();
  navigationState.pathname = '/';
  navigationState.searchParams = new URLSearchParams();
}

export function createNextNavigationMock() {
  return {
    useRouter: () => router,
    usePathname: () => navigationState.pathname,
    useSearchParams: () => navigationState.searchParams,
    redirect: vi.fn(),
    notFound: vi.fn(),
  };
}
