import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { SafeAreaProvider } from "react-native-safe-area-context";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { customLightTheme } from "@/constants/custom-light-theme";
import { Appearance } from "react-native";
import { customDarkTheme } from "@/constants/custom-dark-theme";
import App from "@/components/App";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { useRouter } from "expo-router";
import RouterSingleton from "@/services/routerSingleton";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const router = useRouter();
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const colorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const [theme, setTheme] = useState(
    colorScheme === "dark" ? customDarkTheme : customLightTheme
  );
  const [navigationTheme, setNavigationTheme] = useState(
    colorScheme === "dark" ? DarkTheme : DefaultTheme
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? customDarkTheme : customLightTheme);
      setNavigationTheme(colorScheme === "dark" ? DarkTheme : DefaultTheme);
    });

    // Cleanup the subscription on unmount
    return () => subscription.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  RouterSingleton.setRouter(router);

  return (
    <ApplicationProvider {...eva} theme={theme}>
      <ThemeProvider value={navigationTheme}>
        <SafeAreaProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ApplicationProvider>
  );
}
