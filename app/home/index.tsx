import React from "react";

import { Button, View } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function TrackingTabScreen() {
  const router = useRouter();
  return (
    <View style={styles.container} level="3">
      <Button
        title="Hesham"
        style={styles.button}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    alignItems: "center", // Center the button horizontally
  },
  button: {
    position: "absolute",
    bottom: 20,
    width: "80%",
    elevation: 5, // Shadow for Android
  },
});
