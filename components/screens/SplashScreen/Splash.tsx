// components/CustomSplash.tsx
import StatusBarColor from "@/components/common/StatusBarColor";
import { SafeAreaView } from "@/components/Themed";
import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

export default function SplashScreen({ onDone }: { onDone(): void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000); // keep splash for 2s
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
       <StatusBarColor />
      <View style={styles.container}>
        <Image
          source={require("../../../assets/images/intro.png")}
          style={styles.image}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    resizeMode: "contain",
  },
});
