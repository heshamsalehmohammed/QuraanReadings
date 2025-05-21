import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppLogoDark from "../../../../assets/images/app-logo-dark.svg";
import AppLogoLight from "../../../../assets/images/app-logo-light.svg";
import { useColorScheme } from "@/hooks/useColorScheme";

function HomeHeaderLeftButton() {
  const theme = useColorScheme() ?? 'light';
  return (
    <View style={styles.container}>
      <Pressable onPress={() => console.log("Left button pressed")}>
        {theme === "light" ? (
          <AppLogoDark height={40} width={80} style={styles.icon} />
        ) : (
          <AppLogoLight height={40} width={80} style={styles.icon} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginLeft: 0,
  },
});

export default HomeHeaderLeftButton;
