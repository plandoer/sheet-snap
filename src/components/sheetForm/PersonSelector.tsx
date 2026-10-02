import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PersonButton from "./PersonButton";

interface Props {
  persons: Person[];
  selectedPerson: Person | null;
  onPersonChange: (person: Person) => void;
  loading?: boolean;
  pending?: boolean;
  customLabel?: string;
  errorMessage?: string;
  showManagePersons?: boolean;
}

export default function PersonSelector({
  persons,
  selectedPerson,
  onPersonChange,
  loading = false,
  pending = false,
  customLabel,
  errorMessage,
  showManagePersons = true,
}: Props) {
  const router = useRouter();
  let labelText = customLabel || "Person";
  let content = null;

  function handleAddPersonPress() {
    router.push("/persons");
  }

  if (errorMessage) {
    labelText = errorMessage;
  }

  if (persons.length === 0 && loading) {
    content = (
      <View style={styles.loadingPerson}>
        <View style={[styles.personSkeleton, styles.firstPersonSkeleton]} />
        <View style={[styles.personSkeleton, styles.secondPersonSkeleton]} />
      </View>
    );
  } else if (persons.length === 0 && !pending) {
    content = (
      <View style={styles.emptyPersonCard}>
        <Text style={styles.emptyPersonText}>No persons yet</Text>
        <Text style={styles.emptyPersonHint}>
          Tap &quot;Manage persons&quot; above to add one
        </Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.personContainer}>
        {persons.map((person) => (
          <PersonButton
            key={person.id}
            person={person}
            selectedPerson={selectedPerson}
            onPersonChange={onPersonChange}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, errorMessage && styles.labelError]}>
          {labelText}
        </Text>
        {showManagePersons && (
          <TouchableOpacity onPress={handleAddPersonPress}>
            <Text style={styles.managePersonsLink}>Manage persons</Text>
          </TouchableOpacity>
        )}
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textDark,
  },
  managePersonsLink: {
    fontSize: 14,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.primary,
  },
  personContainer: {
    flexDirection: "row",
    gap: 12,
  },
  labelError: {
    color: GLOBAL_STYLES.colors.danger,
  },
  emptyPersonCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: GLOBAL_STYLES.colors.lightBorder,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 4,
  },
  loadingPerson: {
    flexDirection: "row",
    gap: 12,
  },
  personSkeleton: {
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.neutralBorder,
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
  },
  firstPersonSkeleton: {
    width: 88,
  },
  secondPersonSkeleton: {
    width: 104,
  },
  emptyPersonText: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textMuted,
  },
  emptyPersonHint: {
    fontSize: 13,
    color: GLOBAL_STYLES.colors.placeholderText,
  },
});
