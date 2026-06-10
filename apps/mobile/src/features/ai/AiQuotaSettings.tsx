import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text as RNText, View } from "react-native";

import { SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

// Variation A: "Usage Gauge" — Large circular-style progress at top showing
// quota consumption, with model info and behavior settings below.

export const AiQuotaSettings = () => {
   const r = useResponsiveMetrics();
   const ms = r.moderateScale;

   const isPaid = false;
   const used = 32;
   const total = 50;
   const percentage = Math.round((used / total) * 100);

   return (
      <SettingsScreen eyebrow="AI & Quota" title="AI usage" subtitle="Model actions and monthly limits.">
         {/* Meter Card */}
         <View style={[s.meterCard, { borderRadius: ms(18), padding: ms(16) }]}>
            <View style={s.meterTop}>
               <View style={s.meterLeft}>
                  <RNText style={[s.meterValue, { fontSize: ms(36) }]}>{used}</RNText>
                  <RNText style={[s.meterOf, { fontSize: ms(13) }]}>/ {isPaid ? "∞" : total} actions</RNText>
               </View>
               <View style={[s.meterRing, { width: ms(56), height: ms(56), borderRadius: ms(28), borderWidth: ms(5) }]}>
                  <RNText style={[s.meterPercent, { fontSize: ms(13) }]}>{percentage}%</RNText>
               </View>
            </View>

            <View style={[s.meterBar, { height: ms(6), borderRadius: ms(3), marginTop: ms(14) }]}>
               <View style={[s.meterBarFill, { width: `${percentage}%`, borderRadius: ms(3) }]} />
            </View>

            <View style={[s.meterFooter, { marginTop: ms(10) }]}>
               <View style={[s.planChip, isPaid ? s.planChipPaid : s.planChipFree, { borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: ms(3) }]}>
                  <RNText style={[s.planChipText, isPaid && s.planChipTextPaid, { fontSize: ms(9) }]}>{isPaid ? "UNLIMITED" : "FREE TIER"}</RNText>
               </View>
               <RNText style={[s.meterReset, { fontSize: ms(11) }]}>Resets in 20 days</RNText>
            </View>
         </View>

         {/* What counts */}
         <View style={s.section}>
            <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>USES QUOTA</RNText>
            <View style={[s.card, { borderRadius: ms(14), padding: ms(14), gap: ms(12) }]}>
               <CountRow icon="checkbox-outline" label="Task generate / regenerate" counts ms={ms} />
               <View style={s.divider} />
               <CountRow icon="sparkles-outline" label="Reflection draft / update" counts ms={ms} />
               <View style={s.divider} />
               <CountRow icon="mic-outline" label="Voice transcribe + refine" counts ms={ms} />
               <View style={s.divider} />
               <CountRow icon="create-outline" label="Text refine" counts ms={ms} />
            </View>
         </View>

         {/* Always free */}
         <View style={s.section}>
            <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>ALWAYS FREE</RNText>
            <View style={[s.card, { borderRadius: ms(14), padding: ms(14), gap: ms(12) }]}>
               <CountRow icon="pricetag-outline" label="Auto-categorization" counts={false} ms={ms} />
               <View style={s.divider} />
               <CountRow icon="analytics-outline" label="Tracker extraction" counts={false} ms={ms} />
            </View>
         </View>

         {/* When quota runs out */}
         <View style={[s.card, { borderRadius: ms(14), padding: ms(14), flexDirection: "row", gap: ms(10) }]}>
            <Ionicons name="information-circle-outline" size={ms(16)} color={C.muted} />
            <RNText style={[s.hint, { fontSize: ms(11), flex: 1 }]}>When free quota is exhausted, core logging still works. AI features pause until the next billing cycle or upgrade.</RNText>
         </View>
      </SettingsScreen>
   );
};

const CountRow = ({ icon, label, detail, counts, ms }: { icon: keyof typeof Ionicons.glyphMap; label: string; detail?: string; counts: boolean; ms: (size: number) => number }) => (
   <View style={s.countRow}>
      <Ionicons name={icon} size={ms(15)} color={counts ? C.accent : C.muted} />
      <View style={s.countContent}>
         <RNText style={[s.countLabel, !counts && s.countLabelMuted, { fontSize: ms(12) }]}>{label}</RNText>
         {detail && <RNText style={[s.countDetail, { fontSize: ms(11) }]}>{detail}</RNText>}
      </View>
      <RNText style={[s.countBadge, !counts && s.countBadgeMuted, { fontSize: ms(10) }]}>{counts ? "1 action" : "Free"}</RNText>
   </View>
);

const s = StyleSheet.create({
   meterCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
   meterTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
   meterLeft: { gap: 0 },
   meterValue: { color: C.text, fontWeight: "900" },
   meterOf: { color: C.muted, fontWeight: "700" },
   meterRing: { borderColor: C.accent, alignItems: "center", justifyContent: "center" },
   meterPercent: { color: C.text, fontWeight: "900" },
   meterBar: { backgroundColor: C.darkSoft, overflow: "hidden" },
   meterBarFill: { height: "100%", backgroundColor: C.accent },
   meterFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
   planChip: {},
   planChipFree: { backgroundColor: C.darkSoft },
   planChipPaid: { backgroundColor: C.accentSoft },
   planChipText: { color: C.muted, fontWeight: "800", letterSpacing: 0.5 },
   planChipTextPaid: { color: C.dark },
   meterReset: { color: C.muted, fontWeight: "600" },

   section: { gap: 10 },
   sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
   card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

   countRow: { flexDirection: "row", alignItems: "center", gap: 10 },
   countContent: { flex: 1, gap: 2 },
   countLabel: { color: C.text, fontWeight: "700", fontSize: 12 },
   countLabelMuted: { color: C.muted },
   countDetail: { color: C.muted, fontWeight: "600" },
   countBadge: { color: C.dark, fontWeight: "800" },
   countBadgeMuted: { color: C.muted, fontWeight: "700" },
   divider: { height: 1, backgroundColor: C.border },

   hint: { color: C.muted, fontWeight: "600" },
});
