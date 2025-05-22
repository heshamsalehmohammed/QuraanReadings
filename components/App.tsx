import useNavigationBarColor from "@/hooks/useNavigationBarColor";

import { SafeAreaView } from "@/components/Themed";
import RootLayoutNav from "./RootLayoutNav";
import LoadingOverlay from "./common/OverlayLoading";
import MessagePopup from "./common/MessagePopup";
import ToastCenter from "./common/ToastCenter";
import ConfirmationPopup from "./common/ConfirmationPopup";
import StatusBarColor from "./common/StatusBarColor";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { audioService } from "@/services/audio";

export default function App() {
  useNavigationBarColor();

    useEffect(() => {
      return () => {
        audioService.unload();
      };
    }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBarColor />
      <RootLayoutNav />
      <LoadingOverlay />
      <MessagePopup />
      <ConfirmationPopup />
      <ToastCenter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
