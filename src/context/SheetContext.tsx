import { GoogleSheet } from "@/services/google-drive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GoogleSpreadsheet {
  id: string;
  name: string;
}

interface SheetSelection {
  spreadsheet: GoogleSpreadsheet;
  sheet: GoogleSheet;
}

interface SheetContextType {
  selectedSheet: SheetSelection | null;
  setSelectedSheet: (sheet: SheetSelection | null) => void;
  isLoading: boolean;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

const STORAGE_KEY = "@sheet_snap_selected_sheet";

function isValidSheetSelection(obj: any): obj is SheetSelection {
  return (
    obj &&
    typeof obj === "object" &&
    obj.spreadsheet &&
    typeof obj.spreadsheet === "object" &&
    typeof obj.spreadsheet.id === "string" &&
    typeof obj.spreadsheet.name === "string" &&
    obj.sheet &&
    typeof obj.sheet === "object" &&
    obj.sheet.properties &&
    typeof obj.sheet.properties === "object" &&
    typeof obj.sheet.properties.title === "string"
  );
}

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [selectedSheet, setSelectedSheetState] =
    useState<SheetSelection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved sheet selection when app starts
    async function loadSavedSheet() {
      try {
        const savedSheet = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedSheet) {
          const parsed = JSON.parse(savedSheet);
          if (isValidSheetSelection(parsed)) {
            setSelectedSheetState(parsed);
          } else {
            // Invalid data, remove it
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading saved sheet:", error);
        // If there's an error, clear the invalid data
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (clearError) {
          console.error("Error clearing invalid sheet data:", clearError);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedSheet();
  }, []);

  const setSelectedSheet = async (sheet: SheetSelection | null) => {
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
