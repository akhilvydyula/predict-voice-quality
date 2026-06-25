import { AdvancedInsights } from '../audio/advancedAnalytics';
import { SingerProfile } from '../agent/singerProfile';
import { SessionSummary } from '../audio/voiceQuality';
import { getApiBaseUrl, getApiKey } from './config';
import {
  ApiErrorBody,
  ApiStatusResponse,
  HealthResponse,
  ProfileResponse,
  SessionListResponse,
  SyncSessionResponse,
} from './types';

export class VoiceQualityApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'VoiceQualityApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | ApiErrorBody) : null;

  if (!response.ok) {
    const err = data as ApiErrorBody | null;
    throw new VoiceQualityApiError(
      err?.error ?? `Request failed (${response.status})`,
      response.status,
      err?.code
    );
  }

  return data as T;
}

export async function pingHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health');
}

export async function fetchApiStatus(): Promise<ApiStatusResponse> {
  return request<ApiStatusResponse>('/v1/status');
}

export async function syncSessionToApi(input: {
  deviceId: string;
  summary: SessionSummary;
  advanced: AdvancedInsights;
  profile?: SingerProfile;
}): Promise<SyncSessionResponse> {
  return request<SyncSessionResponse>('/v1/sessions', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function fetchProfile(deviceId: string): Promise<ProfileResponse> {
  return request<ProfileResponse>(`/v1/profile/${encodeURIComponent(deviceId)}`);
}

export async function fetchSessionHistory(
  deviceId: string,
  limit = 10
): Promise<SessionListResponse> {
  return request<SessionListResponse>(
    `/v1/sessions/${encodeURIComponent(deviceId)}?limit=${limit}`
  );
}

export async function pushProfile(deviceId: string, profile: SingerProfile): Promise<ProfileResponse> {
  return request<ProfileResponse>(`/v1/profile/${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    body: JSON.stringify({ profile }),
  });
}
