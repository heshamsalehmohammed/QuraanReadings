import { useThemeColor } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function StatusBarColor() {
  const backgroundColor = useThemeColor("sytemStatusBarColor");
  const theme = useColorScheme() ?? "light";
  return (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={theme === "dark" ? "light-content" : "dark-content"}
    />
  );
}
