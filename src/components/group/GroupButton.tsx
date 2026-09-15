import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useGroupContext } from "@/context/GroupContext";
import { Group } from "@/models/group";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import GroupEditModal from "./GroupEditModal";
import GroupsModal from "./GroupsModal";

export default function GroupButton() {
  const { currentGroup } = useGroupContext();

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showGroupEditModal, setShowGroupEditModal] = useState(false);

  function handleEditGroup(group: Group) {
    setSelectedGroup(group);
    setShowGroupsModal(false);
    setShowGroupEditModal(true);
  }

  return (
    <>
      {/* Current Group Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={() => setShowGroupsModal(true)}
      >
        <Text style={styles.label}>{currentGroup?.name ?? "No Group"}</Text>
        <Ionicons
          name="chevron-down"
          size={28}
          color={GLOBAL_STYLES.colors.textMedium}
        />
      </TouchableOpacity>

      {/* Groups Modal */}
      <GroupsModal
        visible={showGroupsModal}
        onClose={() => setShowGroupsModal(false)}
        onEdit={handleEditGroup}
      />

      {/* Group Edit Modal */}
      {selectedGroup && (
        <GroupEditModal
          group={selectedGroup}
          visible={showGroupEditModal}
          onClose={() => setShowGroupEditModal(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  label: {
    color: GLOBAL_STYLES.colors.textStrong,
    fontSize: 18,
  },
});
