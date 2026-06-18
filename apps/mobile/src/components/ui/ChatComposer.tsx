import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AutoGrowingTextInput } from "./AutoGrowingTextInput";
import { RecordingWaveform } from "./RecordingWaveform";
import { useVoiceRecorder, VoiceRecordingResult } from "./useVoiceRecorder";
import { useResponsiveMetrics } from "@/theme";
import { palette as C } from "@/features/journal/colors";

type ChatComposerProps = {
  placeholder?: string;
  onSend: (text: string) => void;
  onSendAudio?: (audio: VoiceRecordingResult) => void;
  maxLength?: number;
};

function formatDuration(durationMillis: number) {
  const totalSeconds = Math.max(0, Math.floor(durationMillis / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const ChatComposer = forwardRef<TextInput, ChatComposerProps>(
  ({ placeholder = "Drop a thought here...", onSend, onSendAudio, maxLength = 2000 }, ref) => {
    const { moderateScale, captureComposer } = useResponsiveMetrics();
    const ms = moderateScale;
    const composerHeight = captureComposer.rowHeight;
    const composerControlHeight = captureComposer.controlHeight;
    const voiceRecorder = useVoiceRecorder();

    const [inputText, setInputText] = useState("");
    const [inputFocused, setInputFocused] = useState(false);
    const internalRef = useRef<TextInput>(null);
    const inputRef = (ref as React.RefObject<TextInput>) || internalRef;

    const hasText = inputText.trim().length > 0;
    const showPlaceholder = !inputFocused && inputText.length === 0;

    useEffect(() => {
      const subscription = Keyboard.addListener("keyboardDidHide", () => {
        inputRef.current?.blur();
        setInputFocused(false);
      });

      return () => subscription.remove();
    }, [inputRef]);

    const handleSend = useCallback(() => {
      if (!inputText.trim()) return;
      onSend(inputText.trim());
      setInputText("");
    }, [inputText, onSend]);

    const handleMicPress = useCallback(async () => {
      inputRef.current?.blur();
      await voiceRecorder.start();
    }, [inputRef, voiceRecorder]);

    const handleCancelAudio = useCallback(() => {
      void voiceRecorder.cancel();
    }, [voiceRecorder]);

    const handleSendAudio = useCallback(async () => {
      const audio = await voiceRecorder.stop();
      if (audio) {
        onSendAudio?.(audio);
      }
    }, [onSendAudio, voiceRecorder]);

    if (voiceRecorder.isRecording) {
      return (
        <View
          style={[
            styles.inputRow,
            styles.recordingRow,
            {
              borderRadius: composerHeight / 2,
              minHeight: composerHeight,
              paddingLeft: ms(8),
              paddingRight: ms(8),
              paddingVertical: ms(8),
            },
          ]}
        >
          <Pressable
            style={[styles.recordControl, styles.cancelButton, { width: composerControlHeight, height: composerControlHeight, borderRadius: composerControlHeight / 2 }]}
            onPress={handleCancelAudio}
          >
            <Ionicons name="trash-outline" size={ms(17)} color={C.muted} />
          </Pressable>
          <RNText style={[styles.recordTimer, { fontSize: ms(12), minWidth: ms(42) }]}>
            {formatDuration(voiceRecorder.durationMillis)}
          </RNText>
          <RecordingWaveform height={ms(28)} metering={voiceRecorder.metering} />
          <Pressable
            style={[styles.recordControl, styles.sendButtonActive, { width: composerControlHeight, height: composerControlHeight, borderRadius: composerControlHeight / 2 }]}
            onPress={handleSendAudio}
          >
            <Ionicons name="arrow-up" size={ms(17)} color={C.dark} />
          </Pressable>
        </View>
      );
    }

    return (
      <View>
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
              onPress={hasText ? handleSend : handleMicPress}
            >
              <Ionicons name={hasText ? "arrow-up" : "mic"} size={ms(17)} color={hasText ? C.dark : C.muted} />
            </Pressable>
          </View>
        </View>
        {voiceRecorder.error && (
          <RNText style={[styles.errorText, { fontSize: ms(11), marginTop: ms(6), paddingHorizontal: ms(16) }]}>
            {voiceRecorder.error}
          </RNText>
        )}
      </View>
    );
  },
);

ChatComposer.displayName = "ChatComposer";

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
  cancelButton: { backgroundColor: C.bg },
  errorText: { color: C.muted, fontWeight: "700" },
  recordControl: { alignItems: "center", justifyContent: "center" },
  recordTimer: { color: C.text, fontWeight: "900", textAlign: "center" },
  recordingRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  sendButton: { alignItems: "center", justifyContent: "center", backgroundColor: C.bg },
  sendButtonActive: { backgroundColor: C.accent },
});
