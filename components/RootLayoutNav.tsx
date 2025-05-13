import { Stack } from "expo-router";

import ModalHeader from "@/components/common/ModalHeader";
import HomeHeader from "@/components/screens/Home/HomeHeader/HomeHeader";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          header: () => <HomeHeader />,
        }}
      />
      <Stack.Screen
        name="track-modal"
        options={{
          header: () => <ModalHeader title="Tracker" />,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="notifications-modal"
        options={{
          header: () => <ModalHeader title="Notifications" />,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="settings-modal"
        options={{
          header: () => <ModalHeader title="Settings" />,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
