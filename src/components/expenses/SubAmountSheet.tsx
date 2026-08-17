import { GLOBAL_STYLES } from "@/constants/global-styles";
import { getSanitizedNumericValue } from "@/utils/validationUtils";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { RefObject, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../IconButton";

interface Props {
  onAdd: (amount: string, reason: string) => void;
  sheetRef: RefObject<BottomSheetModal | null>;
}

export default function SubAmountSheet({ onAdd, sheetRef }: Props) {
  const [amountValue, setAmountValue] = useState("");
  const [reasonValue, setReasonValue] = useState("");

  const disabled = !amountValue.trim() || !reasonValue.trim();

  function handleClose() {
    sheetRef.current?.dismiss();
  }

  function handleAdd() {
    const amountTrimmed = amountValue.trim();
    const reasonTrimmed = reasonValue.trim();

    if (!amountTrimmed || !reasonTrimmed) return;

    onAdd(amountTrimmed, reasonTrimmed);
    setAmountValue("");
    setReasonValue("");
    handleClose();
  }

  function handleChangeAmount(text: string) {
    setAmountValue(getSanitizedNumericValue(text));
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
          <Text style={styles.sheetTitle}>Add Sub Amount</Text>
          {/* Close Button */}
          <IconButton name="close" color="gray" onPress={handleClose} />
        </View>

        {/* Amount Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <BottomSheetTextInput
            style={styles.fieldInput}
            value={amountValue}
            onChangeText={(text) => handleChangeAmount(text)}
            placeholder="0.00"
            placeholderTextColor={GLOBAL_STYLES.colors.placeholderText}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Reason Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Reason</Text>
          <BottomSheetTextInput
            style={styles.fieldInput}
            value={reasonValue}
            onChangeText={setReasonValue}
            placeholder="e.g. tax, tip..."
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
          accessibilityLabel="Add sub amount"
        >
          <Ionicons
            name="add"
            size={18}
            color={GLOBAL_STYLES.colors.white}
            style={styles.addButtonIcon}
          />
          <Text style={styles.addButtonText}>Add Sub Amount</Text>
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
