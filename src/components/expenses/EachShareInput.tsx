import { EachShare } from "@/models/eachShare";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GLOBAL_STYLES } from "../../constants/global-styles";

interface Props {
  share: EachShare;
  handleShareChange: (personId: string, value: string) => void;
}

export default function EachShareInput({ share, handleShareChange }: Props) {
  const hasValue = share.amount.length > 0;

  return (
    <View key={share.person.id} style={styles.personRow}>
      {/* Person Name */}
      <Text style={styles.personName}>{share.person.name}</Text>
      {/* Person's Share Amount Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={share.amount}
          onChangeText={(value) => handleShareChange(share.person.id, value)}
          keyboardType="numeric"
          placeholder="0"
        />
        {hasValue && (
          <TouchableOpacity
            onPress={() => handleShareChange(share.person.id, "")}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Clear amount"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={GLOBAL_STYLES.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  personRow: {
    gap: 8,
  },
  personName: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.black,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLOBAL_STYLES.colors.disableBackground,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textPrimary,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
