import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useLogin } from "@/hooks/useLogin";
import { User } from "@/models/user";
import { getErrorInfo } from "@/utils/errorUtils";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../IconButton";

interface SettingItem {
  label: string;
  icon: string;
  onPress: () => void;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  user: User | null;
}

export default function SettingsModal({ visible, onClose, user }: Props) {
  const { logout } = useLogin();

  const items: SettingItem[] = [
    {
      label: "Logout",
      icon: "logout",
      onPress: () => handleLogout(),
    },
  ];

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
      console.error("Error during sign out:", error);
    }
  }

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton name="close" color="black" onPress={onClose} />
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

        {/* Menu Items */}
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() => item.onPress()}
          >
            <View>
              <MaterialIcons
                name={item.icon as any}
                size={30}
                color={GLOBAL_STYLES.colors.textPrimary}
              />
            </View>
            <Text style={styles.settingText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
  header: {
    alignItems: "flex-end",
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
    color: GLOBAL_STYLES.colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textSecondary,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderTopColor: GLOBAL_STYLES.colors.borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: GLOBAL_STYLES.colors.borderColor,

    paddingHorizontal: 15,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
    color: GLOBAL_STYLES.colors.textPrimary,
  },
});
