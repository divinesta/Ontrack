import { useMemo } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export type DeviceSizeClass = "compact" | "regular" | "tall";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function roundToPixel(value: number) {
  return PixelRatio.roundToNearestPixel(value);
}

export function createResponsiveScale(width: number, height: number) {
  const horizontalRatio = width / BASE_WIDTH;
  const verticalRatio = height / BASE_HEIGHT;

  const scale = (size: number) => roundToPixel(size * horizontalRatio);
  const verticalScale = (size: number) => roundToPixel(size * verticalRatio);

  const moderateScale = (size: number, factor = 0.5) => {
    const scaled = scale(size);
    return roundToPixel(size + (scaled - size) * factor);
  };

  const moderateVerticalScale = (size: number, factor = 0.5) => {
    const scaled = verticalScale(size);
    return roundToPixel(size + (scaled - size) * factor);
  };

  return {
    moderateScale,
    moderateVerticalScale,
    scale,
    verticalScale,
  };
}

export function getDeviceSizeClass(height: number): DeviceSizeClass {
  if (height < 740) return "compact";
  if (height > 880) return "tall";
  return "regular";
}

export function useResponsiveMetrics() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const sizeClass = getDeviceSizeClass(height);
    const compact = sizeClass === "compact";
    const tall = sizeClass === "tall";
    const smallWidth = width < 380;
    const scaleTools = createResponsiveScale(width, height);

    return {
      ...scaleTools,
      buttonHeight: compact ? 44 : 48,
      compact,
      contentPaddingX: smallWidth ? 24 : 32,
      heroImageHeight: clamp(height * (compact ? 0.56 : 0.64), 340, 520),
      height,
      insets,
      sizeClass,
      smallWidth,
      tall,
      titleSize: smallWidth ? 27 : 30,
      width,
    };
  }, [height, insets, width]);
}

