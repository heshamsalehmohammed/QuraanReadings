import { StyleSheet } from "react-native";

import { Divider, Text, View } from "@/components/Themed";

export default function SettingsModal() {
  return (
    <View style={styles.container} level="3">
      <Text style={styles.title}>Settings Modal</Text>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
