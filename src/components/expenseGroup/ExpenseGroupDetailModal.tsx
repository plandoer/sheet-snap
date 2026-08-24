import { GLOBAL_STYLES } from "@/constants/global-styles";
import { User } from "@/models/user";
import { useState } from "react";
import {
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
import { FormInput } from "../sheetForm/FormInput";
import ExpenseGroupMemberCard from "./ExpenseGroupMemberCard";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const initialMembers: User[] = [
  { id: "1", name: "Ye Min Ko", email: "yeminko@gmail.com", photo: null },
  { id: "2", name: "Pont Pont", email: "pontpont@gmail.com", photo: null },
  { id: "3", name: "Kofi", email: "kofi@gmail.com", photo: null },
];

export default function ExpenseGroupDetailModal({ visible, onClose }: Props) {
  const [groupName, setGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<User[]>(initialMembers);

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

            {/* Owner */}
            <Text style={styles.sectionLabel}>Owner</Text>
            <ExpenseGroupMemberCard member={members[0]} />

            {/* Members List */}
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
              Members
            </Text>
            <View style={styles.membersList}>
              {members.map((member) => (
                <ExpenseGroupMemberCard
                  key={member.id}
                  member={member}
                  handleRemoveMember={handleRemoveMember}
                />
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
