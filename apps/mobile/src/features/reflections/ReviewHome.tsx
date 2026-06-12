import { Pressable, ScrollView, StyleSheet, View, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useResponsiveMetrics } from "@/theme";
import { palette as C } from "@/features/journal/colors";

type PastReview = {
  id: string;
  title: string;
  period: string;
  type: "weekly" | "monthly";
  date: string;
};

const PAST_REVIEWS: PastReview[] = [
  { id: "1", title: "Building momentum", period: "June 2026", type: "monthly", date: "Jun 30" },
  { id: "2", title: "Week of consistency", period: "Jun 22 – 28", type: "weekly", date: "Jun 28" },
  { id: "3", title: "Deep work sprint", period: "Jun 15 – 21", type: "weekly", date: "Jun 21" },
  { id: "4", title: "A quieter month", period: "May 2026", type: "monthly", date: "May 31" },
  { id: "5", title: "Foundations laid", period: "April 2026", type: "monthly", date: "Apr 30" },
];

export const ReviewHome = () => {
  const router = useRouter();
  const { insets, moderateScale, contentPaddingX } = useResponsiveMetrics();
  const ms = moderateScale;

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: insets.bottom + ms(100) }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: contentPaddingX }}>
          <View style={[s.header, { paddingTop: ms(12) }]}>
            <View>
              <RNText style={[s.eyebrow, { fontSize: ms(10), letterSpacing: ms(1.5) }]}>REFLECT</RNText>
              <RNText style={[s.title, { fontSize: ms(22), marginTop: ms(3) }]}>Review</RNText>
            </View>
            <Pressable
              style={[s.historyBtn, { borderRadius: ms(12), paddingHorizontal: ms(12), paddingVertical: ms(8) }]}
              onPress={() => {}}
            >
              <Ionicons name="time-outline" size={ms(14)} color={C.text} />
              <RNText style={[s.historyBtnText, { fontSize: ms(11) }]}>History</RNText>
            </Pressable>
          </View>

          <View style={[s.pastReviewsContainer, { marginTop: ms(24), height: ms(320), borderRadius: ms(20) }]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: ms(40), paddingHorizontal: ms(16), gap: ms(10) }}
            >
              {PAST_REVIEWS.map((review) => (
                <Pressable
                  key={review.id}
                  style={[s.pastReviewCard, { borderRadius: ms(14), padding: ms(16) }]}
                  onPress={() => router.push("/reflections/result" as any)}
                >
                  <View style={s.pastReviewTop}>
                    <RNText style={[s.pastReviewTitle, { fontSize: ms(14) }]}>{review.title}</RNText>
                    <View style={[s.pastReviewBadge, review.type === "weekly" ? s.badgeWeekly : s.badgeMonthly, { borderRadius: ms(7), paddingHorizontal: ms(8), paddingVertical: ms(3) }]}>
                      <RNText style={[s.pastReviewBadgeText, { fontSize: ms(9) }]}>
                        {review.type === "weekly" ? "Weekly" : "Monthly"}
                      </RNText>
                    </View>
                  </View>
                  <RNText style={[s.pastReviewPeriod, { fontSize: ms(11), marginTop: ms(4) }]}>{review.period}</RNText>
                </Pressable>
              ))}
            </ScrollView>
            <View style={s.fadeTop} pointerEvents="none">
              <View style={[s.fadeLayer, { opacity: 1 }]} />
              <View style={[s.fadeLayer, { opacity: 0.7 }]} />
              <View style={[s.fadeLayer, { opacity: 0.4 }]} />
              <View style={[s.fadeLayer, { opacity: 0.1 }]} />
            </View>
            <View style={s.fadeBottom} pointerEvents="none">
              <View style={[s.fadeLayer, { opacity: 0.1 }]} />
              <View style={[s.fadeLayer, { opacity: 0.4 }]} />
              <View style={[s.fadeLayer, { opacity: 0.7 }]} />
              <View style={[s.fadeLayer, { opacity: 1 }]} />
            </View>
          </View>

          <Pressable
            style={[s.startBtn, { borderRadius: ms(16), paddingVertical: ms(16), marginTop: ms(24) }]}
            onPress={() => router.push("/(tabs)/review/categories" as any)}
          >
            <Ionicons name="sparkles" size={ms(16)} color={C.dark} />
            <RNText style={[s.startBtnText, { fontSize: ms(14) }]}>Begin New Review</RNText>
          </Pressable>
          <RNText style={[s.nextReviewHint, { fontSize: ms(11), marginTop: ms(10) }]}>
            Next scheduled review: July 5, 2026
          </RNText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { color: C.accent, fontWeight: "900" },
  title: { color: C.text, fontWeight: "900", letterSpacing: -0.5 },
  historyBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  historyBtnText: { color: C.text, fontWeight: "700" },
  pastReviewsContainer: { overflow: "hidden", backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  fadeTop: { position: "absolute", top: 0, left: 0, right: 0, height: 48, flexDirection: "column" },
  fadeBottom: { position: "absolute", bottom: 0, left: 0, right: 0, height: 48, flexDirection: "column" },
  fadeLayer: { flex: 1, backgroundColor: C.bg },
  pastReviewCard: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  pastReviewTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pastReviewTitle: { color: C.text, fontWeight: "800", flex: 1 },
  pastReviewBadge: {},
  badgeWeekly: { backgroundColor: C.accentSoft },
  badgeMonthly: { backgroundColor: C.dark },
  pastReviewBadgeText: { fontWeight: "800", color: C.accent },
  pastReviewPeriod: { color: C.muted, fontWeight: "600" },
  startBtn: { backgroundColor: C.accent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  startBtnText: { color: C.dark, fontWeight: "900" },
  nextReviewHint: { color: C.muted, fontWeight: "600", textAlign: "center" },
});
