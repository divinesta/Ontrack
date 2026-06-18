import { useCallback, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, View, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardStickyView } from "react-native-keyboard-controller";

import { ChatBubble, TypingDots } from "@/components/ui";
import { ChatComposer } from "@/components/ui/ChatComposer";
import type { VoiceRecordingResult } from "@/components/ui/useVoiceRecorder";
import { useResponsiveMetrics } from "@/theme";
import { palette as C } from "@/features/journal/colors";
import { MOCK_REFLECTION } from "./mockReflection";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type NavItem = {
  name: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const NAV_ITEMS: NavItem[] = [
  { name: "today", route: "/(tabs)/today", icon: "today-outline" },
  { name: "capture", route: "/(tabs)/capture", icon: "create-outline" },
  { name: "settings", route: "/(tabs)/settings", icon: "settings-outline" },
];

export const ReviewResult = () => {
  const router = useRouter();
  const { insets, moderateScale, contentPaddingX, captureComposer } = useResponsiveMetrics();
  const ms = moderateScale;

  const [navExpanded, setNavExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const navExpandAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const navExpandedHeight = navExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [captureComposer.tabSize, captureComposer.tabSize + NAV_ITEMS.length * captureComposer.tabSize + captureComposer.floatingTabExpandedExtra],
  });

  const toggleNav = useCallback(() => {
    const toValue = navExpanded ? 0 : 1;
    setNavExpanded(!navExpanded);
    Animated.spring(navExpandAnim, { toValue, useNativeDriver: false, friction: 8, tension: 60 }).start();
  }, [navExpandAnim, navExpanded]);

  const handleNavPress = useCallback((route: string) => {
    setNavExpanded(false);
    Animated.timing(navExpandAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    router.push(route as any);
  }, [navExpandAnim, router]);

  const handleChatSend = useCallback((text: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "ai",
        text: "That's a great question. Looking at your entries, the gym drop-off after week 2 does correlate with the work intensity spike — they share the same inflection point. Your energy budget shifted toward the deadline.",
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiThinking(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleChatAudioSend = useCallback((audio: VoiceRecordingResult) => {
    const seconds = Math.max(1, Math.round(audio.durationMillis / 1000));
    const userMsg: ChatMessage = { id: `vu-${Date.now()}`, role: "user", text: `Voice question (${seconds}s)` };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `va-${Date.now()}`,
        role: "ai",
        text: "I captured your voice question. Once transcription is connected, I'll answer from the spoken prompt directly.",
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiThinking(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const toggleChat = useCallback(() => {
    setChatOpen((v) => !v);
    if (!chatOpen) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [chatOpen]);

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: ms(12), paddingHorizontal: contentPaddingX }]}>
        <Pressable onPress={() => router.push("/(tabs)/review" as any)} hitSlop={10}>
          <Ionicons name="arrow-back" size={ms(20)} color={C.text} />
        </Pressable>
        <RNText style={[s.stepTitle, { fontSize: ms(16) }]}>Your Review</RNText>
        <Pressable
          style={[s.historyBtn, { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: ms(7) }]}
          onPress={() => {}}
        >
          <Ionicons name="time-outline" size={ms(14)} color={C.text} />
          <RNText style={[s.historyBtnText, { fontSize: ms(11) }]}>History</RNText>
        </Pressable>
      </View>

      {/* Scrollable content */}
      <ScrollView
        ref={scrollRef}
        style={s.resultScroll}
        contentContainerStyle={{
          paddingHorizontal: contentPaddingX,
          paddingBottom: chatOpen
            ? captureComposer.rowHeight + captureComposer.verticalPadding * 2 + ms(24)
            : insets.bottom + ms(100),
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.periodBadge, { borderRadius: ms(10), paddingHorizontal: ms(12), paddingVertical: ms(6), marginTop: ms(16), alignSelf: "flex-start" }]}>
          <Ionicons name="calendar-outline" size={ms(12)} color={C.dark} />
          <RNText style={[s.periodBadgeText, { fontSize: ms(11) }]}>June 2026 · Monthly</RNText>
        </View>

        <View style={{ marginTop: ms(16) }}>
          {MOCK_REFLECTION.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return <RNText key={i} style={[s.mdH2, { fontSize: ms(18), marginTop: ms(20), marginBottom: ms(8) }]}>{line.replace("## ", "")}</RNText>;
            }
            if (line.startsWith("### ")) {
              return <RNText key={i} style={[s.mdH3, { fontSize: ms(15), marginTop: ms(16), marginBottom: ms(6) }]}>{line.replace("### ", "")}</RNText>;
            }
            if (line.startsWith("---")) {
              return <View key={i} style={[s.mdHr, { marginVertical: ms(16) }]} />;
            }
            if (line.trim() === "") {
              return <View key={i} style={{ height: ms(8) }} />;
            }
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <RNText key={i} style={[s.mdBody, { fontSize: ms(13), lineHeight: ms(21) }]}>
                {parts.map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <RNText key={j} style={s.mdBold}>{part.slice(2, -2)}</RNText>;
                  }
                  return part;
                })}
              </RNText>
            );
          })}
        </View>

        {/* Inline chat messages */}
        {(chatMessages.length > 0 || isAiThinking) && (
          <View style={[s.chatSection, { marginTop: ms(24), borderTopWidth: 1, borderTopColor: C.border, paddingTop: ms(16) }]}>
            {chatMessages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role}
                text={msg.text}
                style={{ borderRadius: ms(16), padding: ms(14), marginBottom: ms(10) }}
                textStyle={{ fontSize: ms(13), lineHeight: ms(20) }}
              />
            ))}
            {isAiThinking && (
              <ChatBubble role="ai" style={{ borderRadius: ms(16), padding: ms(14), marginBottom: ms(10) }}>
                <TypingDots size={ms(5)} />
              </ChatBubble>
            )}
          </View>
        )}
      </ScrollView>

      {/* Composer (shown when chatOpen) */}
      {chatOpen && (
        <KeyboardStickyView
          offset={{ closed: -ms(18), opened: -ms(18) }}
          style={[s.composerArea, { paddingBottom: captureComposer.verticalPadding + ms(8), paddingHorizontal: captureComposer.horizontalPadding, paddingTop: captureComposer.verticalPadding }]}
        >
          <ChatComposer placeholder="Ask about your review..." onSend={handleChatSend} onSendAudio={handleChatAudioSend} />
        </KeyboardStickyView>
      )}

      {/* Floating dock: collapsible nav on top, chat circle below */}
      <KeyboardStickyView
        offset={{ closed: -ms(18), opened: -ms(18) }}
        style={[
          s.bottomDock,
          {
            bottom: chatOpen ? captureComposer.rowHeight + captureComposer.verticalPadding * 2 + ms(8) : 0,
            paddingBottom: chatOpen ? ms(10) : captureComposer.bottomOffset,
            paddingHorizontal: captureComposer.horizontalPadding,
            paddingTop: captureComposer.verticalPadding,
          },
        ]}
      >
        <View style={s.bottomDockInner}>
          {/* Collapsible nav circle (on top) */}
          <Animated.View
            style={[s.navBar, { borderRadius: captureComposer.tabSize / 2, height: navExpandedHeight, width: captureComposer.tabSize, marginBottom: captureComposer.floatingTabGap }]}
          >
            {navExpanded && (
              <View style={[s.navItems, { paddingTop: captureComposer.floatingTabExpandedExtra }]}>
                {NAV_ITEMS.map((item) => (
                  <Pressable
                    key={item.name}
                    style={[s.navItem, { height: captureComposer.tabSize, width: captureComposer.tabSize }]}
                    onPress={() => handleNavPress(item.route)}
                    hitSlop={4}
                  >
                    <Ionicons name={item.icon} size={ms(20)} color="rgba(16,32,22,0.5)" />
                  </Pressable>
                ))}
              </View>
            )}
            <Pressable
              style={[s.navToggle, { height: captureComposer.tabSize, width: captureComposer.tabSize }]}
              onPress={toggleNav}
              hitSlop={8}
            >
              <Ionicons name={navExpanded ? "close" : "apps"} size={ms(18)} color={C.text} />
            </Pressable>
          </Animated.View>

          {/* Chat circle (below nav) */}
          <Pressable
            style={[
              s.chatDot,
              chatOpen && s.chatDotActive,
              {
                width: captureComposer.tabSize,
                height: captureComposer.tabSize,
                borderRadius: captureComposer.tabSize / 2,
              },
            ]}
            onPress={toggleChat}
            hitSlop={8}
          >
            <Ionicons name={chatOpen ? "close" : "chatbubble-ellipses"} size={ms(18)} color={chatOpen ? C.text : C.dark} />
          </Pressable>
        </View>
      </KeyboardStickyView>

      </SafeAreaView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  historyBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  historyBtnText: { color: C.text, fontWeight: "700" },
  stepTitle: { color: C.text, fontWeight: "900" },
  resultScroll: { flex: 1 },
  periodBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  periodBadgeText: { color: C.text, fontWeight: "700" },
  mdH2: { color: C.dark, fontWeight: "900" },
  mdH3: { color: C.text, fontWeight: "800" },
  mdBody: { color: C.text, fontWeight: "600" },
  mdBold: { fontWeight: "900", color: C.dark },
  mdHr: { height: 1, backgroundColor: C.border },

  chatSection: {},
  composerArea: { backgroundColor: "transparent", bottom: 0, left: 0, position: "absolute", right: 0 },

  bottomDock: { position: "absolute", left: 0, right: 0 },
  bottomDockInner: { alignItems: "flex-end" },
  chatDot: { alignItems: "center", justifyContent: "center", backgroundColor: C.accent, elevation: 10, shadowColor: C.dark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  chatDotActive: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

  navBar: { alignItems: "center", backgroundColor: C.card, elevation: 10, justifyContent: "flex-end", overflow: "hidden", shadowColor: C.dark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  navItems: { flex: 1, justifyContent: "flex-start" },
  navItem: { alignItems: "center", justifyContent: "center" },
  navToggle: { alignItems: "center", justifyContent: "center" },
});
