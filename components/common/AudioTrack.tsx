import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { audioService } from "@/services/audio";
import { AVPlaybackStatus } from "expo-av";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

type Props = {
  audioId: string;
};

export const AudioTrack = ({ audioId }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    const onStatus = (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setProgress(status.positionMillis ?? 0);
      setDuration(status.durationMillis ?? 1);
      setPlaying(status.isPlaying ?? false);
    };

    audioService.registerStatusCallback(audioId, onStatus);

    return () => {
      audioService.unregisterStatusCallback(audioId, onStatus);
    };
  }, [audioId]);

  const handlePlayPause = async () => {
    console.log("handlePlayPause", playing);
    if (playing) {
      await audioService.pause();
    } else {
      await audioService.playAudio(audioId);
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, "0");
    const sec = (totalSec % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const progressPercent = Math.min(progress / duration, 1) * 100;

  return (
    <View style={styles.container}>
      <TapGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            handlePlayPause();
          }
        }}
      >
        <Animated.View style={styles.icon}>
          <FontAwesome
            name={playing ? "pause" : "play"}
            size={24}
            color="#000"
          />
        </Animated.View>
      </TapGestureHandler>

      <View style={styles.trackContainer}>
        <View style={styles.trackBar}>
          <View
            style={[styles.trackProgress, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.timeText}>
          {formatTime(progress)} / {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  icon: {
    marginHorizontal: 12,
  },
  trackContainer: {
    flex: 1,
    marginRight: 12,
    marginTop: 10,
  },
  trackBar: {
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 3,
    overflow: "hidden",
  },
  trackProgress: {
    height: 6,
    backgroundColor: "#007bff",
  },
  timeText: {
    marginTop: 4,
    fontSize: 12,
    color: "#555",
    textAlign: "right",
  },
});
