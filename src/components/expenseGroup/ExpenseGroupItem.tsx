import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroupContext } from "@/context/ExpenseGroupContext";
import { useUser } from "@/context/UserContext";
import { ExpenseGroup } from "@/models/expenseGroup";
import { getInitials } from "@/utils/personUtils";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  expenseGroup: ExpenseGroup;
  onEdit: () => void;
  onClose: () => void;
}

export default function ExpenseGroupItem({
  expenseGroup,
  onClose,
  onEdit,
}: Props) {
  const { user } = useUser();
  const { updateCurrentGroup } = useExpenseGroupContext();
  const members = [expenseGroup.owner, ...expenseGroup.members];
  const visibleMembers = members.slice(0, 4);
  const additionalMembers = members.length - visibleMembers.length;
  const isOwner = user?.id === expenseGroup.owner.id;

  function handleSelectGroup() {
    updateCurrentGroup(expenseGroup);
    onClose();
  }

  function handleEditGroup() {
    onEdit();
  }

  return (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={handleSelectGroup}
      activeOpacity={0.8}
    >
      <View style={styles.groupDetails}>
        <View style={styles.groupHeading}>
          {/* Group Name */}
          <Text style={styles.groupName} numberOfLines={1}>
            {expenseGroup.name}
          </Text>

          {/* Owner Badge */}
          {isOwner && (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>Owner</Text>
            </View>
          )}
        </View>

        {/* Member Avatars */}
        <View style={styles.membersRow}>
          {visibleMembers.map((member, index) => (
            <View
              key={member.id}
              style={[styles.avatar, index > 0 && styles.avatarOverlap]}
            >
              <Text style={styles.avatarText}>
                {getInitials(member.name ?? member.email ?? "?")}
              </Text>
            </View>
          ))}
          {additionalMembers > 0 && (
            <Text style={styles.additionalMembers}>
              +{additionalMembers}{" "}
              {additionalMembers === 1 ? "Other" : "Others"}
            </Text>
          )}
        </View>
      </View>

      {/* Edit Button */}
      <Pressable
        onPress={handleEditGroup}
        hitSlop={8}
        style={({ pressed }) => [
          styles.editButton,
          pressed && styles.editButtonPressed,
        ]}
      >
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: GLOBAL_STYLES.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.divider,
    shadowColor: GLOBAL_STYLES.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  groupDetails: {
    flex: 1,
    gap: 10,
  },
  groupHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupName: {
    fontSize: 17,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.textInk,
  },
  ownerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: GLOBAL_STYLES.colors.primary,
  },
  ownerBadgeText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  membersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GLOBAL_STYLES.colors.primary,
    borderWidth: 1.5,
    borderColor: GLOBAL_STYLES.colors.white,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  additionalMembers: {
    marginLeft: 6,
    color: GLOBAL_STYLES.colors.textMedium,
    fontSize: 13,
    fontWeight: "500",
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  editButtonPressed: {
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
    opacity: 0.7,
  },
  editText: {
    color: GLOBAL_STYLES.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
