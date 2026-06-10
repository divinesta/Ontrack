import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text as RNText, View } from "react-native";

import { SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";



export const PrivacySettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  return (
    <SettingsScreen eyebrow="Privacy & Data" title="Your data" subtitle="How OnTrack handles and protects your information.">
      {/* Security Posture Card */}
      <View style={[s.postureCard, { borderRadius: ms(18), padding: ms(20) }]}>
        <View style={[s.shieldIcon, { width: ms(48), height: ms(48), borderRadius: ms(16) }]}>
          <Ionicons name="shield-checkmark" size={ms(22)} color={C.dark} />
        </View>
        <RNText style={[s.postureTitle, { fontSize: ms(15), marginTop: ms(12) }]}>Protected</RNText>
        <RNText style={[s.postureDetail, { fontSize: ms(12), marginTop: ms(4) }]}>
          Encrypted at rest and in transit
        </RNText>

        <View style={[s.postureBadges, { marginTop: ms(16), gap: ms(8) }]}>
          <View style={[s.postureBadge, { borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: ms(5) }]}>
            <Ionicons name="lock-closed" size={ms(11)} color={C.dark} />
            <RNText style={[s.postureBadgeText, { fontSize: ms(10) }]}>TLS in transit</RNText>
          </View>
          <View style={[s.postureBadge, { borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: ms(5) }]}>
            <Ionicons name="server" size={ms(11)} color={C.dark} />
            <RNText style={[s.postureBadgeText, { fontSize: ms(10) }]}>Encrypted at rest</RNText>
          </View>
        </View>
      </View>

      {/* AI & Training */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>AI & TRAINING</RNText>
        <View style={[s.card, { borderRadius: ms(14), padding: ms(14) }]}>
          <View style={s.infoRow}>
            <Ionicons name="eye-off-outline" size={ms(16)} color={C.accent} />
            <View style={s.infoContent}>
              <RNText style={[s.infoTitle, { fontSize: ms(13) }]}>Not used for training</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Your logs are never used to train AI models</RNText>
            </View>
          </View>
        </View>
      </View>

      {/* Deletion Rules */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>DELETION</RNText>
        <View style={[s.card, { borderRadius: ms(14), padding: ms(14), gap: ms(12) }]}>
          <View style={s.infoRow}>
            <Ionicons name="trash-outline" size={ms(15)} color={C.muted} />
            <View style={s.infoContent}>
              <RNText style={[s.infoTitle, { fontSize: ms(13) }]}>Permanent delete</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Deleted items are permanently removed</RNText>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.infoRow}>
            <Ionicons name="alert-circle-outline" size={ms(15)} color={C.muted} />
            <View style={s.infoContent}>
              <RNText style={[s.infoTitle, { fontSize: ms(13) }]}>Confirmation required</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Every delete action asks before proceeding</RNText>
            </View>
          </View>
        </View>
      </View>


      {/* Danger zone */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>ACCOUNT DATA</RNText>
        <Pressable style={[s.dangerCard, { borderRadius: ms(14), padding: ms(14) }]}>
          <Ionicons name="warning-outline" size={ms(16)} color="#d94a4a" />
          <View style={s.infoContent}>
            <RNText style={[s.dangerTitle, { fontSize: ms(13) }]}>Delete all my data</RNText>
            <RNText style={[s.hint, { fontSize: ms(11) }]}>Permanently erase everything and close account</RNText>
          </View>
          <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
        </Pressable>
      </View>
    </SettingsScreen>
  );
};

const s = StyleSheet.create({
  postureCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  shieldIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  postureTitle: { color: C.text, fontWeight: "900" },
  postureDetail: { color: C.muted, fontWeight: "600" },
  postureBadges: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  postureBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.accentSoft },
  postureBadgeText: { color: C.dark, fontWeight: "800" },

  section: { gap: 10 },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoContent: { flex: 1, gap: 2 },
  infoTitle: { color: C.text, fontWeight: "800" },
  infoTitleFaded: { color: C.faded },
  hint: { color: C.muted, fontWeight: "600" },
  divider: { height: 1, backgroundColor: C.border },

  dangerCard: { backgroundColor: C.card, borderWidth: 1, borderColor: "rgba(217,74,74,0.15)", flexDirection: "row", alignItems: "center", gap: 12 },
  dangerTitle: { color: "#d94a4a", fontWeight: "800" },
});
