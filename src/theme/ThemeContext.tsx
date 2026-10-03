import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'dark') return 'dark';
  if (theme === 'light') return 'light';
  return getSystemTheme();
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'rock10-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Fallback gracioso para ambientes sem localStorage
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'dark') return 'dark';
      if (stored === 'light') return 'light';
      if (stored === 'system') return getSystemTheme();
    } catch {}
    return resolveTheme(defaultTheme);
  });

  const applyDomTheme = (effectiveTheme: ResolvedTheme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    const effectiveTheme = resolveTheme(theme);
    setResolvedTheme(effectiveTheme);
    applyDomTheme(effectiveTheme);

    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        const sysTheme = getSystemTheme();
        setResolvedTheme(sysTheme);
        applyDomTheme(sysTheme);
      };
      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
    return undefined;
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // Fallback silencioso para ambientes de restrição de storage
    }
    setThemeState(newTheme);
    const eff = resolveTheme(newTheme);
    setResolvedTheme(eff);
    applyDomTheme(eff);
  };

  const toggleTheme = () => {
    const nextTheme: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
