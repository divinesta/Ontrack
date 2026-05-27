import { PropsWithChildren } from "react";
import { Text as NativeText, StyleProp, TextStyle } from "react-native";

import { ColorToken, useTheme } from "@/theme";

type TextVariant = "title" | "headline" | "body" | "label" | "button" | "eyebrow";

type TextProps = PropsWithChildren<{
  align?: TextStyle["textAlign"];
  color?: ColorToken;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
}>;

export function Text({
  align,
  children,
  color = "text",
  style,
  variant = "body",
}: TextProps) {
  const { colors, typography } = useTheme();

  return (
    <NativeText
      style={[
        typography[variant],
        {
          color: colors[color],
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </NativeText>
  );
}
