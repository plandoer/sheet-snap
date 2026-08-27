import ExpoSQLiteStorage from "expo-sqlite/kv-store";

export const storageService = {
  async getItem(key: string): Promise<any | null> {
    const value = await ExpoSQLiteStorage.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  },

  async setItem(key: string, value: any): Promise<void> {
    await ExpoSQLiteStorage.setItemAsync(key, JSON.stringify(value));
  },

  async removeItem(key: string): Promise<void> {
    await ExpoSQLiteStorage.removeItemAsync(key);
  },
};
