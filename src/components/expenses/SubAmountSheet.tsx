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
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Amount Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <BottomSheetTextInput
            style={styles.fieldInput}
            value={amountValue}
            onChangeText={setAmountValue}
            placeholder="0.00"
            placeholderTextColor="#aaa"
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
            placeholderTextColor="#aaa"
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
            color="#fff"
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
    backgroundColor: "#ddd",
    width: 40,
  },
  sheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
    backgroundColor: "#fff",
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
    color: "#1a1a1a",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: "#1a1a1a",
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
    color: "#fff",
    fontWeight: "600",
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
