import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { RefObject, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onPersonAdd: (name: string) => void;
  sheetRef: RefObject<BottomSheetModal | null>;
}

export default function PersonSheet({ onPersonAdd, sheetRef }: Props) {
  const [nameValue, setNameValue] = useState("");

  const disabled = !nameValue.trim();

  function handleClose() {
    sheetRef.current?.dismiss();
  }

  function handleAdd() {
    const nameTrimmed = nameValue.trim();

    if (!nameTrimmed) return;

    onPersonAdd(nameTrimmed);
    setNameValue("");
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
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.sheetContent}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Add Person</Text>
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons
              name="close"
              size={20}
              color={GLOBAL_STYLES.colors.textMedium}
            />
          </TouchableOpacity>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name</Text>
          <BottomSheetTextInput
            style={styles.fieldInput}
            value={nameValue}
            onChangeText={setNameValue}
            placeholder="e.g. John Doe"
            placeholderTextColor={GLOBAL_STYLES.colors.placeholderText}
            maxLength={50}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.addButton, disabled && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Add person"
        >
          <Ionicons
            name="add"
            size={18}
            color={GLOBAL_STYLES.colors.white}
            style={styles.addButtonIcon}
          />
          <Text style={styles.addButtonText}>Add Person</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
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
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.textInk,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GLOBAL_STYLES.colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textSubtle,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: GLOBAL_STYLES.colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textInk,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: GLOBAL_STYLES.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  addButtonIcon: {
    marginRight: 6,
  },
  addButtonText: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.white,
    fontWeight: "600",
  },
  addButtonDisabled: {
    backgroundColor: GLOBAL_STYLES.colors.lightBorder,
  },
});
