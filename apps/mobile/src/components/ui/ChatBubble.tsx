import type { ReactNode } from "react";
import { StyleProp, StyleSheet, Text as RNText, TextStyle, View, ViewStyle } from "react-native";

import { palette as C } from "@/features/journal/colors";

type ChatBubbleProps = {
  children?: ReactNode;
  maxWidth?: ViewStyle["maxWidth"];
  role?: "user" | "ai";
  style?: StyleProp<ViewStyle>;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
};

export function ChatBubble({
  children,
  maxWidth = "85%",
  role = "ai",
  style,
  text,
  textStyle,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble, { maxWidth }, style]}>
      {text ? (
        <RNText style={[styles.text, isUser && styles.userText, textStyle]}>{text}</RNText>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  aiBubble: { alignSelf: "flex-start", backgroundColor: C.card, borderColor: C.border, borderWidth: 1 },
  bubble: { borderRadius: 16, marginBottom: 10, padding: 14 },
  text: { color: C.text, fontWeight: "600" },
  userBubble: { alignSelf: "flex-end", backgroundColor: C.accentSoft, borderColor: C.accent, borderWidth: 1 },
  userText: { color: C.text },
});
