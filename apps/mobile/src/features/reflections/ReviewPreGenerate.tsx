import { useCallback, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, View, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useResponsiveMetrics } from "@/theme";
import { palette as C } from "@/features/journal/colors";

export const ReviewPreGenerate = () => {
  const router = useRouter();
  const { insets, moderateScale, contentPaddingX } = useResponsiveMetrics();
  const ms = moderateScale;

  const [generating, setGenerating] = useState(false);
  const generateAnim = useRef(new Animated.Value(0)).current;

  const startGenerate = useCallback(() => {
    setGenerating(true);
    generateAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(generateAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(generateAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => {
      generateAnim.stopAnimation();
      router.replace("/reflections/result" as any);
    }, 3000);
  }, [generateAnim, router]);

  if (generating) {
    return (
      <SafeAreaView style={s.root} edges={["top"]}>
        <View style={s.generatingContainer}>
          <Animated.View style={[s.genCircle, { width: ms(80), height: ms(80), borderRadius: ms(40), opacity: generateAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }]}>
            <Ionicons name="sparkles" size={ms(28)} color={C.dark} />
          </Animated.View>
          <RNText style={[s.genTitle, { fontSize: ms(16), marginTop: ms(20) }]}>Generating your review</RNText>
          <RNText style={[s.genSubtitle, { fontSize: ms(12), marginTop: ms(6) }]}>
            Analyzing your entries...
          </RNText>
          <RNText style={[s.genHint, { fontSize: ms(11), marginTop: ms(16) }]}>This may take a few seconds</RNText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: insets.bottom + ms(100) }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: contentPaddingX }}>
          <View style={[s.header, { paddingTop: ms(12) }]}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="arrow-back" size={ms(20)} color={C.text} />
            </Pressable>
            <RNText style={[s.stepTitle, { fontSize: ms(16) }]}>Generate Review</RNText>
            <View style={{ width: ms(20) }} />
          </View>

          <View style={[s.preGenCard, { borderRadius: ms(18), padding: ms(20), marginTop: ms(24) }]}>
            <RNText style={[s.preGenTitle, { fontSize: ms(15), marginBottom: ms(14) }]}>
              Your reflection will analyze:
            </RNText>

            {[
              { icon: "pulse-outline" as const, label: "Frequency", desc: "How often you showed up in each area" },
              { icon: "time-outline" as const, label: "Duration", desc: "How long you sustained effort" },
              { icon: "flash-outline" as const, label: "Intensity", desc: "How seriously you applied yourself" },
            ].map((item) => (
              <View key={item.label} style={[s.preGenItem, { marginBottom: ms(14), gap: ms(10) }]}>
                <View style={[s.preGenIcon, { width: ms(36), height: ms(36), borderRadius: ms(10) }]}>
                  <Ionicons name={item.icon} size={ms(16)} color={C.dark} />
                </View>
                <View style={{ flex: 1 }}>
                  <RNText style={[s.preGenItemTitle, { fontSize: ms(13) }]}>{item.label}</RNText>
                  <RNText style={[s.preGenItemDesc, { fontSize: ms(11) }]}>{item.desc}</RNText>
                </View>
              </View>
            ))}
          </View>

          <View style={[s.preGenContext, { borderRadius: ms(14), padding: ms(14), marginTop: ms(14) }]}>
            <Ionicons name="information-circle-outline" size={ms(14)} color={C.muted} />
            <RNText style={[s.preGenContextText, { fontSize: ms(11), flex: 1 }]}>
              This will use 1 AI action from your quota.
            </RNText>
          </View>

          <Pressable
            style={[s.generateBtn, { borderRadius: ms(16), paddingVertical: ms(16), marginTop: ms(24) }]}
            onPress={startGenerate}
          >
            <Ionicons name="sparkles" size={ms(16)} color={C.dark} />
            <RNText style={[s.generateBtnText, { fontSize: ms(14) }]}>Generate Reflection</RNText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stepTitle: { color: C.text, fontWeight: "900" },
  preGenCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  preGenTitle: { color: C.dark, fontWeight: "900" },
  preGenItem: { flexDirection: "row", alignItems: "center" },
  preGenIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  preGenItemTitle: { color: C.text, fontWeight: "800" },
  preGenItemDesc: { color: C.muted, fontWeight: "600" },
  preGenContext: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  preGenContextText: { color: C.muted, fontWeight: "600" },
  generateBtn: { backgroundColor: C.accent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  generateBtnText: { color: C.dark, fontWeight: "900" },
  generatingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  genCircle: { backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  genTitle: { color: C.text, fontWeight: "900" },
  genSubtitle: { color: C.muted, fontWeight: "600" },
  genHint: { color: C.faded, fontWeight: "700" },
});
