import { GoogleSpreadsheet } from "@/models/googleSpreadSheet";
import { googleSheetService } from "@/services/googleSheetService";
import { useState } from "react";
import SheetModal from "./SheetModal";
import SheetSelectbox from "./SheetSelectbox";
import SpreadSheetModal from "./SpreadSheetModal";

export default function SheetPicker() {
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);

  const [spreadsheets, setSpreadsheets] = useState<GoogleSpreadsheet[]>([]);
  const [isSpreadsheetLoading, setIsSpreadsheetLoading] = useState(false);

  function handleOpenSpreadsheet() {
    openSpreadsheetModal();
    loadSpreadsheets();
  }

  function openSpreadsheetModal() {
    setShowSpreadsheetModal(true);
  }

  async function loadSpreadsheets() {
    setIsSpreadsheetLoading(true);
    const sheets = await googleSheetService.fetchSpreadsheets();
    setSpreadsheets(sheets);
    setIsSpreadsheetLoading(false);
  }

  function closeSpreadsheetModal() {
    setShowSpreadsheetModal(false);
  }

  function closeSheetModal() {
    setShowSheetModal(false);
  }

  return (
    <>
      <SheetSelectbox onPress={handleOpenSpreadsheet} />

      {showSpreadsheetModal && (
        <SpreadSheetModal
          visible={showSpreadsheetModal}
          onClose={closeSpreadsheetModal}
          isLoading={isSpreadsheetLoading}
          spreadsheets={spreadsheets}
          onClick={() => {}}
        />
      )}

      {showSheetModal && (
        <SheetModal
          visible={showSheetModal}
          onClose={closeSheetModal}
          isLoading={false}
          spreadsheetName=""
          sheets={[]}
          onClick={() => {}}
        />
      )}
    </>
  );
}
