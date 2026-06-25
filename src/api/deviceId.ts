import kvStorage from '../storage/kvStorage';

const DEVICE_ID_KEY = '@voicequality/device_id';

function randomId(): string {
  return `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function getDeviceId(): Promise<string> {
  try {
    const existing = await kvStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const created = randomId();
    await kvStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {
    return randomId();
  }
}
