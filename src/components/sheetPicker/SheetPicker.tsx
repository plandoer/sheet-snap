import { useSheetContext } from "@/context/SheetContext";
import { GoogleSheet } from "@/models/googleSheet";
import { GoogleSpreadsheet } from "@/models/googleSpreadSheet";
import { googleSheetService } from "@/services/googleSheetService";
import { getErrorInfo } from "@/utils/errorUtils";
import { useState } from "react";
import { Alert } from "react-native";
import SheetModal from "./SheetModal";
import SheetSelectbox from "./SheetSelectbox";
import SpreadSheetModal from "./SpreadSheetModal";

export default function SheetPicker() {
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);

  const [spreadsheets, setSpreadsheets] = useState<GoogleSpreadsheet[]>([]);
  const [isSpreadsheetLoading, setIsSpreadsheetLoading] = useState(false);

  const [selectedSpreadsheet, setSelectedSpreadsheet] =
    useState<GoogleSpreadsheet | null>(null);
  const spreadsheetName = selectedSpreadsheet?.name ?? "";

  const [sheets, setSheets] = useState<GoogleSheet[]>([]);
  const [isSheetLoading, setIsSheetLoading] = useState(false);

  const { setSelectedSheet } = useSheetContext();

  function handleOpenSpreadsheetModal() {
    openSpreadsheetModal();
    loadSpreadsheets();
  }

  function openSpreadsheetModal() {
    setShowSpreadsheetModal(true);
  }

  async function loadSpreadsheets() {
    try {
      setIsSpreadsheetLoading(true);
      const spreadsheets = await googleSheetService.fetchSpreadsheets();
      setSpreadsheets(spreadsheets);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
      console.error("Failed to load spreadsheets", error);
    } finally {
      setIsSpreadsheetLoading(false);
    }
  }

  function handleOpenSheetModal(spreadSheet: GoogleSpreadsheet) {
    setSelectedSpreadsheet(spreadSheet);
    openSheetModal();
    loadSheets(spreadSheet);
  }

  function openSheetModal() {
    setShowSheetModal(true);
  }

  async function loadSheets(spreadSheet: GoogleSpreadsheet) {
    try {
      setIsSheetLoading(true);
      const sheets = await googleSheetService.fetchSheets(spreadSheet.id);
      setSheets(sheets);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
      console.error("Failed to load sheets", error);
    } finally {
      setIsSheetLoading(false);
    }
  }

  function handleSheetSelect(sheet: GoogleSheet) {
    if (!selectedSpreadsheet) return;

    setSelectedSheet({
      spreadsheet: selectedSpreadsheet,
      sheet: sheet,
    });

    closeModals();
  }

  function closeModals() {
    closeSpreadsheetModal();
    closeSheetModal();
  }

  function closeSpreadsheetModal() {
    setShowSpreadsheetModal(false);
  }

  function closeSheetModal() {
    setShowSheetModal(false);
  }

  return (
    <>
      <SheetSelectbox onPress={handleOpenSpreadsheetModal} />

      {showSpreadsheetModal && (
        <SpreadSheetModal
          visible={showSpreadsheetModal}
          isLoading={isSpreadsheetLoading}
          spreadsheets={spreadsheets}
          onClose={closeSpreadsheetModal}
          onClick={handleOpenSheetModal}
        />
      )}

      {showSheetModal && (
        <SheetModal
          visible={showSheetModal}
          isLoading={isSheetLoading}
          spreadsheetName={spreadsheetName}
          sheets={sheets}
          onClose={closeSheetModal}
          onCloseAll={closeModals}
          onClick={handleSheetSelect}
        />
      )}
    </>
  );
}
