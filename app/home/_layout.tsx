import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { useThemeColor } from "@/components/Themed";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function HomeLayout() {
  const backgroundColor = useThemeColor("backgroundColor");
  const textColor = useThemeColor("textColor");
  const textInactiveColor = useThemeColor("textInactiveColor");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderColor: backgroundColor,
          backgroundColor: backgroundColor,
        },
        tabBarActiveTintColor: textColor,
        tabBarInactiveTintColor: textInactiveColor,
        tabBarInactiveBackgroundColor: backgroundColor,
        tabBarActiveBackgroundColor: backgroundColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tracking",
          tabBarIcon: ({ color }) => <TabBarIcon name="car" color={color} />,
        }}
      />
      <Tabs.Screen
        name="speed-chart"
        options={{
          title: "Speed Chart",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="tachometer" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
