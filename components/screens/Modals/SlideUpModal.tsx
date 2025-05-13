import React, { useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import { Modalize } from "react-native-modalize";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: This synthetic event is reused' // ignore the exact message text
]);
export default function SlideUpModal() {
  const modalizeRef = useRef<Modalize>(null);

  // Open the sheet programmatically
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  // Optional: close it programmatically
  const onCloseSheet = () => {
    modalizeRef.current?.close();
  };

  return (
    <>
      <Button title="Open Bottom Sheet" onPress={onOpen} />

      <Modalize
        ref={modalizeRef}
        snapPoint={300}
        panGestureEnabled
        panGestureComponentEnabled
        closeOnOverlayTap={true}
        handlePosition="inside" // positions the handle inside the sheet
        withReactModal={false} // for a "true" bottom-sheet experience
        modalHeight={Dimensions.get("window").height}
        overlayStyle={{ height: Dimensions.get("window").height }}
        closeSnapPointStraightEnabled={false}
        withOverlay={false}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Hello from Modalize!</Text>
          <Text style={styles.sheetText}>
            This sheet starts at 40% of the screen height and can be dragged up
            to 80%.
          </Text>
        </View>
      </Modalize>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  sheetContent: {
    flex: 1,
    paddingTop: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  sheetText: {
    fontSize: 16,
    margin: 20,
  },
});
