import { EachShare } from "@/models/eachShare";
import { Person } from "@/models/person";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GLOBAL_STYLES } from "../../constants/global-styles";

interface Props {
  persons: Person[];
  amount: string;
  eachShares: EachShare[];
  currency: string;
}

export default function EachShareAdjuster({
  persons,
  amount,
  eachShares,
  currency,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shares, setShares] = useState<string[]>([]);

  const parsedAmount = parseFloat(amount) || 0;
  const totalShares = shares.reduce(
    (sum, value) => sum + (parseFloat(value) || 0),
    0,
  );
  const isMatch = parsedAmount > 0 && totalShares === parsedAmount;

  function toggleExpand() {
    setIsExpanded((prev) => !prev);
  }

  function handleShareChange(index: number, value: string) {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const sanitizedValue =
      parts.length > 2
        ? `${parts[0]}.${parts.slice(1).join("")}`
        : numericValue;
    setShares((prev) =>
      prev.map((share, i) => (i === index ? sanitizedValue : share)),
    );
  }

  // useEffect(() => {
  //   if (persons.length === 0) {
  //     setShares([]);
  //     return;
  //   }

  //   const equalShare = (
  //     parsedAmount > 0 ? parsedAmount / persons.length : ""
  //   ).toString();

  //   setShares(Array(persons.length).fill(equalShare));
  // }, [persons.length, parsedAmount]);

  useEffect(() => {
    if (persons.length === 0) {
      setShares([]);
      return;
    }

    if (!eachShares || eachShares.length === 0) {
      const equalShare = (
        parsedAmount > 0 ? parsedAmount / persons.length : ""
      ).toString();

      setShares(Array(persons.length).fill(equalShare));
    } else {
      setShares(eachShares.map((share) => share.amount));
    }
  }, [eachShares, persons.length, parsedAmount]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.header}
        onPress={toggleExpand}
      >
        <Text style={styles.headerTitle}>Each Share</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={GLOBAL_STYLES.colors.textDark}
        />
      </TouchableOpacity>

      {/* Each person's share */}
      {isExpanded && (
        <View style={styles.content}>
          {persons.map((person, index) => (
            <View key={person.id} style={styles.personRow}>
              <Text style={styles.personName}>{person.name}</Text>
              <TextInput
                style={styles.input}
                value={shares[index] ?? ""}
                onChangeText={(value) => handleShareChange(index, value)}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>
              Total: {totalShares.toLocaleString()} {currency}
            </Text>
            {parsedAmount > 0 && (
              <>
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
  headerTitle: {
    fontSize: 18,
    color: GLOBAL_STYLES.colors.black,
  },
  content: {
    paddingTop: 16,
    gap: 16,
  },
  personRow: {
    gap: 8,
  },
  personName: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.black,
  },
  input: {
    backgroundColor: GLOBAL_STYLES.colors.disableBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textPrimary,
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
});
