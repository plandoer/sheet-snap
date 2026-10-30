import { useGroupContext } from "@/context/GroupContext";
import { SpreadsheetSheetSelection } from "@/models/spreadsheetSheetSelection";
import { spreadsheetSheetSelectionService } from "@/services/spreadsheetSheetSelectionService";
import { mapSheetSelectionToGroup } from "@/utils/spreadsheetSheetSelectionUtils";
import { useMutation } from "@tanstack/react-query";

export function useUpdateSpreadsheetSheetSelection() {
  const { currentGroup, updateAndPersistCurrentGroup } = useGroupContext();
  const groupId = currentGroup?.id ?? "";

  return useMutation({
    mutationFn: (sheetSelection: SpreadsheetSheetSelection) =>
      spreadsheetSheetSelectionService.save(groupId, sheetSelection),
    onSuccess: (sheetSelection: SpreadsheetSheetSelection) => {
      if (currentGroup) {
        const updatedGroup = mapSheetSelectionToGroup(
          currentGroup,
          sheetSelection,
        );
        updateAndPersistCurrentGroup(updatedGroup);
      }
    },
  });
}
