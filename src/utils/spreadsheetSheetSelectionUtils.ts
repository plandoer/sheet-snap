import { Group } from "@/models/group";
import { SpreadsheetSheetSelection } from "@/models/spreadsheetSheetSelection";

export function mapSheetSelectionToGroup(
  currentGroup: Group,
  sheetSelection: SpreadsheetSheetSelection,
): Group {
  const updatedGroup = {
    ...currentGroup,
    spreadsheetSheetSelection: sheetSelection,
  };
  return updatedGroup;
}
