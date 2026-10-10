'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Menu, X, PenSquare, LayoutGrid } from 'lucide-react';
import Container from '../container/Container';
import Logo from '../Logo';
import ThemeBtn from '../ThemeBtn';
import Button from '../Button';
import { useMotionEffect, useScrollInfo } from '@/lib/motion';

/**
 * Sticky glass header: invisible over the hero, frosted once you scroll, hides
 * on the way down and returns on the way up. The mobile sheet staggers its
 * items in with GSAP.
 *
 * Note the fragment: the header carries a transform while hiding, and a
 * transformed ancestor becomes the containing block for `position: fixed`
 * children — so the sheet and its scrim are siblings, not descendants.
 */
export default function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const { y, dir } = useScrollInfo();
  const [open, setOpen] = React.useState(false);
  const scrolled = y > 10;
  const hidden = scrolled && dir === 'down' && !open;

  // Close the mobile sheet when the route changes. Done during render
  // (React's recommended "adjusting state while rendering" pattern) instead
  // of an effect, so navigation never paints a frame with a stale open sheet.
  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Lock the page while the sheet is open.
  React.useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes the sheet.
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const { ref } = useMotionEffect((g, node) => {
    g.from(g.utils.toArray('[data-head-item]', node), {
      y: -14,
      opacity: 0,
      duration: 0.7,
      stagger: 0.07,
      ease: 'expo.out',
      delay: 0.15,
    });
  }, []);

  const nav = [
    { name: 'Stories', slug: '/all-posts', show: isSignedIn },
    { name: 'Features', slug: '/features', show: true },
    { name: 'Pricing', slug: '/pricing', show: true },
    { name: 'Contact', slug: '/contact', show: true },
  ].filter((item) => item.show);

  const isActive = (slug) => pathname === slug || pathname.startsWith(`${slug}/`);

  return (
    <>
      <header
        ref={ref}
        data-scrolled={scrolled ? 'true' : 'false'}
        data-hidden={hidden ? 'true' : 'false'}
        data-open={open ? 'true' : 'false'}
        className="site-header sticky top-0 z-50 border-b border-transparent"
      >
        <Container size="xl">
          <div className="flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
            {/* brand */}
            <Link
              href="/"
              data-head-item
              className="relative z-10 shrink-0 rounded-xl"
              aria-label="Frame & Phrase — home"
            >
              <Logo size="md" />
            </Link>

            {/* desktop nav */}
            <nav data-head-item className="hidden items-center gap-1 lg:flex" aria-label="Main">
              <NavLink href="/" active={isActive('/')}>Home</NavLink>
              {nav.map((item) => (
                <NavLink key={item.slug} href={item.slug} active={isActive(item.slug)}>
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* actions */}
            <div data-head-item className="flex items-center gap-2 md:gap-3">
              {isLoaded && isSignedIn && (
                <Button
                  href="/add-post"
                  size="sm"
                  variant="primary"
                  className="hidden sm:inline-flex"
                  iconRight={<PenSquare className="h-4 w-4" />}
                >
                  Write
                </Button>
              )}

              {isLoaded && !isSignedIn && (
                <>
                  <Link
                    href="/login"
                    className="hidden text-sm font-semibold text-muted transition-colors duration-300 hover:text-accent sm:block"
                  >
                    Log in
                  </Link>
                  <Button href="/signup" size="sm" variant="primary" className="hidden sm:inline-flex">
                    Start writing
                  </Button>
                </>
              )}

              {!isLoaded && (
                // A width-only spacer: no shimmer, so a slow auth round-trip
                // never reads as a stuck loading state.
                <span aria-hidden className="hidden h-9 w-32 sm:block" />
              )}

              <ThemeBtn />

              {isSignedIn && (
                <div className="ml-0.5 flex items-center rounded-full border border-line bg-surface-1/60 px-1 py-0.5 transition-colors duration-300 hover:border-accent/45">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{ variables: { colorPrimary: 'var(--accent)' } }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-1/70 text-fg transition-colors duration-300 hover:border-accent/50 hover:text-accent lg:hidden"
              >
                <Menu
                  className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                    open ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
                  }`}
                />
                <X
                  className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                    open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* scrim */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 h-screen w-screen bg-ink-950/30 backdrop-blur-[2px] transition-opacity duration-500 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* mobile sheet */}
      <div
        id="mobile-nav"
        className={`fixed inset-x-0 top-16 z-40 origin-top px-4 pb-4 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] lg:hidden ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="glass rounded-3xl p-3 shadow-lift">
          <MobileLinks open={open} nav={nav} isActive={isActive} />

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
            {isSignedIn ? (
              <>
                <Button href="/add-post" size="sm" variant="primary" className="w-full" iconLeft={<PenSquare className="h-4 w-4" />}>
                  Write
                </Button>
                <Button href="/all-posts" size="sm" variant="ghost" className="w-full" iconLeft={<LayoutGrid className="h-4 w-4" />}>
                  My posts
                </Button>
              </>
            ) : (
              <>
                <Button href="/login" size="sm" variant="ghost" className="w-full">
                  Log in
                </Button>
                <Button href="/signup" size="sm" variant="primary" className="w-full">
                  Start writing
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      data-active={active ? 'true' : 'false'}
      className={`link-line rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
        active ? 'text-accent' : 'text-muted hover:text-fg'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLinks({ open, nav, isActive }) {
  const { ref } = useMotionEffect((g, node) => {
    if (!open) return;
    g.from(g.utils.toArray('a', node), {
      y: 12,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'expo.out',
    });
  }, [open]);

  return (
    <ul ref={ref} className="flex flex-col">
      <li>
        <SheetLink href="/" active={isActive('/')}>Home</SheetLink>
      </li>
      {nav.map((item) => (
        <li key={item.slug}>
          <SheetLink href={item.slug} active={isActive(item.slug)}>{item.name}</SheetLink>
        </li>
      ))}
    </ul>
  );
}

function SheetLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[0.95rem] font-medium transition-colors duration-300 ${
        active ? 'bg-accent/12 text-accent' : 'text-fg hover:bg-accent/8'
      }`}
    >
      {children}
      <span aria-hidden className="text-faint">→</span>
    </Link>
  );
}
