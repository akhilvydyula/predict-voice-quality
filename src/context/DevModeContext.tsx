import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  DevFlags,
  loadArchitectDevMode,
  loadDevFlags,
  saveArchitectDevMode,
  saveDevFlags,
} from '../dev/devModeStore';

type DevModeContextValue = {
  ready: boolean;
  enabled: boolean;
  flags: DevFlags;
  setEnabled: (value: boolean) => Promise<void>;
  setFlag: <K extends keyof DevFlags>(key: K, value: DevFlags[K]) => Promise<void>;
  registerUnlockTap: () => void;
};

const DevModeContext = createContext<DevModeContextValue | null>(null);

const UNLOCK_TAPS = 5;

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabledState] = useState(__DEV__);
  const [flags, setFlags] = useState<DevFlags>({
    showLiveOverlay: true,
    verboseLogging: false,
    mockScores: false,
    apiSyncEnabled: false,
  });
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    Promise.all([loadArchitectDevMode(), loadDevFlags()]).then(([mode, loadedFlags]) => {
      const forced = process.env.EXPO_PUBLIC_ARCHITECT_DEV === '1';
      setEnabledState(__DEV__ || mode || forced);
      setFlags(loadedFlags);
      setReady(true);
    });
  }, []);

  const setEnabled = useCallback(async (value: boolean) => {
    setEnabledState(value);
    await saveArchitectDevMode(value);
  }, []);

  const setFlag = useCallback(async <K extends keyof DevFlags>(key: K, value: DevFlags[K]) => {
    setFlags((prev) => {
      const next = { ...prev, [key]: value };
      void saveDevFlags(next);
      return next;
    });
  }, []);

  const registerUnlockTap = useCallback(() => {
    setTapCount((count) => {
      const next = count + 1;
      if (next >= UNLOCK_TAPS) {
        void setEnabled(true);
        return 0;
      }
      return next;
    });
  }, [setEnabled]);

  const value = useMemo(
    () => ({
      ready,
      enabled,
      flags,
      setEnabled,
      setFlag,
      registerUnlockTap,
    }),
    [ready, enabled, flags, setEnabled, setFlag, registerUnlockTap]
  );

  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) {
    throw new Error('useDevMode must be used within DevModeProvider');
  }
  return ctx;
}
