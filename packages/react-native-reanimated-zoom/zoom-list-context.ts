import { createContext } from 'react';
import type { NativeGesture } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';

export const ZoomListContext = createContext(
  null as
    | {
        onZoomBegin: () => void;
        onZoomEnd: () => void;
        simultaneousPanGestureRef: NativeGesture;
        scale: Animated.SharedValue<number>;
        translationX: Animated.SharedValue<number>;
        translationY: Animated.SharedValue<number>;
      }
    | null
);