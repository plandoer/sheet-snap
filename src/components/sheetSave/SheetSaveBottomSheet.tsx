import { GLOBAL_STYLES } from "@/constants/global-styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { RefObject } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../IconButton";
import SheetPicker from "../sheetForm/SheetPicker";

interface Props {
  sheetRef: RefObject<BottomSheetModal | null>;
  expenseCount: number;
}

export default function SheetSaveBottomSheet({
  sheetRef,
  expenseCount,
}: Props) {
  const disabled = false;

  function handleClose() {
    sheetRef.current?.dismiss();
  }

  function handleSave() {
    handleClose();
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
            <Text style={styles.sheetTitle}>Save to Sheet</Text>
            <IconButton name="close" color="gray" onPress={handleClose} />
          </View>
          <Text style={styles.headerSubtitle}>
            Review the destination before saving.
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

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.saveButton, disabled && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Save expenses to sheet"
          >
            <MaterialCommunityIcons
              name="content-save-outline"
              size={18}
              color={GLOBAL_STYLES.colors.white}
              style={styles.saveButtonIcon}
            />
            <Text style={styles.saveButtonText}>Save</Text>
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
  saveButton: {
    backgroundColor: GLOBAL_STYLES.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.white,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    backgroundColor: GLOBAL_STYLES.colors.lightBorder,
  },
});
