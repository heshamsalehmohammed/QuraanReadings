import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  RefObject,
} from "react";
import {
  Dimensions,
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  Text,
  GestureResponderEvent,
  findNodeHandle,
  UIManager,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createZoomListComponent, Zoom } from "react-native-reanimated-zoom";
import { Audio, AVPlaybackStatus } from "expo-av";

import Page001 from "../assets/pages/shoba/page-010.svg";
import Page002 from "../assets/pages/shoba/page-011.svg";
import Page003 from "../assets/pages/shoba/page-012.svg";

const { width, height: _height } = Dimensions.get("window");
const height = _height - 65;
const ZoomScrollView = createZoomListComponent(ScrollView);

const audioMap: Record<string, any> = {
  "00001": require("../assets/sounds/shoba/00001.mp3"),
};

const hotspots = [{ page: 1, audio: "00001", x: 245, y: 421, w: 35, h: 30 }];

export default function QuraanModal() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  // keep refs for each hotspot Pressable
  const hotspotRefs = useRef<any[]>([]);
  if (hotspotRefs.current.length !== hotspots.length) {
    hotspotRefs.current = hotspots.map(() => React.createRef<any>());
  }

  const playAudio = useCallback(async (audioId: string) => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const asset = audioMap[audioId];
    if (!asset) return console.error("no asset for", audioId);

    const { sound } = await Audio.Sound.createAsync(asset);
    soundRef.current = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        soundRef.current = null;
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onHotspotPress = (audio: string) => {
    playAudio(audio);
  };

  const onHotspotLongPress = (
    audio: string,
    idx: number,
    e: GestureResponderEvent
  ) => {
    setSelectedAudio(audio);

    const ref = hotspotRefs.current[idx].current;
    if (!ref || !ref.measure) return;

    // measure the actual on-screen position & size
    ref.measure((_fx:any, _fy:any, _w:any, h:any, px:any, py:any) => {
      // px, py are pageX, pageY
      setMenuPos({ x: px, y: py + h + 4 });
    });
  };
  const closeMenu = () => setSelectedAudio(null);

  return (
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
          <Zoom
            key={pageIdx}
            maximumZoomScale={3}
            onZoomBegin={closeMenu}
            onZoomEnd={closeMenu}
          >
            <View style={styles.page}>
              <Page width={width} height={height} />

              {hotspots
                .map((h, idx) => ({ ...h, idx }))
                .filter((h) => h.page === pageIdx + 1)
                .map(({ audio, x, y, w, h, idx }) => (
                  <Pressable
                    key={idx}
                    ref={hotspotRefs.current[idx]}
                    style={[
                      styles.hotspot,
                      { left: x, top: y, width: w, height: h },
                    ]}
                    onPress={() => onHotspotPress(audio)}
                    onLongPress={(e) => onHotspotLongPress(audio, idx,e)}
                  />
                ))}
            </View>
          </Zoom>
        ))}

        {selectedAudio && (
          <View style={[styles.menu, { left: menuPos.x, top: menuPos.y }]}>
            <Pressable
              onPress={() => {
                playAudio(selectedAudio);
                closeMenu();
              }}
            >
              <Text style={styles.menuItem}>🔊 Play</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                console.log("Bookmark", selectedAudio);
                closeMenu();
              }}
            >
              <Text style={styles.menuItem}>🔖 Bookmark</Text>
            </Pressable>
            <Pressable onPress={closeMenu}>
              <Text style={styles.menuItem}>❌ Close</Text>
            </Pressable>
          </View>
        )}
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
    position: "relative",
  },
  hotspot: {
    position: "absolute",
    backgroundColor: "rgba(255,255,0,0.3)",
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
