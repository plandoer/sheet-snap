import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormInput } from "../sheetForm/FormInput";

interface Props {
  amount: string;
  subAmounts: string[];
  onAmountChange: (value: string) => void;
  onSubAmountChange: (index: number, value: string) => void;
}

export default function AmountInputs({
  amount,
  subAmounts,
  onAmountChange,
  onSubAmountChange,
}: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [subAmountValue, setSubAmountValue] = useState("");
  const [subReasonValue, setSubReasonValue] = useState("");
  const snapPoints = useMemo(() => ["55%"], []);

  const openSubAmountDialog = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const closeSubAmountDialog = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleAddSubAmount = useCallback(() => {
    const cleanAmount = subAmountValue.trim();

    if (!cleanAmount) return;

    onSubAmountChange(subAmounts.length, cleanAmount);
    setSubAmountValue("");
    setSubReasonValue("");
    closeSubAmountDialog();
  }, [
    closeSubAmountDialog,
    onSubAmountChange,
    subAmountValue,
    subAmounts.length,
  ]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <View style={styles.amountRow}>
      <View style={styles.amountInputWrapper}>
        <FormInput
          value={amount}
          setValue={onAmountChange}
          label="Amount"
          placeholder="Enter amount"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.amountPlusButton}
        onPress={openSubAmountDialog}
        accessibilityRole="button"
        accessibilityLabel="Add sub amount"
      >
        <Ionicons
          name="add"
          size={24}
          color={GLOBAL_STYLES.colors.backgroundColor}
        />
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Sub Amount</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Amount</Text>
            <BottomSheetTextInput
              style={styles.fieldInput}
              value={subAmountValue}
              onChangeText={setSubAmountValue}
              placeholder=""
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Reason</Text>
            <BottomSheetTextInput
              style={styles.fieldInput}
              value={subReasonValue}
              onChangeText={setSubReasonValue}
              placeholder=""
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addButton}
            onPress={handleAddSubAmount}
            accessibilityRole="button"
            accessibilityLabel="Add sub amount"
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  amountInputWrapper: {
    flex: 1,
    marginRight: 12,
  },
  amountPlusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GLOBAL_STYLES.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: "#B5B5B5",
  },
  sheetTitle: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
    marginBottom: 28,
  },
  fieldContainer: {
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  fieldInput: {
    backgroundColor: "#fff",
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    marginTop: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 2,
  },
  addButtonText: {
    fontSize: 38,
    color: "#000",
    fontWeight: "500",
  },
});
