import ExpoSQLiteStorage from "expo-sqlite/kv-store";

export const supabaseStorageService = {
  async getItem(key: string): Promise<string | null> {
    return await ExpoSQLiteStorage.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    await ExpoSQLiteStorage.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await ExpoSQLiteStorage.removeItemAsync(key);
  },
};
