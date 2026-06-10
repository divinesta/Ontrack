import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text as RNText, View } from "react-native";

import { SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";


export const BillingSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const isPaid = false;

  return (
    <SettingsScreen eyebrow="Billing" title="Subscription" subtitle="Manage your plan.">
      {/* Status Row */}
      <View style={[s.statusCard, { borderRadius: ms(16), padding: ms(16) }]}>
        <View style={s.statusRow}>
          <View style={[s.statusIcon, { width: ms(40), height: ms(40), borderRadius: ms(13) }]}>
            <Ionicons name={isPaid ? "diamond" : "leaf"} size={ms(17)} color={C.dark} />
          </View>
          <View style={s.statusContent}>
            <RNText style={[s.statusPlan, { fontSize: ms(15) }]}>{isPaid ? "Pro Plan" : "Free Plan"}</RNText>
            <RNText style={[s.statusDetail, { fontSize: ms(11) }]}>
              {isPaid ? "$2/month • Renews Jul 10" : "20 AI actions/month"}
            </RNText>
          </View>
          <View style={[s.statusBadge, isPaid ? s.statusBadgeActive : s.statusBadgeFree, { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: ms(4) }]}>
            <RNText style={[s.statusBadgeText, isPaid && s.statusBadgeTextActive, { fontSize: ms(9) }]}>
              {isPaid ? "ACTIVE" : "FREE"}
            </RNText>
          </View>
        </View>
      </View>

      {/* Upgrade prompt (free only) */}
      {!isPaid && (
        <View style={[s.upgradeCard, { borderRadius: ms(16), padding: ms(16) }]}>
          <View style={s.upgradeTop}>
            <RNText style={[s.upgradeTitle, { fontSize: ms(14) }]}>Go Pro</RNText>
            <RNText style={[s.upgradePrice, { fontSize: ms(20) }]}>$2<RNText style={[s.upgradePeriod, { fontSize: ms(11) }]}>/mo</RNText></RNText>
          </View>
          <View style={[s.upgradeBullets, { marginTop: ms(12), gap: ms(6) }]}>
            <BulletRow label="Unlimited AI actions" ms={ms} />
            <BulletRow label="No monthly quota resets" ms={ms} />
            <BulletRow label="Cancel anytime, no lock-in" ms={ms} />
          </View>
          <Pressable style={[s.upgradeBtn, { borderRadius: ms(12), height: ms(42), marginTop: ms(14) }]}>
            <RNText style={[s.upgradeBtnText, { fontSize: ms(13) }]}>Subscribe</RNText>
          </Pressable>
        </View>
      )}

      {/* What's included */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>INCLUDED IN ALL PLANS</RNText>
        <View style={[s.card, { borderRadius: ms(14), padding: ms(14), gap: ms(8) }]}>
          <IncludedRow icon="create-outline" label="Daily logging (text & voice)" ms={ms} />
          <IncludedRow icon="list-outline" label="Task planning" ms={ms} />
          <IncludedRow icon="notifications-outline" label="Reminders" ms={ms} />
          <IncludedRow icon="sparkles-outline" label="Reflections" ms={ms} />
        </View>
      </View>

      {/* Pro only */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>PRO ONLY</RNText>
        <View style={[s.card, { borderRadius: ms(14), padding: ms(14), gap: ms(8) }]}>
          <IncludedRow icon="infinite-outline" label="Unlimited AI actions" ms={ms} />
          <IncludedRow icon="calendar-outline" label="Calendar sync" ms={ms} />
        </View>
      </View>

      {/* Manage (paid only) */}
      {isPaid && (
        <View style={s.section}>
          <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>MANAGE</RNText>
          <View style={[s.card, { borderRadius: ms(14), overflow: "hidden" }]}>
            <Pressable style={[s.manageRow, { paddingHorizontal: ms(14), paddingVertical: ms(13) }]}>
              <Ionicons name="card-outline" size={ms(15)} color={C.muted} />
              <RNText style={[s.manageLabel, { fontSize: ms(13) }]}>Payment method</RNText>
              <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
            </Pressable>
            <View style={s.manageDivider} />
            <Pressable style={[s.manageRow, { paddingHorizontal: ms(14), paddingVertical: ms(13) }]}>
              <Ionicons name="receipt-outline" size={ms(15)} color={C.muted} />
              <RNText style={[s.manageLabel, { fontSize: ms(13) }]}>Invoices</RNText>
              <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
            </Pressable>
            <View style={s.manageDivider} />
            <Pressable style={[s.manageRow, { paddingHorizontal: ms(14), paddingVertical: ms(13) }]}>
              <Ionicons name="close-circle-outline" size={ms(15)} color={C.muted} />
              <RNText style={[s.manageLabel, s.manageLabelMuted, { fontSize: ms(13) }]}>Cancel plan</RNText>
              <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
            </Pressable>
          </View>
        </View>
      )}
    </SettingsScreen>
  );
};

const BulletRow = ({ label, ms }: { label: string; ms: (size: number) => number }) => (
  <View style={s.bulletRow}>
    <Ionicons name="checkmark-circle" size={ms(14)} color={C.accent} />
    <RNText style={[s.bulletText, { fontSize: ms(12) }]}>{label}</RNText>
  </View>
);

const IncludedRow = ({ icon, label, ms }: { icon: keyof typeof Ionicons.glyphMap; label: string; ms: (size: number) => number }) => (
  <View style={s.includedRow}>
    <Ionicons name={icon} size={ms(14)} color={C.muted} />
    <RNText style={[s.includedText, { fontSize: ms(12) }]}>{label}</RNText>
  </View>
);

const s = StyleSheet.create({
  statusCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  statusContent: { flex: 1, gap: 2 },
  statusPlan: { color: C.text, fontWeight: "900" },
  statusDetail: { color: C.muted, fontWeight: "600" },
  statusBadge: {},
  statusBadgeFree: { backgroundColor: C.darkSoft },
  statusBadgeActive: { backgroundColor: C.accentSoft },
  statusBadgeText: { color: C.muted, fontWeight: "800", letterSpacing: 0.5 },
  statusBadgeTextActive: { color: C.dark },

  upgradeCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.accent },
  upgradeTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  upgradeTitle: { color: C.text, fontWeight: "900" },
  upgradePrice: { color: C.text, fontWeight: "900" },
  upgradePeriod: { color: C.muted, fontWeight: "700" },
  upgradeBullets: {},
  bulletRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bulletText: { color: C.text, fontWeight: "700" },
  upgradeBtn: { backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  upgradeBtnText: { color: C.dark, fontWeight: "900" },

  section: { gap: 10 },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

  includedRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  includedText: { color: C.text, fontWeight: "700" },

  manageRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  manageLabel: { flex: 1, color: C.text, fontWeight: "800" },
  manageLabelMuted: { color: C.muted },
  manageDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
});
