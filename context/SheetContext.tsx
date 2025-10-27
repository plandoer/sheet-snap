import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GoogleSheet {
  id: string;
  name: string;
}

interface SheetContextType {
  selectedSheet: GoogleSheet | null;
  setSelectedSheet: (sheet: GoogleSheet | null) => void;
  isLoading: boolean;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

const STORAGE_KEY = "@sheet_snap_selected_sheet";

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [selectedSheet, setSelectedSheetState] = useState<GoogleSheet | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved sheet selection when app starts
    async function loadSavedSheet() {
      try {
        const savedSheet = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedSheet) {
          setSelectedSheetState(JSON.parse(savedSheet));
        }
      } catch (error) {
        console.error("Error loading saved sheet:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedSheet();
  }, []);

  const setSelectedSheet = async (sheet: GoogleSheet | null) => {
    try {
      if (sheet) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sheet));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      setSelectedSheetState(sheet);
    } catch (error) {
      console.error("Error saving sheet selection:", error);
    }
  };

  return (
    <SheetContext.Provider
      value={{ selectedSheet, setSelectedSheet, isLoading }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const context = useContext(SheetContext);
  if (context === undefined) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
}
