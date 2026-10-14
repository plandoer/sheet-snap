import { User } from "@/models/user";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  user: User | null;
  onPress: () => void;
}

export default function Profile({ user, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {user?.photo && (
        <Image source={{ uri: user.photo }} style={styles.profileImage} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
