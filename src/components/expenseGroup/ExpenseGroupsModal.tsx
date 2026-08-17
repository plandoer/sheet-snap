import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FAB from "../FAB";
import IconButton from "../IconButton";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const expenseGroups = [
  { name: "Personal", isOwner: true },
  { name: "Family", isOwner: false },
];

const memberInitials = ["Y", "P", "K"];

export default function ExpenseGroupsModal({ visible, onClose }: Props) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expense Groups</Text>
          <IconButton name="close" color="black" onPress={onClose} />
        </View>
        <View style={styles.list}>
          {expenseGroups.map((group) => (
            <View key={group.name} style={styles.groupCard}>
              <View style={styles.groupDetails}>
                <View style={styles.groupHeading}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  {group.isOwner && (
                    <View style={styles.ownerBadge}>
                      <Text style={styles.ownerBadgeText}>Owner</Text>
                    </View>
                  )}
                </View>
                <View style={styles.membersRow}>
                  {memberInitials.map((initial, index) => (
                    <View
                      key={`${group.name}-${initial}`}
                      style={[styles.avatar, index > 0 && styles.avatarOverlap]}
                    >
                      <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                  ))}
                  <Text style={styles.additionalMembers}>+3 Others</Text>
                </View>
              </View>
              <Pressable
                onPress={() => {}}
                hitSlop={8}
                style={styles.editButton}
              >
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <FAB onPress={() => {}} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textDark,
  },
  list: {
    gap: 10,
    marginTop: 20,
  },
  groupCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  editText: {
    color: GLOBAL_STYLES.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
