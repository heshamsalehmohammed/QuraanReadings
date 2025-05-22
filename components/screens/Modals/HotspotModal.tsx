import React, { useRef, forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  LogBox,
  TextStyle,
} from "react-native";
import { Modalize } from "react-native-modalize";

import { useCombinedRefs } from "../../../hooks/use-combined-refs";

import Word00001Page001 from "../../../assets/pages/shuba/words/00001.svg";
import { FontAwesome, View } from "@/components/Themed";
import { Divider } from "@ui-kitten/components";


const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 100;

LogBox.ignoreLogs([
  "Warning: This synthetic event is reused", // ignore the exact message text
]);

export const HotspotModal = forwardRef((_, ref) => {
  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [handle, setHandle] = useState(false);

  const animated = useRef(new Animated.Value(0)).current;

  const handlePosition = (position: any) => {
    setHandle(position === "top");
  };
  const renderContent = () => (
    <>
      <View>
        <Animated.View
          style={[
            s.content__cover,
            {
              transform: [
                {
                  scale: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 3],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateX: animated.interpolate({
                    inputRange: [0, 0.25, 1],
                    outputRange: [0, 22, 42],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: animated.interpolate({
                    inputRange: [0, 0.25, 1],
                    outputRange: [0, 15, 30],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          <Word00001Page001
            style={{ flex: 1, height: "100%", width: "100%" }}
          />
        </Animated.View>
        <Animated.View
          style={[
            s.content__header,
            {
              opacity: animated.interpolate({
                inputRange: [0, 0.75],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.75} style={{ marginRight: 20 }}>
            <FontAwesome name="pause" size={24} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.75}>
            <FontAwesome name="heart" size={24} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            s.content__inner,
            {
              opacity: animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={{ width: "100%" }}>
            <Text style={s.headerText}>الحكم</Text>
            <Text style={s.contentText}>ابدال الواو همزه</Text>
          </View>

          <Divider
            style={{
              width: "80%",
              marginVertical: 10,
              backgroundColor: "#ccc",
            }}
          />
          <View style={{ width: "100%" }}>
            <Text style={s.headerText}>القراءات المتاحه</Text>
          </View>
        </Animated.View>
      </View>
    </>
  );

  return (
    <Modalize
      ref={combinedRef}
      panGestureAnimatedValue={animated}
      snapPoint={HEADER_HEIGHT}
      withHandle={handle}
      handlePosition="inside"
      handleStyle={{
        top: 13,
        width: 40,
        height: handle ? 6 : 0,
        backgroundColor: "#bcc0c1",
      }}
      onPositionChange={handlePosition}
    >
      {renderContent()}
    </Modalize>
  );
});

const s = StyleSheet.create({
  content__header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",

    height: HEADER_HEIGHT,

    paddingHorizontal: 30,
    paddingBottom: 5,
  },

  content__cover: {
    zIndex: 100,
    width: 80,
    height: 80,
    marginLeft: 20,
    marginTop: 5,
  },

  content__asset: {
    width: "100%",
    height: "100%",
  },

  content__title: {
    paddingLeft: 90,
    marginRight: "auto",

    fontSize: 18,
  },

  content__inner: {
    top: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
    textAlign: "right",
    marginRight: 50,
  },

  contentText: {
    fontSize: 18,
    color: "#444",
    textAlign: "right",
    marginRight: 50,
  },
});
