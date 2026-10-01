import { useUser } from "@/context/UserContext";

import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Profile from "./Profile";
import SettingsModal from "./SettingsModal";
import SheetPicker from "./SheetPicker";

export default function SheetFormHeader() {
  const { user } = useUser();
  const [showSettingModal, setShowSettingModal] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SheetPicker />
        </View>
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
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
});
