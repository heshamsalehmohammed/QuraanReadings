import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import Page001 from "../assets/pages/shoba/page-010.svg";
import Page002 from "../assets/pages/shoba/page-011.svg";
import Page003 from "../assets/pages/shoba/page-012.svg";

const { width, height } = Dimensions.get("window");

export default function QuranPage() {
  // Zoom + pan state
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Reset zoom when scroll starts
  const resetZoom = () => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        resetZoom();
      } else if (scale.value > 3) {
        scale.value = withTiming(3);
      }
    });

  const panGesture = Gesture.Pan().onUpdate((e:any) => {
    if (scale.value > 1) {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    }
  });

  const gesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            onScrollBeginDrag={() => runOnJS(resetZoom)()}
          >
            <Animated.View style={[styles.zoomWrapper, animatedStyle]}>
              <View style={styles.page}>
                <Page001 width={width} height={height} />
              </View>
              <View style={styles.page}>
                <Page002 width={width} height={height} />
              </View>
              <View style={styles.page}>
                <Page003 width={width} height={height} />
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
  },
  zoomWrapper: {
    width: "100%",
  },
  page: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
});
