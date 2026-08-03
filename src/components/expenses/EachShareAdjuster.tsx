import { EachShare } from "@/models/eachShare";
import { Person } from "@/models/person";
import { getSantizedNumericValue } from "@/utils/validationUtils";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GLOBAL_STYLES } from "../../constants/global-styles";
import EachShareInput from "./EachShareInput";

interface Props {
  amount: string;
  paidBy: Person;
  eachShares: EachShare[];
  currency: string;
  errorMessage?: string;
  onEachSharesChange: (eachShares: EachShare[]) => void;
}

export default function EachShareAdjuster({
  amount,
  paidBy,
  eachShares,
  currency,
  errorMessage,
  onEachSharesChange,
}: Props) {
  const [shares, setShares] = useState<EachShare[]>([]);

  const parsedAmount = parseFloat(amount) || 0;
  const totalShares = shares.reduce(
    (sum, value) => sum + (parseFloat(value.amount) || 0),
    0,
  );
  const remainingAmount = parsedAmount - totalShares;
  const isMatch = remainingAmount === 0;

  const [isExpanded, setIsExpanded] = useState(false);
  let headerText = "Each Share";

  function toggleExpand() {
    setIsExpanded((prev) => !prev);
  }

  function handleShareChange(personId: string, value: string) {
    const sanitizedValue = getSantizedNumericValue(value);
    const updatedShares = shares.map((share) =>
      share.person.id === personId
        ? { ...share, amount: sanitizedValue }
        : share,
    );
    setShares(updatedShares);
    onEachSharesChange(updatedShares);
  }

  function handleAutoAdjustByAddingRemainingAmountToPayer() {
    const updatedShares = shares.map((share) => {
      if (share.person.id === paidBy.id) {
        const newAmount = (parseFloat(share.amount) || 0) + remainingAmount;
        return { ...share, amount: newAmount.toFixed(2) };
      }
      return share;
    });
    setShares(updatedShares);
    onEachSharesChange(updatedShares);
  }

  useEffect(() => {
    if (eachShares.length > 0) {
      setShares(eachShares);
    }
  }, [eachShares]);

  if (errorMessage) {
    headerText = errorMessage;
  }

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.header}
        onPress={toggleExpand}
      >
        {/* Label */}
        <Text style={[styles.headerTitle, errorMessage && styles.labelError]}>
          {headerText}
        </Text>
        {/* Expand/Collapse Icon */}
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={GLOBAL_STYLES.colors.textDark}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Each share input boxes */}
          {shares.map((share) => (
            <EachShareInput
              key={share.person.id}
              share={share}
              handleShareChange={handleShareChange}
            />
          ))}

          {/* Auto Adjust Button */}
          {remainingAmount !== 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAutoAdjustByAddingRemainingAmountToPayer}
            >
              <Text style={styles.autoAdjustButtonText}>Auto Adjust</Text>
            </TouchableOpacity>
          )}

          {/* Footer */}
          <View style={styles.totalRow}>
            {/* Total Amount */}
            <Text style={styles.totalText}>
              Total: {totalShares.toLocaleString()} {currency}
            </Text>

            {/* Match Status */}
            {parsedAmount > 0 && (
              <>
                {/* Correct or Incorrect Icon */}
                <Ionicons
                  name={isMatch ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={
                    isMatch
                      ? GLOBAL_STYLES.colors.primary
                      : GLOBAL_STYLES.colors.danger
                  }
                  style={styles.statusIcon}
                />

                {/* Error Message */}
                {!isMatch && (
                  <Text style={styles.errorText}>
                    (Must be {parsedAmount.toLocaleString()}
                    {currency})
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GLOBAL_STYLES.colors.textDark,
  },
  labelError: {
    color: GLOBAL_STYLES.colors.danger,
    fontSize: 16,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    color: GLOBAL_STYLES.colors.black,
  },
  content: {
    paddingTop: 16,
    gap: 16,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.black,
  },
  statusIcon: {
    marginLeft: 4,
  },
  errorText: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.black,
  },
  autoAdjustButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.primary,
  },
});
