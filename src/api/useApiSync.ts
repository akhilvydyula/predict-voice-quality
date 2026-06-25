import { useCallback, useEffect, useState } from 'react';

import { AdvancedInsights } from '../audio/advancedAnalytics';
import { SingerProfile } from '../agent/singerProfile';
import { SessionSummary } from '../audio/voiceQuality';
import {
  fetchApiStatus,
  fetchSessionHistory,
  pingHealth,
  syncSessionToApi,
  VoiceQualityApiError,
} from './client';
import { getApiBaseUrl, isApiConfigured } from './config';
import { getDeviceId } from './deviceId';
import { ApiSyncState } from './types';

const INITIAL_STATE: ApiSyncState = {
  configured: isApiConfigured(),
  baseUrl: getApiBaseUrl(),
  lastPingAt: null,
  lastPingOk: null,
  lastSyncAt: null,
  lastSyncOk: null,
  lastError: null,
};

export function useApiSync() {
  const [state, setState] = useState<ApiSyncState>(INITIAL_STATE);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    void getDeviceId().then(setDeviceId);
  }, []);

  const ping = useCallback(async () => {
    const at = new Date().toISOString();
    try {
      const health = await pingHealth();
      setState((prev) => ({
        ...prev,
        baseUrl: getApiBaseUrl(),
        configured: isApiConfigured(),
        lastPingAt: at,
        lastPingOk: health.ok,
        lastError: null,
      }));
      return health;
    } catch (e) {
      const message = e instanceof VoiceQualityApiError ? e.message : 'Ping failed';
      setState((prev) => ({
        ...prev,
        lastPingAt: at,
        lastPingOk: false,
        lastError: message,
      }));
      throw e;
    }
  }, []);

  const syncSession = useCallback(
    async (summary: SessionSummary, advanced: AdvancedInsights, profile?: SingerProfile) => {
      const id = deviceId ?? (await getDeviceId());
      if (!deviceId) setDeviceId(id);

      const at = new Date().toISOString();
      try {
        const result = await syncSessionToApi({
          deviceId: id,
          summary,
          advanced,
          profile,
        });
        setState((prev) => ({
          ...prev,
          lastSyncAt: at,
          lastSyncOk: true,
          lastError: null,
        }));
        return result;
      } catch (e) {
        const message = e instanceof VoiceQualityApiError ? e.message : 'Sync failed';
        setState((prev) => ({
          ...prev,
          lastSyncAt: at,
          lastSyncOk: false,
          lastError: message,
        }));
        throw e;
      }
    },
    [deviceId]
  );

  const loadStatus = useCallback(async () => {
    return fetchApiStatus();
  }, []);

  const loadHistory = useCallback(async () => {
    const id = deviceId ?? (await getDeviceId());
    if (!deviceId) setDeviceId(id);
    return fetchSessionHistory(id);
  }, [deviceId]);

  return {
    deviceId,
    state,
    ping,
    syncSession,
    loadStatus,
    loadHistory,
  };
}
