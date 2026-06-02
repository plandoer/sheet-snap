import { useLogin } from "@/hooks/useLogin";
import { User } from "@/models/user";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
}

export default function SettingsModal({
  visible,
  onClose,
  user,
}: SettingsModalProps) {
  const { logout } = useLogin();

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          {/* User Photo */}
          {user?.photo && (
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
          )}
          {/* User Name */}
          {user?.name && <Text style={styles.userName}>{user.name}</Text>}
          {/* User Email */}
          {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.7}
          onPress={logout}
        >
          <View>
            <MaterialIcons name="logout" size={30} color="black" />
          </View>
          <Text style={styles.settingText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 10,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderTopColor: "#eee",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",

    paddingHorizontal: 15,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
});
