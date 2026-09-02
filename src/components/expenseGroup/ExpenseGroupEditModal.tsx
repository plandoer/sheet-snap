import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroupContext } from "@/context/ExpenseGroupContext";
import {
  useRemoveExpenseGroupMember,
  useUpdateExpenseGroup,
} from "@/hooks/useExpenseGroup";
import { ExpenseGroup } from "@/models/expenseGroup";
import { User } from "@/models/user";
import { getErrorInfo } from "@/utils/errorUtils";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../IconButton";
import LoadingOverlay from "../LoadingOverlay";
import { FormInput } from "../sheetForm/FormInput";
import ExpenseGroupMemberCard from "./ExpenseGroupMemberCard";

interface Props {
  expenseGroup: ExpenseGroup;
  visible: boolean;
  onClose: () => void;
}

export default function ExpenseGroupEditModal({
  expenseGroup,
  visible,
  onClose,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const [invitationLink, setInvitationLink] = useState("");
  const [members, setMembers] = useState<User[]>([]);

  const { updateCurrentGroup } = useExpenseGroupContext();

  const { mutateAsync: updateExpenseGroupAsync, isPending: isSaving } =
    useUpdateExpenseGroup();
  const { mutateAsync: removeMemberAsync, isPending: isRemovingMember } =
    useRemoveExpenseGroupMember();

  useEffect(() => {
    if (!visible) return;

    setGroupName(expenseGroup.name);
    setInvitationLink("");
    setMembers(expenseGroup.members);
  }, [visible, expenseGroup]);

  async function handleRemoveMember(id: string) {
    try {
      await removeMemberAsync({ groupId: expenseGroup.id, userId: id });
      setMembers((current) => current.filter((member) => member.id !== id));
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  async function handleSave() {
    try {
      await updateExpenseGroupAsync({ id: expenseGroup.id, name: groupName });
      updateCurrentGroup({ ...expenseGroup, name: groupName });
      onClose();
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function handleClose() {
    // Reset the form back to its initial state on close
    setGroupName(expenseGroup.name);
    setInvitationLink("");
    setMembers(expenseGroup.members);
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
            <Text style={styles.headerTitle}>Edit Expense Group</Text>
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

            {/* Invitation Link */}
            <FormInput
              label="Invitation Link"
              placeholder="Share the invitation link to invite others"
              value={invitationLink}
              setValue={setInvitationLink}
              keyboardType="email-address"
            />

            {/* Owner */}
            <Text style={styles.sectionLabel}>Owner</Text>
            <ExpenseGroupMemberCard member={expenseGroup.owner} />

            {/* Members List */}
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
              Members
            </Text>
            {members.length === 0 ? (
              <View style={styles.emptyMembers}>
                <Ionicons
                  name="people-outline"
                  size={28}
                  color={GLOBAL_STYLES.colors.textMedium}
                />
                <Text style={styles.emptyMembersTitle}>No members yet</Text>
                <Text style={styles.emptyMembersSubtitle}>
                  Invite people to split expenses with this group.
                </Text>
              </View>
            ) : (
              <View style={styles.membersList}>
                {members.map((member) => (
                  <ExpenseGroupMemberCard
                    key={member.id}
                    member={member}
                    handleRemoveMember={handleRemoveMember}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.saveButton}
              accessibilityRole="button"
              accessibilityLabel="Save expense group"
              disabled={isSaving}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <LoadingOverlay visible={isSaving || isRemovingMember} />
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
  emptyMembers: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: GLOBAL_STYLES.colors.divider,
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
  },
  emptyMembersTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textPrimary,
    marginTop: 6,
  },
  emptyMembersSubtitle: {
    fontSize: 13,
    color: GLOBAL_STYLES.colors.textSecondary,
    textAlign: "center",
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
