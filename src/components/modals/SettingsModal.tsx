import { User } from "@/models/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
          {user?.photo && (
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
          )}
          {user?.name && <Text style={styles.userName}>{user.name}</Text>}
          {user?.email && <Text style={styles.userName}>{user.email}</Text>}
        </View>
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
});
