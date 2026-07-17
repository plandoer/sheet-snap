import Header from "@/components/Header";
import PersonItem from "@/components/persons/PersonItem";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import { StyleSheet, View } from "react-native";

const persons: Person[] = [
  {
    id: 1,
    name: "John Doe",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: 2,
    name: "Jane Smith",
    createdAt: new Date("2023-02-15"),
  },
  {
    id: 3,
    name: "Alice Johnson",
    createdAt: new Date("2023-03-10"),
  },
];

export default function Persons() {
  return (
    <View style={styles.screen}>
      <Header title="Persons" />
      {persons.map((person) => (
        <PersonItem key={person.id} person={person} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
});
