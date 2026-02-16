import { useSheet } from "@/context/SheetContext";
import { useUser } from "@/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SheetPicker from "../SheetPicker";

export default function FormHeader() {
  const { selectedSheet } = useSheet();
  const { user } = useUser();
  const [showSheetPicker, setShowSheetPicker] = useState(false);

  return (
    <>
      <View style={styles.header}>
        {/* Sheet Picker  */}
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.sheetSelector}
            onPress={() => setShowSheetPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerTitle}>
              {selectedSheet?.spreadsheet?.name
                ? `Sync to ${selectedSheet.spreadsheet.name} - ${selectedSheet.sheet.properties.title}`
                : "Select a Google Sheet"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#666"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        </View>
        {/* User Profile */}
        <View>
          {user?.photo && (
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
          )}
        </View>
      </View>

      {/* Sheet Picker Modal */}
      <SheetPicker
        visible={showSheetPicker}
        onClose={() => setShowSheetPicker(false)}
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
  sheetSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginRight: 4,
  },
  chevronIcon: {
    marginTop: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
