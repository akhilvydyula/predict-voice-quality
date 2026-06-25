const DEFAULT_BASE_URL = 'http://localhost:3001';

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return DEFAULT_BASE_URL;
}

export function getApiKey(): string | null {
  const key = process.env.EXPO_PUBLIC_API_KEY?.trim();
  return key || null;
}

export function isApiConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_API_URL?.trim());
}
