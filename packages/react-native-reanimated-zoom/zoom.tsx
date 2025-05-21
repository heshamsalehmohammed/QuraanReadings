import React, { useCallback, useContext, useMemo, useEffect } from 'react';
import type { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';
import { ZoomListContext } from './zoom-list-context';

type Props = {
  children: React.ReactNode;
  minimumZoomScale?: number;
  maximumZoomScale?: number;
  simultaneousGesture?: GestureType;
  onZoomBegin?: () => void;
  onZoomEnd?: () => void;
} & ViewProps;

export function Zoom(props: Props) {
  const {
    minimumZoomScale = 1,
    maximumZoomScale = 8,
    style: propStyle,
    onLayout,
    onZoomBegin,
    onZoomEnd,
    simultaneousGesture,
  } = props;

  const zoomListContext = useContext(ZoomListContext);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isPinching = useSharedValue(false);
  const isZoomed = useSharedValue(false);
  const viewHeight = useSharedValue(0);
  const viewWidth = useSharedValue(0);

  const prevScale = useSharedValue(0);
  const offsetScale = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const panTranslateX = useSharedValue(0);
  const panTranslateY = useSharedValue(0);

  // update context values when changed
  useEffect(() => {
    if (zoomListContext) {
      zoomListContext.scale.value = scale.value;
      zoomListContext.translationX.value = translationX.value;
      zoomListContext.translationY.value = translationY.value;
    }
  }, [scale.value, translationX.value, translationY.value]);

  const gesture = useMemo(() => {
    const resetZoomState = () => {
      'worklet';
      translationX.value = withTiming(0);
      translationY.value = withTiming(0);
      scale.value = withTiming(1);
      originX.value = 0;
      originY.value = 0;
      isPinching.value = false;
      prevScale.value = 0;
      prevTranslationX.value = 0;
      prevTranslationY.value = 0;
      panTranslateX.value = 0;
      panTranslateY.value = 0;
    };

    const pan = Gesture.Pan()
      .onStart(() => {
        if (isPinching.value || !isZoomed.value) return;

        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);

        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;
      })
      .onUpdate((e) => {
        if (isPinching.value || !isZoomed.value) {
          panTranslateX.value = e.translationX;
          panTranslateY.value = e.translationY;
        } else {
          const maxTranslateX =
            (viewWidth.value / 2) * scale.value - viewWidth.value / 2;
          const minTranslateX = -maxTranslateX;

          const maxTranslateY =
            (viewHeight.value / 2) * scale.value - viewHeight.value / 2;
          const minTranslateY = -maxTranslateY;

          const nextTranslateX =
            prevTranslationX.value + e.translationX - panTranslateX.value;
          const nextTranslateY =
            prevTranslationY.value + e.translationY - panTranslateY.value;

          translationX.value =
            nextTranslateX > maxTranslateX
              ? maxTranslateX
              : nextTranslateX < minTranslateX
              ? minTranslateX
              : nextTranslateX;

          translationY.value =
            nextTranslateY > maxTranslateY
              ? maxTranslateY
              : nextTranslateY < minTranslateY
              ? minTranslateY
              : nextTranslateY;
        }
      })
      .onEnd(() => {
        if (isPinching.value || !isZoomed.value) return;

        panTranslateX.value = 0;
        panTranslateY.value = 0;
      });

    const pinch = Gesture.Pinch()
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
        prevScale.value = scale.value;
        offsetScale.value = scale.value;
      })
      .onUpdate((e) => {
        if (e.numberOfPointers === 1 && isPinching.value) {
          prevTranslationX.value = translationX.value;
          prevTranslationY.value = translationY.value;
          isPinching.value = false;
        } else if (e.numberOfPointers === 2) {
          const newScale = prevScale.value * e.scale;

          if (newScale < minimumZoomScale || newScale > maximumZoomScale)
            return;

          scale.value = newScale;

          if (!isPinching.value) {
            isPinching.value = true;
            originX.value = e.focalX;
            originY.value = e.focalY;
            prevTranslationX.value = translationX.value;
            prevTranslationY.value = translationY.value;
            offsetScale.value = scale.value;
          }

          if (isPinching.value) {
            translationX.value =
              prevTranslationX.value +
              -1 *
                ((scale.value - offsetScale.value) *
                  (originX.value - viewWidth.value / 2));
            translationY.value =
              prevTranslationY.value +
              -1 *
                ((scale.value - offsetScale.value) *
                  (originY.value - viewHeight.value / 2));
          }
        }
      })
      .onEnd(() => {
        isPinching.value = false;
        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;

        if (scale.value < 1.1) {
          resetZoomState();
        }
      });

    const doubleTap = Gesture.Tap()
      .onStart((e) => {
        if (scale.value !== 1) {
          resetZoomState();
        } else {
          scale.value = withTiming(maximumZoomScale);
          translationX.value = withTiming(
            -1 * (maximumZoomScale * (e.x - viewWidth.value / 2))
          );
          translationY.value = withTiming(
            -1 * (maximumZoomScale * (e.y - viewHeight.value / 2))
          );
        }
      })
      .numberOfTaps(2);

    if (zoomListContext?.simultaneousPanGestureRef) {
      pan.simultaneousWithExternalGesture(
        zoomListContext.simultaneousPanGestureRef
      );
    }

    return Gesture.Race(
      doubleTap,
      simultaneousGesture
        ? Gesture.Simultaneous(pan, pinch, simultaneousGesture)
        : Gesture.Simultaneous(pan, pinch)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    maximumZoomScale,
    minimumZoomScale,
    zoomListContext,
    simultaneousGesture,
  ]);

  useDerivedValue(() => {
    if (scale.value > 1 && !isZoomed.value) {
      isZoomed.value = true;
      if (zoomListContext) runOnJS(zoomListContext.onZoomBegin)();
      if (onZoomBegin) runOnJS(onZoomBegin)();
    } else if (scale.value === 1 && isZoomed.value) {
      isZoomed.value = false;
      if (zoomListContext) runOnJS(zoomListContext.onZoomEnd)();
      if (onZoomEnd) runOnJS(onZoomEnd)();
    }
  }, [zoomListContext, onZoomBegin, onZoomEnd]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  }, []);

  const memoizedOnLayout = useCallback(
    (e: any) => {
      viewHeight.value = e.nativeEvent.layout.height;
      viewWidth.value = e.nativeEvent.layout.width;
      onLayout?.(e);
    },
    [viewHeight, viewWidth, onLayout]
  );

  const memoizedStyle = useMemo(() => [style, propStyle], [style, propStyle]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        {...props}
        onLayout={memoizedOnLayout}
        style={memoizedStyle}
      />
    </GestureDetector>
  );
}
