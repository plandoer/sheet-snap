import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import { formatRelativeTime } from "@/utils/dateUtils";
import { getInitials } from "@/utils/personUtils";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PersonItem({ person }: { person: Person }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {}}
      android_ripple={{
        color: GLOBAL_STYLES.colors.neutralBackground,
        borderless: false,
        foreground: true,
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(person.name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.date}>
          Added {formatRelativeTime(person.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderRadius: 12,
    overflow: "hidden",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textPrimary,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textPrimary,
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textSecondary,
  },
});
