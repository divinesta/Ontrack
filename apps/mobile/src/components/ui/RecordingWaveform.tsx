import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { palette as C } from "@/features/journal/colors";

type RecordingWaveformProps = {
  barCount?: number;
  height: number;
  metering?: number;
};

const BASE_BARS = [0.28, 0.56, 0.36, 0.78, 0.45, 0.64, 0.32, 0.86, 0.52, 0.7, 0.38, 0.6];

function normalizeMetering(metering?: number) {
  if (metering === undefined) return 0.35;
  return Math.max(0.15, Math.min(1, (metering + 60) / 60));
}

export function RecordingWaveform({ barCount = 28, height, metering }: RecordingWaveformProps) {
  const level = normalizeMetering(metering);
  const bars = useMemo(
    () => Array.from({ length: barCount }, (_, index) => BASE_BARS[index % BASE_BARS.length]),
    [barCount],
  );

  return (
    <View style={[styles.root, { height }]}>
      {bars.map((base, index) => {
        const variance = 0.78 + ((index % 5) * 0.08);
        const barHeight = Math.max(4, height * Math.min(1, base * level * variance + 0.12));

        return (
          <View
            key={`${index}-${base}`}
            style={[
              styles.bar,
              {
                height: barHeight,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: C.accent,
    borderRadius: 999,
    width: 3,
  },
  root: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    overflow: "hidden",
  },
});
