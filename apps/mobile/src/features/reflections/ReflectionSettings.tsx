import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Switch, Text as RNText, View } from "react-native";

import { BottomSheet, SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

export const ReflectionSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const [weeklyEnabled, setWeeklyEnabled] = useState(false);
  const [monthlyEnabled, setMonthlyEnabled] = useState(true);
  const [autoDraft, setAutoDraft] = useState(true);
  const [showInfoSheet, setShowInfoSheet] = useState(false);

  return (
    <SettingsScreen eyebrow="Reflections" title="Reflect & review" subtitle="Set your reflection cadence and AI behavior.">
      {/* Summary Banner */}
      <View style={[s.banner, { borderRadius: ms(18), padding: ms(18) }]}>
        <View style={s.bannerStats}>
          <View style={s.bannerStat}>
            <RNText style={[s.bannerStatValue, { fontSize: ms(22) }]}>
              {monthlyEnabled && weeklyEnabled ? "5" : monthlyEnabled ? "1" : weeklyEnabled ? "4" : "0"}
            </RNText>
            <RNText style={[s.bannerStatLabel, { fontSize: ms(9) }]}>PER MONTH</RNText>
          </View>
          <View style={[s.bannerDivider, { height: ms(32) }]} />
          <View style={s.bannerStat}>
            <RNText style={[s.bannerStatValue, { fontSize: ms(22) }]}>3</RNText>
            <RNText style={[s.bannerStatLabel, { fontSize: ms(9) }]}>STATS TRACKED</RNText>
          </View>
          <View style={[s.bannerDivider, { height: ms(32) }]} />
          <View style={s.bannerStat}>
            <RNText style={[s.bannerStatValue, { fontSize: ms(22) }]}>2</RNText>
            <RNText style={[s.bannerStatLabel, { fontSize: ms(9) }]}>VERSIONS KEPT</RNText>
          </View>
        </View>
      </View>

      {/* Cadence Settings */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>CADENCE</RNText>
        <View style={[s.card, { borderRadius: ms(14), overflow: "hidden" }]}>
          {/* Monthly */}
          <View style={[s.toggleRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]}>
            <View style={[s.toggleIcon, { width: ms(36), height: ms(36), borderRadius: ms(11) }]}>
              <Ionicons name="calendar" size={ms(16)} color={C.dark} />
            </View>
            <View style={s.toggleContent}>
              <RNText style={[s.toggleTitle, { fontSize: ms(14) }]}>Monthly</RNText>
              <RNText style={[s.toggleHint, { fontSize: ms(11) }]}>Last day of each month</RNText>
            </View>
            <Switch
              value={monthlyEnabled}
              onValueChange={setMonthlyEnabled}
              trackColor={{ false: C.darkSoft, true: C.accent }}
              thumbColor="#fff"
              style={Platform.OS === "ios" ? { transform: [{ scale: 0.8 }] } : undefined}
            />
          </View>
          <View style={s.divider} />
          {/* Weekly */}
          <View style={[s.toggleRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]}>
            <View style={[s.toggleIcon, { width: ms(36), height: ms(36), borderRadius: ms(11) }]}>
              <Ionicons name="repeat" size={ms(16)} color={C.dark} />
            </View>
            <View style={s.toggleContent}>
              <RNText style={[s.toggleTitle, { fontSize: ms(14) }]}>Weekly</RNText>
              <RNText style={[s.toggleHint, { fontSize: ms(11) }]}>Every Saturday · Sun → Sat</RNText>
            </View>
            <Switch
              value={weeklyEnabled}
              onValueChange={setWeeklyEnabled}
              trackColor={{ false: C.darkSoft, true: C.accent }}
              thumbColor="#fff"
              style={Platform.OS === "ios" ? { transform: [{ scale: 0.8 }] } : undefined}
            />
          </View>
        </View>
      </View>

      {/* AI Behavior */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>AI BEHAVIOR</RNText>
        <View style={[s.card, { borderRadius: ms(14), overflow: "hidden" }]}>
          <View style={[s.toggleRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]}>
            <View style={[s.toggleIcon, { width: ms(36), height: ms(36), borderRadius: ms(11) }]}>
              <Ionicons name="sparkles" size={ms(16)} color={C.dark} />
            </View>
            <View style={s.toggleContent}>
              <RNText style={[s.toggleTitle, { fontSize: ms(14) }]}>Auto-generate draft</RNText>
              <RNText style={[s.toggleHint, { fontSize: ms(11) }]}>AI creates reflection from your entries</RNText>
            </View>
            <Switch
              value={autoDraft}
              onValueChange={setAutoDraft}
              trackColor={{ false: C.darkSoft, true: C.accent }}
              thumbColor="#fff"
              style={Platform.OS === "ios" ? { transform: [{ scale: 0.8 }] } : undefined}
            />
          </View>
          {autoDraft && (
            <>
              <View style={s.divider} />
              <View style={[s.infoRow, { paddingHorizontal: ms(14), paddingVertical: ms(12) }]}>
                <Ionicons name="information-circle-outline" size={ms(14)} color={C.muted} />
                <RNText style={[s.infoText, { fontSize: ms(11) }]}>
                  Each generate or regenerate counts as 1 AI action toward your quota.
                </RNText>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Reflection Content */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>REFLECTION INCLUDES</RNText>
        <View style={[s.card, { borderRadius: ms(14), padding: ms(14), gap: ms(6) }]}>
          {[
            { icon: "today-outline" as const, label: "Days logged", desc: "Active logging days in period" },
            { icon: "layers-outline" as const, label: "Total entries", desc: "All finalized entries" },
            { icon: "trending-up-outline" as const, label: "Task completion", desc: "Done vs total tasks" },
          ].map((item, i) => (
            <View key={item.label}>
              {i > 0 && <View style={[s.dividerLight, { marginVertical: ms(6) }]} />}
              <View style={s.contentRow}>
                <Ionicons name={item.icon} size={ms(15)} color={C.accent} />
                <View style={s.contentInfo}>
                  <RNText style={[s.contentLabel, { fontSize: ms(13) }]}>{item.label}</RNText>
                  <RNText style={[s.contentDesc, { fontSize: ms(11) }]}>{item.desc}</RNText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>MORE</RNText>
        <View style={[s.card, { borderRadius: ms(14), overflow: "hidden" }]}>
          <Pressable style={[s.actionRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]} onPress={() => setShowInfoSheet(true)}>
            <Ionicons name="git-compare-outline" size={ms(16)} color={C.dark} />
            <View style={s.toggleContent}>
              <RNText style={[s.toggleTitle, { fontSize: ms(13) }]}>Versioning & editing</RNText>
              <RNText style={[s.toggleHint, { fontSize: ms(11) }]}>How drafts and published reflections work</RNText>
            </View>
            <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
          </Pressable>
        </View>
      </View>

      {/* Info Bottom Sheet */}
      <BottomSheet
        visible={showInfoSheet}
        title="Versioning & editing"
        onClose={() => setShowInfoSheet(false)}
        onConfirm={() => setShowInfoSheet(false)}
      >
        <View style={{ gap: 16 }}>
          <View style={s.sheetItem}>
            <Ionicons name="document-text-outline" size={18} color={C.dark} />
            <View style={s.sheetItemContent}>
              <RNText style={s.sheetItemTitle}>Two versions kept</RNText>
              <RNText style={s.sheetItemDesc}>Current draft + one previous version. Regenerating rotates current → previous.</RNText>
            </View>
          </View>
          <View style={s.sheetItem}>
            <Ionicons name="create-outline" size={18} color={C.dark} />
            <View style={s.sheetItemContent}>
              <RNText style={s.sheetItemTitle}>Always editable</RNText>
              <RNText style={s.sheetItemDesc}>Published reflections can be updated anytime — manually or with AI assistance.</RNText>
            </View>
          </View>
          <View style={s.sheetItem}>
            <Ionicons name="person-outline" size={18} color={C.dark} />
            <View style={s.sheetItemContent}>
              <RNText style={s.sheetItemTitle}>One per period</RNText>
              <RNText style={s.sheetItemDesc}>Each week/month has exactly one reflection that evolves over time.</RNText>
            </View>
          </View>
        </View>
      </BottomSheet>
    </SettingsScreen>
  );
};

const s = StyleSheet.create({
  banner: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  bannerStats: { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  bannerStat: { alignItems: "center", gap: 4 },
  bannerStatValue: { color: C.dark, fontWeight: "900" },
  bannerStatLabel: { color: C.muted, fontWeight: "800", letterSpacing: 0.8 },
  bannerDivider: { width: 1, backgroundColor: C.border },

  section: { gap: 10 },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  toggleContent: { flex: 1, gap: 1 },
  toggleTitle: { color: C.text, fontWeight: "800" },
  toggleHint: { color: C.muted, fontWeight: "600" },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  dividerLight: { height: 1, backgroundColor: C.border },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.bg },
  infoText: { color: C.muted, fontWeight: "600", flex: 1 },

  contentRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  contentInfo: { flex: 1, gap: 1 },
  contentLabel: { color: C.text, fontWeight: "700" },
  contentDesc: { color: C.muted, fontWeight: "600" },

  actionRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  sheetItem: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  sheetItemContent: { flex: 1, gap: 3 },
  sheetItemTitle: { color: C.text, fontWeight: "800", fontSize: 14 },
  sheetItemDesc: { color: C.muted, fontWeight: "600", fontSize: 12, lineHeight: 17 },
});
