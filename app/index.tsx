import React from "react";
import { Dimensions, ScrollView, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createZoomListComponent, Zoom } from "react-native-reanimated-zoom";

import Page001 from "../assets/pages/shoba/page-010.svg";
import Page002 from "../assets/pages/shoba/page-011.svg";
import Page003 from "../assets/pages/shoba/page-012.svg";

const { width, height } = Dimensions.get("window");
const ZoomScrollView = createZoomListComponent(ScrollView);

export default function QuranPage() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ZoomScrollView
        pagingEnabled // one page at a time
        minimumZoomScale={1} // no zoom out below 1x
        maximumZoomScale={3} // up to 3x
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <Zoom maximumZoomScale={3}>
          <View style={styles.page}>
            <Page001 width={width} height={height} />
          </View>
        </Zoom>
        <Zoom maximumZoomScale={3}>
          <View style={styles.page}>
            <Page002 width={width} height={height} />
          </View>
        </Zoom>
        <Zoom maximumZoomScale={3}>
          <View style={styles.page}>
            <Page003 width={width} height={height} />
          </View>
        </Zoom>
      </ZoomScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContainer: { alignItems: "center" },
  page: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
});
