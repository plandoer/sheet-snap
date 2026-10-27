import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useUser } from "@/context/UserContext";
import Profile from "./Profile";

import { useState } from "react";
import { StyleSheet, View } from "react-native";
import GroupButton from "../group/GroupButton";
import SettingsModal from "./SettingsModal";

export default function ExpenseFormHeader() {
  const { user } = useUser();
  const [showSettingModal, setShowSettingModal] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <GroupButton />
        <Profile user={user} onPress={() => setShowSettingModal(true)} />
      </View>

      <SettingsModal
        visible={showSettingModal}
        user={user}
        onClose={() => setShowSettingModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLOBAL_STYLES.colors.borderLight,
  },
});
