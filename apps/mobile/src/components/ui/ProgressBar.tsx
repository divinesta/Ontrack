import { View, StyleSheet } from "react-native";

import { useTheme } from "@/theme";

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const { colors } = useTheme();
  const clampedValue = Math.max(0, Math.min(value, 1));

  return (
    <View style={[styles.track, { backgroundColor: colors.surface }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: colors.primary,
            width: `${clampedValue * 100}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    borderRadius: 999,
    height: "100%",
  },
  track: {
    borderRadius: 999,
    height: 10,
    overflow: "hidden",
    width: "100%",
  },
});
