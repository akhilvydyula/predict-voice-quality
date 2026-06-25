import type { KeyValueStorage } from './kvStorage.types';

const kvStorage: KeyValueStorage = {
  async getItem(key: string) {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  },
};

export default kvStorage;
