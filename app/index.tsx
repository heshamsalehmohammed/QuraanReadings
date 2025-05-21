import React, { useRef, useEffect } from "react";
import { StyleSheet, Animated } from "react-native";
import { Button, Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";

const BUTTONS :any= [
  {
    title: "مصحف شعبه - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف شعبه - رسم عثماني" },
    disabled: false,
  },
  {
    title: "مصحف ورش - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف ورش - رسم عثماني" },
    disabled: true,
  },
  {
    title: "مصحف قالون - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف قالون - رسم عثماني" },
    disabled: true,
  },
  {
    title: "مصحف الدوري - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف الدوري - رسم عثماني" },
    disabled: true,
  },
  {
    title: "مصحف السوسي - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف السوسي - رسم عثماني" },
    disabled: true,
  },
  {
    title: "مصحف حمزة - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف حمزة - رسم عثماني" },
    disabled: true,
  },
  {
    title: "مصحف الكسائي - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف الكسائي - رسم عثماني" },
    disabled: true,
  },
  {
    title: "مصحف خلف - رسم عثماني",
    path: "/quraan-modal",
    params: { title: "مصحف خلف - رسم عثماني" },
    disabled: true,
  },
];

export default function Index() {
  const router = useRouter();
  const animValues = useRef(BUTTONS.map(() => new Animated.Value(50))).current;

  useEffect(() => {
    const animations = animValues.map((av:any) =>
      Animated.timing(av, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, []);

  return (
    <View style={styles.container} level="3">
      <Text style={styles.title}>مصاحف القراءات</Text>
      {BUTTONS.map((btn:any, i:number) => (
        <Animated.View
          key={i}
          style={{
            transform: [{ translateY: animValues[i] }],
            opacity: animValues[i].interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0.5],
            }),
            width: "80%",
            marginBottom: 10,
          }}
        >
          <Button
            title={btn.title}
            disabled={btn.disabled}
            style={styles.button}
            onPress={() => {
              router.push({ pathname: btn.path, params: btn.params });
            }}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  button: {
    elevation: 5,
  },
});
