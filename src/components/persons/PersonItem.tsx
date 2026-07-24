import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useDeletePerson, useUpdatePerson } from "@/hooks/usePersons";
import { Person } from "@/models/person";
import { formatRelativeTime } from "@/utils/dateUtils";
import { getErrorInfo } from "@/utils/errorUtils";
import { getInitials } from "@/utils/personUtils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import PersonSheet from "./PersonSheet";

interface Props {
  person: Person;
}

export default function PersonItem({ person }: Props) {
  const personBottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { mutateAsync: updatePersonAsync } = useUpdatePerson();
  const { mutateAsync: deletePersonAsync } = useDeletePerson();

  async function handlePersonUpdate(name: string) {
    try {
      await updatePersonAsync({ ...person, name });
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  async function handleDeletePerson() {
    try {
      await deletePersonAsync(person.id);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function openPersonDialog() {
    personBottomSheetRef.current?.present();
  }

  return (
    <>
      {/* Person Card */}
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.containerPressed,
        ]}
        onPress={openPersonDialog}
        android_ripple={{
          color: GLOBAL_STYLES.colors.surfaceMuted,
          borderless: false,
          foreground: true,
          radius: 220,
        }}
      >
        <View style={styles.avatar}>
          {/* Person Avatar */}
          <Text style={styles.avatarText}>{getInitials(person.name)}</Text>
        </View>
        <View style={styles.info}>
          {/* Person Name */}
          <Text style={styles.name}>{person.name}</Text>
          <Text style={styles.date}>
            {/* Person Created Date */}
            Added {formatRelativeTime(person.createdAt)}
          </Text>
        </View>
      </Pressable>
      {/* Person Bottom Sheet */}
      <PersonSheet
        sheetRef={personBottomSheetRef}
        person={person}
        onSave={handlePersonUpdate}
        onDelete={handleDeletePerson}
      />
    </>
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
  containerPressed: {
    opacity: 0.92,
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
