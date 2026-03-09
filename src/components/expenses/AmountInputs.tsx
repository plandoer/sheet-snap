import { GLOBAL_STYLES } from "@/constants/global-styles";
import { SubAmount } from "@/models/subAmount";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormInput } from "../sheetForm/FormInput";
import SubAmountSheet from "./SubAmountSheet";

interface Props {
  amount: string;
  subAmounts: SubAmount[];
  onAmountChange: (value: string) => void;
  onSubAmountsChange: (subAmounts: SubAmount[]) => void;
}

export default function AmountInputs({
  amount,
  subAmounts,
  onAmountChange,
  onSubAmountsChange,
}: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const hasSubAmounts = subAmounts.length > 0;

  const totalSubs = subAmounts
    .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
    .toString();

  const openSubAmountDialog = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleAdd = useCallback(
    (subAmount: string, reason: string) => {
      const next = [...subAmounts, { amount: subAmount, reason }];
      onSubAmountsChange(next);
      onAmountChange(
        next
          .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
          .toString(),
      );
    },
    [onSubAmountsChange, onAmountChange, subAmounts],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const next = subAmounts.filter((_, i) => i !== index);
      onSubAmountsChange(next);
      if (next.length === 0) {
        onAmountChange("");
      } else {
        onAmountChange(
          next
            .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
            .toString(),
        );
      }
    },
    [onSubAmountsChange, onAmountChange, subAmounts],
  );

  return (
    <View style={styles.container}>
      {/* Main amount row */}
      <View style={styles.amountRow}>
        <View style={styles.amountInputWrapper}>
          <FormInput
            value={hasSubAmounts ? totalSubs : amount}
            setValue={onAmountChange}
            label="Amount"
            placeholder="Enter amount"
            keyboardType="numeric"
            disabled={hasSubAmounts}
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
      </View>

      {/* Sub amounts list */}
      {hasSubAmounts && (
        <View style={styles.subAmountsList}>
          {subAmounts.map((sub, index) => {
            const isLast = index === subAmounts.length - 1;
            return (
              <View key={index} style={styles.subAmountRow}>
                {/* Tree branch */}
                <View style={styles.treeBranchWrapper}>
                  <View
                    style={[
                      styles.treeVertical,
                      isLast && styles.treeVerticalHalf,
                    ]}
                  />
                  <View style={styles.treeHorizontal} />
                </View>

                {/* Content */}
                <View style={styles.subAmountContent}>
                  <Text style={styles.subAmountReason} numberOfLines={1}>
                    {sub.reason || `Sub Amount ${index + 1}`}
                  </Text>
                  <Text style={styles.subAmountValue}>
                    {(parseFloat(sub.amount) || 0).toLocaleString()} THB
                  </Text>
                </View>

                {/* Remove */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.removeButton}
                  onPress={() => handleRemove(index)}
                  accessibilityRole="button"
                  accessibilityLabel="Remove sub amount"
                >
                  <Ionicons name="remove" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      <SubAmountSheet sheetRef={bottomSheetRef} onAdd={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
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
  subAmountsList: {
    marginTop: -12,
    marginBottom: 8,
    paddingLeft: 16,
  },
  subAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  treeBranchWrapper: {
    width: 24,
    alignSelf: "stretch",
    marginRight: 8,
  },
  treeVertical: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#ccc",
  },
  treeVerticalHalf: {
    bottom: "50%",
  },
  treeHorizontal: {
    position: "absolute",
    left: 0,
    top: "50%",
    width: 18,
    height: 2,
    backgroundColor: "#ccc",
  },
  subAmountContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  subAmountReason: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginRight: 8,
  },
  subAmountValue: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#888",
    alignItems: "center",
    justifyContent: "center",
  },
});
