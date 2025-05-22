import { Audio, AVPlaybackStatus } from "expo-av";

const audioMap: Record<string, any> = {
  "00001-shuba": require("../assets/sounds/shuba/00001.mp3"),
  "00001-hafs": require("../assets/sounds/hafs/00001.mp3"),
};

type StatusCallback = (status: AVPlaybackStatus) => void;

class AudioService {
  private soundRef: Audio.Sound | null = null;
  private currentTrackId: string | null = null;

  private listeners: Record<string, Set<StatusCallback>> = {};

  private isPlaying = false;
  private positionMillis = 0;
  private durationMillis = 1;

  /**
   * Register a callback for a specific audioId
   */
  registerStatusCallback(audioId: string, cb: StatusCallback) {
    if (!this.listeners[audioId]) {
      this.listeners[audioId] = new Set();
    }
    this.listeners[audioId].add(cb);
  }

  /**
   * Unregister a specific callback for a specific audioId
   */
  unregisterStatusCallback(audioId: string, cb: StatusCallback) {
    this.listeners[audioId]?.delete(cb);
  }

  /**
   * Notify all listeners for a given track
   */
  private notifyListeners(audioId: string, status: AVPlaybackStatus) {
    this.listeners[audioId]?.forEach((cb) => cb(status));
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      positionMillis: this.positionMillis,
      durationMillis: this.durationMillis,
    };
  }

  async playAudio(id: string) {
    if (this.currentTrackId && this.currentTrackId !== id) {
      await this.unload();
    }

    const asset = audioMap[id];
    if (!asset) return;

    const { sound } = await Audio.Sound.createAsync(asset);
    this.soundRef = sound;
    this.currentTrackId = id;

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      this.isPlaying = status.isPlaying;
      this.positionMillis = status.positionMillis ?? 0;
      this.durationMillis = status.durationMillis ?? 1;

      this.notifyListeners(id, status);

      if (status.didJustFinish) {
        this.unload();
      }
    });

    await sound.playAsync();
  }

  async pause() {
    if (this.soundRef) {
      await this.soundRef.pauseAsync();
    }
  }

  async resume() {
    if (this.soundRef) {
      await this.soundRef.playAsync();
    }
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

    if (this.currentTrackId) {
      this.notifyListeners(this.currentTrackId, {
              isLoaded: true,
              isPlaying: false,
              positionMillis: 0,
              durationMillis: 1,
              didJustFinish: true,
              // safe default fields
              shouldPlay: false,
              isBuffering: false,
              rate: 1,
              volume: 1,
              isMuted: false,
              isLooping: false,
              progressUpdateIntervalMillis: 0,
              androidImplementation: "",
              uri: "",
              shouldCorrectPitch: false,
              audioPan: 0,
            });
    }

    this.currentTrackId = null;
    this.isPlaying = false;
    this.positionMillis = 0;
    this.durationMillis = 1;
  }
}

export const audioService = new AudioService();
