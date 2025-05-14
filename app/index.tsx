import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import ImageZoom from "react-native-image-pan-zoom";

// Static imports
const pageImage = require("../assets/pages/shoba/page-001.png");
const wordData = require("../assets/pagesMappings/shoba/page-001.json");

const audioMap: Record<string, any> = {
  "001.mp3": require("../assets/sounds/shoba/001.mp3"),
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const originalWidth = 1600;
const originalHeight = 2308;

export default function QuranPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [imageHeight, setImageHeight] = useState(600);

  const playAudio = async (filename: string) => {
    try {
      const asset = audioMap[filename];
      if (!asset) {
        console.error("Audio not found in audioMap for:", filename);
        return;
      }

      console.log("Loading audio:", filename);
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(asset);
      await soundObject.playAsync();
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        if (selectedWord) setSelectedWord(null);
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            width: windowWidth,
            height: imageHeight,
            position: "relative",
          }}
        >

            <Image
              source={pageImage}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
              onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                setImageHeight(height);
              }}
            />         

          {imageHeight > 0 &&
            wordData.words.map((word: any, i: number) => {
              const scaleX = windowWidth / originalWidth;
              const scaleY = imageHeight / originalHeight;

              return (
                <Pressable
                  key={i}
                  onPress={() => playAudio(word.audio)}
                  onLongPress={(event) => {
                    const { pageX, pageY } = event.nativeEvent;
                    setSelectedWord(word);
                    setMenuPosition({ x: pageX, y: pageY });
                  }}
                  style={{
                    position: "absolute",
                    top: word.y * scaleY,
                    left: word.x * scaleX,
                    width: word.width * scaleX,
                    height: word.height * scaleY,
                    backgroundColor: "rgba(255, 0, 0, 0.2)", // Set to transparent when done
                  }}
                />
              );
            })}

          {selectedWord && (
            <View
              style={{
                position: "absolute",
                top: menuPosition.y,
                left: menuPosition.x,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 8,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                zIndex: 1000,
              }}
              onStartShouldSetResponder={() => true}
            >
              <Pressable onPress={() => playAudio(selectedWord.audio)}>
                <View style={{ paddingVertical: 5 }}>
                  <Text>🔊 Play</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => console.log("Bookmark", selectedWord.text)}
              >
                <View style={{ paddingVertical: 5 }}>
                  <Text>🔖 Bookmark</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => setSelectedWord(null)}>
                <View style={{ paddingVertical: 5 }}>
                  <Text>❌ Close</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
