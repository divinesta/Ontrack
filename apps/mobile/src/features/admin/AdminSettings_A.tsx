import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text as RNText, View } from "react-native";

import { SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

// Variation A: "Control Panel" — Current model config shown prominently,
// with rollback action and provider details in grouped cards.

export const AdminSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const currentModel = "Qwen 2.5";
  const provider = "OpenRouter";
  const fallbackModel = "Qwen 2.0";
  const lastChanged = "Jun 8, 2026";

  return (
    <SettingsScreen eyebrow="Admin" title="Model config" subtitle="AI provider and model routing.">
      {/* Active Config Card */}
      <View style={[s.configCard, { borderRadius: ms(18), padding: ms(20) }]}>
        <View style={s.configHeader}>
          <View style={[s.configIcon, { width: ms(42), height: ms(42), borderRadius: ms(14) }]}>
            <Ionicons name="hardware-chip" size={ms(18)} color={C.dark} />
          </View>
          <View style={s.configInfo}>
            <RNText style={[s.configLabel, { fontSize: ms(10) }]}>ACTIVE MODEL</RNText>
            <RNText style={[s.configModel, { fontSize: ms(16) }]}>{currentModel}</RNText>
          </View>
          <View style={[s.liveBadge, { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: ms(3) }]}>
            <View style={[s.liveDot, { width: ms(6), height: ms(6), borderRadius: ms(3) }]} />
            <RNText style={[s.liveText, { fontSize: ms(9) }]}>LIVE</RNText>
          </View>
        </View>

        <View style={[s.configDetails, { marginTop: ms(14), gap: ms(8) }]}>
          <View style={s.configDetailRow}>
            <RNText style={[s.configDetailLabel, { fontSize: ms(11) }]}>Provider</RNText>
            <RNText style={[s.configDetailValue, { fontSize: ms(11) }]}>{provider}</RNText>
          </View>
          <View style={s.configDetailRow}>
            <RNText style={[s.configDetailLabel, { fontSize: ms(11) }]}>Fallback</RNText>
            <RNText style={[s.configDetailValue, { fontSize: ms(11) }]}>{fallbackModel}</RNText>
          </View>
          <View style={s.configDetailRow}>
            <RNText style={[s.configDetailLabel, { fontSize: ms(11) }]}>Last changed</RNText>
            <RNText style={[s.configDetailValue, { fontSize: ms(11) }]}>{lastChanged}</RNText>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>ACTIONS</RNText>
        <View style={[s.card, { borderRadius: ms(14), overflow: "hidden" }]}>
          <Pressable style={[s.actionRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]}>
            <Ionicons name="swap-horizontal-outline" size={ms(16)} color={C.dark} />
            <View style={s.actionContent}>
              <RNText style={[s.actionTitle, { fontSize: ms(13) }]}>Change model</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Switch primary AI model</RNText>
            </View>
            <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
          </Pressable>
          <View style={s.actionDivider} />
          <Pressable style={[s.actionRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]}>
            <Ionicons name="git-branch-outline" size={ms(16)} color={C.dark} />
            <View style={s.actionContent}>
              <RNText style={[s.actionTitle, { fontSize: ms(13) }]}>Change fallback</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Set backup model for failures</RNText>
            </View>
            <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
          </Pressable>
          <View style={s.actionDivider} />
          <Pressable style={[s.actionRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]}>
            <Ionicons name="arrow-undo-outline" size={ms(16)} color={C.muted} />
            <View style={s.actionContent}>
              <RNText style={[s.actionTitle, s.actionTitleMuted, { fontSize: ms(13) }]}>Rollback to previous</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Revert to last working config</RNText>
            </View>
            <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
          </Pressable>
        </View>
      </View>

      {/* Behavior note */}
      <View style={[s.card, { borderRadius: ms(14), padding: ms(14), flexDirection: "row", gap: ms(10) }]}>
        <Ionicons name="flash-outline" size={ms(15)} color={C.muted} />
        <RNText style={[s.hint, { fontSize: ms(11), flex: 1 }]}>
          Config changes apply immediately to all AI actions. Rollback restores the previous model and provider in one tap.
        </RNText>
      </View>
    </SettingsScreen>
  );
};

const s = StyleSheet.create({
  configCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  configHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  configIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  configInfo: { flex: 1, gap: 2 },
  configLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1 },
  configModel: { color: C.text, fontWeight: "900" },
  liveBadge: { backgroundColor: C.accentSoft, flexDirection: "row", alignItems: "center", gap: 4 },
  liveDot: { backgroundColor: C.accent },
  liveText: { color: C.dark, fontWeight: "800", letterSpacing: 0.5 },

  configDetails: {},
  configDetailRow: { flexDirection: "row", justifyContent: "space-between" },
  configDetailLabel: { color: C.muted, fontWeight: "700" },
  configDetailValue: { color: C.text, fontWeight: "700" },

  section: { gap: 10 },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

  actionRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  actionContent: { flex: 1, gap: 1 },
  actionTitle: { color: C.text, fontWeight: "800" },
  actionTitleMuted: { color: C.muted },
  actionDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  hint: { color: C.muted, fontWeight: "600" },
});
