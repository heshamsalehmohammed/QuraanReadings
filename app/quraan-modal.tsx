import { useCallback, useRef, useEffect, useState, useContext } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
} from "react-native";

import { Audio, AVPlaybackStatus } from "expo-av";

import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import {
  createZoomListComponent,
  Zoom,
} from "../packages/react-native-reanimated-zoom";
import { ZoomListContext } from "../packages/react-native-reanimated-zoom/zoom-list-context";

import Page001 from "../assets/pages/hafs/page-010.svg";
import Page002 from "../assets/pages/hafs/page-011.svg";
import Page003 from "../assets/pages/hafs/page-012.svg";

const { width, height: rawH } = Dimensions.get("window");
const headerH = 65;
const pageH = rawH - headerH;

const audioMap: Record<string, any> = {
  "00001": require("../assets/sounds/shoba/00001.mp3"),
};
const hotspots = [{ page: 1, audio: "00001", x: 245, y: 421, w: 35, h: 30 }];

const ZoomScrollView = createZoomListComponent(ScrollView);

export default function QuraanModal() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const modalizeRef = useRef<Modalize>(null);

  const playAudio = useCallback(async (id: string) => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const asset = audioMap[id];
    if (!asset) return;
    const { sound } = await Audio.Sound.createAsync(asset);
    soundRef.current = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((st: AVPlaybackStatus) => {
      if (st.isLoaded && st.didJustFinish) {
        sound.unloadAsync();
        soundRef.current = null;
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(console.error);
    };
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ZoomScrollView
          pagingEnabled
          minimumZoomScale={1}
          maximumZoomScale={3}
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContainer}
        >
          {[Page001, Page002, Page003].map((Page, pageIdx) => (
            <Zoom key={pageIdx} maximumZoomScale={3}>
              <View style={styles.page}>
                <Page width={width} height={pageH} />

                {hotspots
                  .map((h, idx) => ({ ...h, idx }))
                  .filter((h) => h.page === pageIdx + 1)
                  .map(({ audio, x, y, w, h, idx }) => (
                    <Hotspot
                      key={idx}
                      hotspot={{ x, y, w, h, audio }}
                      playAudio={playAudio}
                      modalizeRef={modalizeRef}
                    />
                  ))}
              </View>
            </Zoom>
          ))}
        </ZoomScrollView><HotspotModal ref={modalizeRef} />
      </GestureHandlerRootView>
      
    </>
  );
}

import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { HotspotModal } from "@/components/screens/Modals/HotspotModal";
import { Modalize } from "react-native-modalize";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

const Hotspot = ({
  hotspot,
  playAudio,
  modalizeRef,
}: {
  hotspot: {
    x: number;
    y: number;
    w: number;
    h: number;
    audio: string;
  };
  playAudio: (audio: string) => void;
  modalizeRef: React.RefObject<Modalize>;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const zoomContext = useContext(ZoomListContext);
  if (!zoomContext) throw new Error("ZoomListContext not found");

  const { scale, translationX, translationY } = zoomContext;

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: hotspot.w,
    height: hotspot.h,
    backgroundColor: "rgba(255, 106, 0, 0.3)",
    left: 0,
    top: 0,
    transform: [
      { translateX: hotspot.x * scale.value + translationX.value },
      { translateY: hotspot.y * scale.value + translationY.value },
      { scale: scale.value },
    ],
  }));

  const onTapHandler = (event:any) => {
    playAudio(hotspot.audio);
    modalizeRef.current?.open();
  };

  const onLongPressHandler = () => {
    console.log("Hotspot long pressed");
    setMenuVisible(true);
  };

  return (
    <>
      <LongPressGestureHandler
        onActivated={onLongPressHandler}
        minDurationMs={100}
      >
        <TapGestureHandler onActivated={onTapHandler}>
          <AnimatedView style={animatedStyle} />
        </TapGestureHandler>
      </LongPressGestureHandler>

      <Menu
        x={hotspot.x * scale.value + translationX.value}
        y={
          hotspot.y * scale.value +
          translationY.value +
          hotspot.h * scale.value +
          4
        }
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
      />
    </>
  );
};

const Menu = ({ x, y, menuVisible, setMenuVisible }: any) => {
  if (!menuVisible) return null;
  return (
    <View style={[styles.menu, { left: x, top: y }]}>
      <Pressable onPress={() => {}}>
        <Text style={styles.menuItem}>🔊 Play</Text>
      </Pressable>
      <Pressable onPress={() => {}}>
        <Text style={styles.menuItem}>🔖 Bookmark</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setMenuVisible(false);
        }}
      >
        <Text style={styles.menuItem}>❌ Close</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContainer: { alignItems: "center" },
  page: {
    width,
    height: pageH,
    position: "relative",
  },
  hotspot: {
    position: "absolute",
    backgroundColor: "rgba(255, 55, 0, 0.3)",
  },
  menu: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 4,
    fontSize: 16,
  },
});
