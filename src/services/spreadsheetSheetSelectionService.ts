import { ErrorType } from "@/models/enums/errorType";
import { SpreadsheetSheetSelection } from "@/models/spreadsheetSheetSelection";
import { supabase } from "./supabaseAuthService";

export const spreadsheetSheetSelectionService = {
  async save(
    groupId: string,
    sheetSelection: SpreadsheetSheetSelection,
  ): Promise<SpreadsheetSheetSelection> {
    const { error } = await supabase
      .from("spreadsheet_sheet_selections")
      .upsert(
        {
          group_id: groupId,
          spreadsheet_id: sheetSelection.spreadsheet.id,
          spreadsheet_name: sheetSelection.spreadsheet.name,
          spreadsheet_modified_time: sheetSelection.spreadsheet.modifiedTime,
          sheet_id: sheetSelection.sheet.properties.sheetId,
          sheet_title: sheetSelection.sheet.properties.title,
          sheet_index: sheetSelection.sheet.properties.index,
        },
        { onConflict: "group_id" },
      );

    if (error) {
      const customError = new Error("Failed to create sheet selection", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_CREATE_SHEET_SELECTION;
      throw customError;
    }
    return sheetSelection;
  },
};
