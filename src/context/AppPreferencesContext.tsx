import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import { loadUserSettings, saveUserSettings } from '../storage/userSettingsStore';
import {
  getPalette,
  initialsFromName,
  type ThemeColors,
  type ThemeGradients,
  type ThemeMode,
} from '../theme/palettes';

type AppPreferencesContextValue = {
  ready: boolean;
  theme: ThemeMode;
  colors: ThemeColors;
  gradients: ThemeGradients;
  statusBarStyle: 'light' | 'dark';
  toggleTheme: () => void;
  displayName: string;
  initials: string;
  setDisplayName: (name: string) => Promise<void>;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [displayName, setDisplayNameState] = useState('');

  useEffect(() => {
    loadUserSettings().then((settings) => {
      setTheme(settings.theme);
      setDisplayNameState(settings.displayName);
      setReady(true);
    });
  }, []);

  const palette = useMemo(() => getPalette(theme), [theme]);
  const statusBarStyle: 'light' | 'dark' = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    if (!ready || Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.style.colorScheme = theme;
    document.body.style.backgroundColor = palette.colors.background;
  }, [ready, theme, palette.colors.background]);

  const persist = useCallback(async (nextTheme: ThemeMode, nextName: string) => {
    await saveUserSettings({ theme: nextTheme, displayName: nextName });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      void persist(next, displayName);
      return next;
    });
  }, [displayName, persist]);

  const setDisplayName = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      setDisplayNameState(trimmed);
      await persist(theme, trimmed);
    },
    [persist, theme]
  );

  const value = useMemo(
    () => ({
      ready,
      theme,
      colors: palette.colors,
      gradients: palette.gradients,
      statusBarStyle,
      toggleTheme,
      displayName,
      initials: initialsFromName(displayName),
      setDisplayName,
    }),
    [ready, theme, palette, statusBarStyle, toggleTheme, displayName, setDisplayName]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }
  return ctx;
}

/** Theme colors for components that support dark mode. */
export function useThemeColors(): ThemeColors {
  return useAppPreferences().colors;
}
