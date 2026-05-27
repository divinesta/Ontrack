import { Pressable, StyleSheet } from "react-native";

import { Text } from "@/components/ui/Text";
import { useTheme } from "@/theme";

type IconButtonProps = {
  label: string;
  icon: string;
  onPress: () => void;
};

export function IconButton({ label, icon, onPress }: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          opacity: pressed ? 0.76 : 1,
        },
      ]}
    >
      <Text variant="headline">{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    width: 44,
  },
});
