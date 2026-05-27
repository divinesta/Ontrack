import { Pressable, StyleSheet } from "react-native";

import { Text } from "@/components/ui/Text";
import { useTheme } from "@/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ label, onPress, variant = "primary" }: ButtonProps) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor:
            variant === "primary"
              ? colors.primary
              : variant === "secondary"
                ? colors.surfaceElevated
                : "transparent",
          borderColor: variant === "ghost" ? "transparent" : colors.border,
          opacity: pressed ? 0.76 : 1,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        },
      ]}
    >
      <Text
        align="center"
        color={variant === "primary" ? "onPrimary" : "text"}
        variant="button"
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
  },
});
