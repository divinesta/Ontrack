import { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "@/theme";

export function Card({ children }: PropsWithChildren) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          gap: spacing.sm,
          padding: spacing.md,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
  },
});
