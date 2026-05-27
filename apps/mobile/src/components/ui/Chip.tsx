import { Pressable, StyleSheet } from "react-native";

import { Text } from "@/components/ui/Text";
import { useTheme } from "@/theme";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: selected ? colors.primarySoft : colors.surfaceElevated,
          borderColor: selected ? colors.primary : colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
      ]}
    >
      <Text color={selected ? "text" : "textMuted"} variant="label">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
  },
});
