import { forwardRef, useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AutoGrowingTextInput } from "./AutoGrowingTextInput";
import { useResponsiveMetrics } from "@/theme";
import { palette as C } from "@/features/journal/colors";

type ChatComposerProps = {
  placeholder?: string;
  onSend: (text: string) => void;
  maxLength?: number;
};

export const ChatComposer = forwardRef<TextInput, ChatComposerProps>(
  ({ placeholder = "Drop a thought here...", onSend, maxLength = 2000 }, ref) => {
    const { moderateScale, captureComposer } = useResponsiveMetrics();
    const ms = moderateScale;
    const composerHeight = captureComposer.rowHeight;
    const composerControlHeight = captureComposer.controlHeight;

    const [inputText, setInputText] = useState("");
    const [inputFocused, setInputFocused] = useState(false);
    const internalRef = useRef<TextInput>(null);
    const inputRef = (ref as React.RefObject<TextInput>) || internalRef;

    const hasText = inputText.trim().length > 0;
    const showPlaceholder = !inputFocused && inputText.length === 0;

    const handleSend = useCallback(() => {
      if (!inputText.trim()) return;
      onSend(inputText.trim());
      setInputText("");
    }, [inputText, onSend]);

    return (
      <View
        style={[
          styles.inputRow,
          {
            borderRadius: composerHeight / 2,
            minHeight: composerHeight,
            paddingLeft: ms(16),
            paddingRight: ms(8),
            paddingVertical: ms(8),
          },
        ]}
      >
        <View style={[styles.inputContent, { minHeight: composerControlHeight, gap: ms(8) }]}>
          <View style={[styles.inputSlot, { minHeight: composerControlHeight }]}>
            {showPlaceholder && (
              <Pressable style={styles.placeholderPressable} onPress={() => inputRef.current?.focus()}>
                <RNText style={[styles.inputPlaceholder, { fontSize: ms(15), lineHeight: ms(20) }]}>
                  {placeholder}
                </RNText>
              </Pressable>
            )}
            <AutoGrowingTextInput
              ref={inputRef}
              style={[styles.input, { fontSize: ms(15), lineHeight: ms(20) }]}
              minHeight={composerControlHeight}
              maxHeightMultiplier={4}
              value={inputText}
              onBlur={() => setInputFocused(false)}
              onChangeText={setInputText}
              onFocus={() => setInputFocused(true)}
              maxLength={maxLength}
            />
          </View>
          <Pressable
            style={[
              styles.sendButton,
              { width: composerControlHeight, height: composerControlHeight, borderRadius: composerControlHeight / 2 },
              hasText && styles.sendButtonActive,
            ]}
            onPress={hasText ? handleSend : undefined}
          >
            <Ionicons name={hasText ? "arrow-up" : "mic"} size={ms(17)} color={hasText ? C.dark : C.muted} />
          </Pressable>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputRow: { borderWidth: 1, borderColor: C.borderMedium, backgroundColor: C.card, justifyContent: "center" },
  inputContent: { width: "100%", flexDirection: "row", alignItems: "flex-end" },
  inputSlot: { flex: 1, justifyContent: "center" },
  input: {
    color: C.text,
    fontWeight: "600",
    includeFontPadding: false,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    textAlignVertical: "center",
  },
  inputPlaceholder: { color: C.muted, fontWeight: "600", includeFontPadding: false },
  placeholderPressable: { ...StyleSheet.absoluteFillObject, justifyContent: "center", zIndex: 1 },
  sendButton: { alignItems: "center", justifyContent: "center", backgroundColor: C.bg },
  sendButtonActive: { backgroundColor: C.accent },
});
