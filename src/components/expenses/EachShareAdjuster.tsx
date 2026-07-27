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
  onEachSharesChange: (eachShares: EachShare[]) => void;
}

export default function EachShareAdjuster({
  persons,
  amount,
  eachShares,
  currency,
  onEachSharesChange,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shares, setShares] = useState<EachShare[]>([]);

  const parsedAmount = parseFloat(amount) || 0;
  const totalShares = shares.reduce(
    (sum, value) => sum + (parseFloat(value.amount) || 0),
    0,
  );
  const isMatch = parsedAmount > 0 && totalShares === parsedAmount;

  function toggleExpand() {
    setIsExpanded((prev) => !prev);
  }

  function handleShareChange(personId: string, value: string) {
    const updatedShares = shares.map((share) =>
      share.person.id === personId ? { ...share, amount: value } : share,
    );
    setShares(updatedShares);
    onEachSharesChange(updatedShares);
  }

  // Initialize shares
  useEffect(() => {
    console.log("Initializing shares with persons:");

    const equalShare = (
      parsedAmount > 0 ? parsedAmount / persons.length : ""
    ).toString();

    // If eachShares already has values, use them.
    // Otherwise, initialize with equal shares
    if (eachShares.length > 0) {
      setShares((prevShares) =>
        prevShares.map((share) => ({
          ...share,
          amount: share.amount || equalShare,
        })),
      );
    } else {
      const initialShares = persons.map((person) => {
        const eachShare = new EachShare();
        eachShare.person = person;
        eachShare.amount = equalShare;
        return eachShare;
      });
      setShares(initialShares);
    }
  }, [persons, eachShares, parsedAmount]);

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
          {shares.map((share) => (
            <View key={share.person.id} style={styles.personRow}>
              {/* Person Name */}
              <Text style={styles.personName}>{share.person.name}</Text>
              {/* Person's Share Amount Input */}
              <TextInput
                style={styles.input}
                value={share.amount}
                onChangeText={(value) =>
                  handleShareChange(share.person.id, value)
                }
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
