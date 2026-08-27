import ExpoSQLiteStorage from "expo-sqlite/kv-store";

export const storageService = {
  async getItem(key: string): Promise<string | null> {
    return ExpoSQLiteStorage.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    await ExpoSQLiteStorage.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await ExpoSQLiteStorage.removeItemAsync(key);
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const value = await ExpoSQLiteStorage.getItemAsync(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      await ExpoSQLiteStorage.removeItemAsync(key);
      return null;
    }
  },

  async setJSON(key: string, value: unknown): Promise<void> {
    await ExpoSQLiteStorage.setItemAsync(key, JSON.stringify(value));
  },
};
