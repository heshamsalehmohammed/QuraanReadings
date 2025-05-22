import { Audio, AVPlaybackStatus } from "expo-av";

const audioMap: Record<string, any> = {
  "00001-shuba": require("../assets/sounds/shuba/00001.mp3"),
  "00001-hafs": require("../assets/sounds/hafs/00001.mp3"),
};

class AudioService {
  private soundRef: Audio.Sound | null = null;

  async playAudio(id: string) {
    if (this.soundRef) {
      await this.soundRef.stopAsync();
      await this.soundRef.unloadAsync();
      this.soundRef = null;
    }
    const asset = audioMap[id];
    if (!asset) return;
    const { sound } = await Audio.Sound.createAsync(asset);
    this.soundRef = sound;
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((st: AVPlaybackStatus) => {
      if (st.isLoaded && st.didJustFinish) {
        sound.unloadAsync();
        this.soundRef = null;
      }
    });
  }

  async unload() {
    if (this.soundRef) {
      try {
        await this.soundRef.unloadAsync();
      } catch (e) {
        console.error(e);
      }
      this.soundRef = null;
    }
  }
}

export const audioService = new AudioService();
