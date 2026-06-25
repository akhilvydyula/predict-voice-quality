import { EMPTY_PROFILE, SingerProfile } from '../agent/singerProfile';
import kvStorage from './kvStorage';

const PROFILE_KEY = '@voicequality/singer_profile';

export async function loadSingerProfile(): Promise<SingerProfile> {
  try {
    const raw = await kvStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...EMPTY_PROFILE };
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export async function saveSingerProfile(profile: SingerProfile): Promise<void> {
  const trimmed = {
    ...profile,
    sessions: profile.sessions.slice(-30),
  };
  await kvStorage.setItem(PROFILE_KEY, JSON.stringify(trimmed));
}

export async function clearSingerProfile(): Promise<void> {
  await kvStorage.removeItem(PROFILE_KEY);
}
