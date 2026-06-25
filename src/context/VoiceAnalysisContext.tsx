import { createContext, ReactNode, useContext } from 'react';

import { useDevMode } from './DevModeContext';
import { useVoiceAnalysis, VoiceAnalysisValue } from '../hooks/useVoiceAnalysis';

const VoiceAnalysisContext = createContext<VoiceAnalysisValue | null>(null);

export function VoiceAnalysisProvider({ children }: { children: ReactNode }) {
  const { flags } = useDevMode();
  const value = useVoiceAnalysis({
    verboseLogging: flags.verboseLogging,
    apiSyncEnabled: flags.apiSyncEnabled,
  });
  return <VoiceAnalysisContext.Provider value={value}>{children}</VoiceAnalysisContext.Provider>;
}

export function useVoiceSession(): VoiceAnalysisValue {
  const ctx = useContext(VoiceAnalysisContext);
  if (!ctx) {
    throw new Error('useVoiceSession must be used within VoiceAnalysisProvider');
  }
  return ctx;
}
