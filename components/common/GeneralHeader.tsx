import React from "react";
import { StyleSheet, Platform } from "react-native";
import { View } from "../Themed";

function GeneralHeader({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.safeArea}>
      <View style={styles.generalHeader}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2, // Only apply shadow below
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2, // Apply shadow for Android
      },
    }),
  },
  generalHeader: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Aligns left and right buttons
    paddingHorizontal: 16,
  },
});

export default GeneralHeader;
