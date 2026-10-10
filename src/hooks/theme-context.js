'use client';
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

/**
 * Theme state lives on <html> (class `dark`), painted by an inline script in
 * layout.js before first frame. `useSyncExternalStore` mirrors that single
 * source of truth, so there is no flash, no duplicate state and no effect that
 * has to "sync" a value back from the DOM.
 */
const STORAGE_KEY = 'themeMode';
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener('storage', emit);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', emit);
  };
}

const getSnapshot = () =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

// Servers have no DOM; the shell is light until the inline script says otherwise.
const getServerSnapshot = () => 'light';

const ThemeContext = createContext({
  themeMode: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  mounted: false,
});

export const ThemeProvider = ({ children }) => {
  const themeMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const setTheme = useCallback((mode) => {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.style.colorScheme = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* private mode: still applies for this session */
    }
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  // Follow the OS only while the visitor has never chosen explicitly.
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
