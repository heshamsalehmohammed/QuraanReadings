import { selectLoading } from "@/redux/slices/utilities/utilitiesSlice";
import { Spinner } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useThemeColor } from "../Themed";
import LottieView from "lottie-react-native";

const LoadingOverlay = () => {
  const backgroundColor = useThemeColor("overlayBackground");
  const loading = useSelector(selectLoading);

  if (!loading) return null;

  return (
    <View style={[styles.overlay, { backgroundColor }]}>
      <LottieView
        style={styles.spinner}
        speed={1.5}
        loop
        autoPlay
        source={require("../../assets/animation/loading.json")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure it's above everything
  },
  spinner: {
    width: 200,
    height: 200,
  },
});

export default LoadingOverlay;
