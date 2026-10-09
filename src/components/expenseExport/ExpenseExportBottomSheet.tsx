import { GLOBAL_STYLES } from "@/constants/global-styles";
import { SheetSelection } from "@/context/SheetContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { Ref, useImperativeHandle, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../IconButton";
import SheetPicker from "../expenseForm/SheetPicker";

export interface ExpenseExportBottomSheetRef {
  present: () => void;
}

interface Props {
  ref?: Ref<ExpenseExportBottomSheetRef>;
  expenseCount: number;
  selectedSheet: SheetSelection | null;
  onExport: () => void;
}

export default function ExpenseExportBottomSheet({
  ref,
  onExport,
  selectedSheet,
  expenseCount,
}: Props) {
  const sheetRef = useRef<BottomSheetModal | null>(null);

  const disabled = !selectedSheet || expenseCount === 0;

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
  }));

  function handleExport() {
    closeBottomSheet();
    onExport();
  }

  function closeBottomSheet() {
    sheetRef.current?.dismiss();
  }

  function renderBackdrop(props: any) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  }

  return (
    <>
      <BottomSheetModal
        ref={sheetRef}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Export to Google Sheet</Text>
            <IconButton name="close" color="gray" onPress={closeBottomSheet} />
          </View>
          <Text style={styles.headerSubtitle}>
            Review the destination before exporting.
          </Text>

          {/* Destination */}
          <Text style={styles.fieldLabel}>Destination Sheet</Text>
          <View style={styles.pickerContainer}>
            <SheetPicker />
          </View>

          {/* Summary */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="google-spreadsheet"
              size={22}
              color={GLOBAL_STYLES.colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              <Text style={styles.infoCount}>
                {expenseCount === 1 ? "1 expense" : `${expenseCount} expenses`}
              </Text>
              {" will be appended to the selected Google Sheet."}
            </Text>
          </View>

          {/* Export Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.exportButton,
              disabled && styles.exportButtonDisabled,
            ]}
            onPress={handleExport}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Export expenses to sheet"
          >
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: GLOBAL_STYLES.colors.dividerLight,
    width: 40,
  },
  sheetBackground: {
    backgroundColor: GLOBAL_STYLES.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
    backgroundColor: GLOBAL_STYLES.colors.white,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.textInk,
  },
  headerSubtitle: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textSecondary,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: GLOBAL_STYLES.colors.textMedium,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: GLOBAL_STYLES.colors.textSubtle,
  },
  infoCount: {
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.primary,
  },
  exportButton: {
    backgroundColor: GLOBAL_STYLES.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  exportButtonText: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.white,
    fontWeight: "600",
  },
});
