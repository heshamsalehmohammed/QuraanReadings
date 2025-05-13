import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { useThemeColor } from "@/components/Themed";

const useNavigationBarColor = () => {
  const backgroundColor = useThemeColor("sytemNavBarColor");

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(backgroundColor); // Set the navigation bar color

    // Cleanup on unmount to reset the color to default if needed
    return () => {
      NavigationBar.setBackgroundColorAsync("#000000"); // Optional: reset to default color on unmount
    };
  }, [backgroundColor]);
};

export default useNavigationBarColor;
