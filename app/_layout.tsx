// RootLayout.tsx
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
import CustomSplash from "@/components/screens/SplashScreen/Splash";

// catch any errors thrown by the Layout component
export { ErrorBoundary } from "expo-router";

// keep the native splash from auto-hiding
SplashScreen.preventAutoHideAsync()
  .then(() => SplashScreen.hideAsync())
  .catch(console.warn);;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const router = useRouter();

  // custom splash state
  const [showSplash, setShowSplash] = useState(true);

  // re-throw font load errors
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // once fonts are loaded, hide native splash
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [fontsLoaded]);

  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(
    colorScheme === "dark" ? customDarkTheme : customLightTheme
  );
  const [navigationTheme, setNavigationTheme] = useState(
    colorScheme === "dark" ? DarkTheme : DefaultTheme
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? customDarkTheme : customLightTheme);
      setNavigationTheme(colorScheme === "dark" ? DarkTheme : DefaultTheme);
    });
    return () => sub.remove();
  }, []);

  RouterSingleton.setRouter(router);

  // when both native splash is hidden and custom splash done, render app
  if (showSplash) {
    return <CustomSplash onDone={() => setShowSplash(false)} />;
  }

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
