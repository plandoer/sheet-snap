import { Group } from "@/models/group";
import { SpreadsheetSheetSelection } from "@/models/spreadsheetSheetSelection";

export function mapSheetSelectionToGroup(
  currentGroup: Group,
  sheetSelection: SpreadsheetSheetSelection,
) {
  const updatedGroup = {
    ...currentGroup,
    spreadsheetId: sheetSelection.spreadsheet.id,
    spreadsheetName: sheetSelection.spreadsheet.name,
    spreadsheetModifiedTime: sheetSelection.spreadsheet.modifiedTime,
    sheetId: sheetSelection.sheet.properties.sheetId,
    sheetTitle: sheetSelection.sheet.properties.title,
    sheetIndex: sheetSelection.sheet.properties.index,
  };
  return updatedGroup;
}
