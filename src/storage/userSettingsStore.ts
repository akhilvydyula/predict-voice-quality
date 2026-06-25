import kvStorage from './kvStorage';

const SETTINGS_KEY = '@voicequality/user_settings';

export type UserSettings = {
  displayName: string;
  theme: 'light' | 'dark';
};

const DEFAULT_SETTINGS: UserSettings = {
  displayName: '',
  theme: 'light',
};

export async function loadUserSettings(): Promise<UserSettings> {
  try {
    const raw = await kvStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return {
      displayName: typeof parsed.displayName === 'string' ? parsed.displayName : '',
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  await kvStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
