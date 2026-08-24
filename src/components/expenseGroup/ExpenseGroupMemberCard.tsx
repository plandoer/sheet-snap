import { GLOBAL_STYLES } from "@/constants/global-styles";
import { User } from "@/models/user";
import { getInitials } from "@/utils/personUtils";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  member: User;
  handleRemoveMember?: (id: string) => void;
}

export default function ExpenseGroupMemberCard({
  member,
  handleRemoveMember,
}: Props) {
  return (
    <View key={member.id} style={styles.memberCard}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(member.name || "")}</Text>
      </View>

      <View style={styles.memberInfo}>
        <View style={styles.memberNameRow}>
          {/* Name */}
          <Text style={styles.memberName}>{member.name}</Text>
        </View>
        {/* Email */}
        <Text style={styles.memberEmail}>{member.email}</Text>
      </View>
      {/* Remove Icon */}
      {handleRemoveMember && (
        <Pressable
          onPress={() => handleRemoveMember(member.id)}
          hitSlop={8}
          style={styles.removeButton}
        >
          <Ionicons
            name="remove"
            size={18}
            color={GLOBAL_STYLES.colors.white}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: GLOBAL_STYLES.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.divider,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textPrimary,
  },
  memberInfo: {
    flex: 1,
    justifyContent: "center",
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textInk,
  },
  memberEmail: {
    fontSize: 13,
    color: GLOBAL_STYLES.colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 8,
    backgroundColor: GLOBAL_STYLES.colors.secondaryButton,
    justifyContent: "center",
    alignItems: "center",
  },
});
