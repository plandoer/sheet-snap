import { GLOBAL_STYLES } from "@/constants/global-styles";
import { getInitials } from "@/utils/personUtils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../IconButton";
import { FormInput } from "../sheetForm/FormInput";

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface Member {
  id: string;
  name: string;
  email: string;
  isOwner?: boolean;
}

const initialMembers: Member[] = [
  { id: "1", name: "Ye Min Ko", email: "yeminko@gmail.com", isOwner: true },
  { id: "2", name: "Pont Pont", email: "pontpont@gmail.com" },
  { id: "3", name: "Kofi", email: "kofi@gmail.com" },
];

export default function ExpenseGroupDetailModal({ visible, onClose }: Props) {
  const [groupName, setGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<Member[]>(initialMembers);

  function handleRemoveMember(id: string) {
    setMembers((current) => current.filter((member) => member.id !== id));
  }

  function handleClose() {
    // Reset the form back to its initial state on close
    setGroupName("");
    setMemberEmail("");
    setMembers(initialMembers);
    onClose();
  }

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Expense Group</Text>
            <IconButton name="close" color="black" onPress={handleClose} />
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Group Name Field */}
            <FormInput
              label="Group Name"
              placeholder="e.g. Family"
              value={groupName}
              setValue={setGroupName}
              maxLength={50}
            />

            {/* Add Members Field */}
            <FormInput
              label="Add Members (Optional)"
              placeholder="e.g. john@email.com"
              value={memberEmail}
              setValue={setMemberEmail}
              keyboardType="email-address"
            />

            {/* Members List */}
            <Text style={styles.sectionLabel}>Members</Text>
            <View style={styles.membersList}>
              {members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getInitials(member.name)}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      {member.isOwner && (
                        <View style={styles.ownerBadge}>
                          <Text style={styles.ownerBadgeText}>Owner</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </View>
                  {!member.isOwner && (
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
              ))}
            </View>
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.saveButton}
              accessibilityRole="button"
              accessibilityLabel="Save expense group"
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textDark,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textPrimary,
    marginBottom: 8,
  },
  membersList: {
    gap: 10,
  },
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
  ownerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: GLOBAL_STYLES.colors.primary,
  },
  ownerBadgeText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
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
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: GLOBAL_STYLES.colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
