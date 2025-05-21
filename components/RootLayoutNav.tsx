import { Stack } from "expo-router";

import ModalHeader from "@/components/common/ModalHeader";
import HomeHeader from "@/components/screens/Home/HomeHeader/HomeHeader";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <HomeHeader />,
        }}
      />
      <Stack.Screen
        name="quraan-modal"
        options={({ route }:any) => ({
          header: () => <ModalHeader title={route.params?.title ?? "Quraan"} />,
          presentation: "modal",
        })}
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
