import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text as RNText, View } from "react-native";

import { SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

// Variation A: "Status Hero" — Large connection card at top, stats row, settings below

export const CalendarSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const [connected, setConnected] = useState(true);

  const lastSync = "2 min ago";
  const importedCount = 14;

  return (
    <SettingsScreen eyebrow="Calendar" title="Google Calendar" subtitle="Read-only import into your tasks.">
      {/* Hero Status Card */}
      <View style={[s.heroCard, { borderRadius: ms(18), padding: ms(20) }]}>
        <View style={s.heroTop}>
          <View style={[s.heroIcon, { width: ms(48), height: ms(48), borderRadius: ms(16) }]}>
            <Ionicons name="calendar" size={ms(22)} color={C.dark} />
          </View>
          <View style={s.heroStatus}>
            <View style={s.heroStatusRow}>
              <View
                style={[
                  s.statusDot,
                  connected ? s.statusDotConnected : s.statusDotDisconnected,
                  { width: ms(8), height: ms(8), borderRadius: ms(4) },
                ]}
              />
              <RNText style={[s.statusLabel, { fontSize: ms(12) }]}>
                {connected ? "Connected" : "Disconnected"}
              </RNText>
            </View>
            <RNText style={[s.heroEmail, { fontSize: ms(14) }]}>
              {connected ? "divine@gmail.com" : "No account linked"}
            </RNText>
          </View>
        </View>

        {connected && (
          <View style={[s.heroStats, { marginTop: ms(16), gap: ms(12) }]}>
            <View style={s.heroStat}>
              <RNText style={[s.heroStatValue, { fontSize: ms(18) }]}>{importedCount}</RNText>
              <RNText style={[s.heroStatLabel, { fontSize: ms(10) }]}>IMPORTED</RNText>
            </View>
            <View style={[s.heroStatDivider, { height: ms(28) }]} />
            <View style={s.heroStat}>
              <RNText style={[s.heroStatValue, { fontSize: ms(18) }]}>30d</RNText>
              <RNText style={[s.heroStatLabel, { fontSize: ms(10) }]}>WINDOW</RNText>
            </View>
            <View style={[s.heroStatDivider, { height: ms(28) }]} />
            <View style={s.heroStat}>
              <RNText style={[s.heroStatValue, { fontSize: ms(14) }]}>{lastSync}</RNText>
              <RNText style={[s.heroStatLabel, { fontSize: ms(10) }]}>LAST SYNC</RNText>
            </View>
          </View>
        )}

        <Pressable
          style={[
            s.heroBtn,
            connected ? s.heroBtnDisconnect : s.heroBtnConnect,
            { borderRadius: ms(12), height: ms(44), marginTop: ms(16) },
          ]}
          onPress={() => setConnected(!connected)}
        >
          <Ionicons
            name={connected ? "close-circle-outline" : "logo-google"}
            size={ms(16)}
            color={connected ? C.muted : C.dark}
          />
          <RNText
            style={[
              s.heroBtnText,
              connected ? s.heroBtnTextDisconnect : s.heroBtnTextConnect,
              { fontSize: ms(13) },
            ]}
          >
            {connected ? "Disconnect" : "Connect Google Calendar"}
          </RNText>
        </Pressable>
      </View>

      {/* Sync Section */}
      {connected && (
        <>
          <View style={s.section}>
            <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>SYNC</RNText>
            <View style={[s.card, { borderRadius: ms(14), padding: ms(14) }]}>
              <View style={s.syncRow}>
                <Ionicons name="refresh-outline" size={ms(16)} color={C.muted} />
                <View style={s.syncContent}>
                  <RNText style={[s.syncText, { fontSize: ms(12) }]}>Syncs on app open</RNText>
                  <RNText style={[s.hint, { fontSize: ms(11) }]}>Rolling 30-day window from today</RNText>
                </View>
                <Pressable style={[s.refreshBtn, { borderRadius: ms(10), paddingHorizontal: ms(10), paddingVertical: ms(6) }]}>
                  <Ionicons name="sync" size={ms(13)} color={C.dark} />
                  <RNText style={[s.refreshText, { fontSize: ms(11) }]}>Refresh</RNText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Import Behavior */}
          <View style={s.section}>
            <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>IMPORT BEHAVIOR</RNText>
            <View style={[s.card, { borderRadius: ms(14), padding: ms(14), gap: ms(14) }]}>
              <View style={s.behaviorRow}>
                <View style={[s.behaviorIcon, { width: ms(34), height: ms(34), borderRadius: ms(10) }]}>
                  <Ionicons name="sunny-outline" size={ms(15)} color={C.dark} />
                </View>
                <View style={s.behaviorContent}>
                  <RNText style={[s.behaviorTitle, { fontSize: ms(13) }]}>All-day events</RNText>
                  <RNText style={[s.hint, { fontSize: ms(11) }]}>Appear as day-level tasks</RNText>
                </View>
              </View>
              <View style={[s.divider]} />
              <View style={s.behaviorRow}>
                <View style={[s.behaviorIcon, { width: ms(34), height: ms(34), borderRadius: ms(10) }]}>
                  <Ionicons name="time-outline" size={ms(15)} color={C.dark} />
                </View>
                <View style={s.behaviorContent}>
                  <RNText style={[s.behaviorTitle, { fontSize: ms(13) }]}>Timed events</RNText>
                  <RNText style={[s.hint, { fontSize: ms(11) }]}>Keep time metadata for display</RNText>
                </View>
              </View>
              <View style={[s.divider]} />
              <View style={s.behaviorRow}>
                <View style={[s.behaviorIcon, { width: ms(34), height: ms(34), borderRadius: ms(10) }]}>
                  <Ionicons name="repeat-outline" size={ms(15)} color={C.dark} />
                </View>
                <View style={s.behaviorContent}>
                  <RNText style={[s.behaviorTitle, { fontSize: ms(13) }]}>Recurring events</RNText>
                  <RNText style={[s.hint, { fontSize: ms(11) }]}>One task per occurrence in window</RNText>
                </View>
              </View>
            </View>
          </View>

          {/* Info footer */}
          <View style={[s.infoCard, { borderRadius: ms(14), padding: ms(14) }]}>
            <Ionicons name="information-circle-outline" size={ms(16)} color={C.muted} />
            <RNText style={[s.hint, { fontSize: ms(11), flex: 1 }]}>
              Imported events are read-only. Status changes (done/skipped) are local only.
            </RNText>
          </View>
        </>
      )}
    </SettingsScreen>
  );
};

const s = StyleSheet.create({
  heroCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  heroIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  heroStatus: { flex: 1, gap: 2 },
  heroStatusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: {},
  statusDotConnected: { backgroundColor: C.accent },
  statusDotDisconnected: { backgroundColor: C.muted },
  statusLabel: { color: C.muted, fontWeight: "700" },
  heroEmail: { color: C.text, fontWeight: "800" },
  heroStats: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  heroStat: { flex: 1, alignItems: "center", gap: 2 },
  heroStatValue: { color: C.text, fontWeight: "900" },
  heroStatLabel: { color: C.muted, fontWeight: "800", letterSpacing: 0.8 },
  heroStatDivider: { width: 1, backgroundColor: C.border },
  heroBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  heroBtnConnect: { backgroundColor: C.accent },
  heroBtnDisconnect: { backgroundColor: C.darkSoft, borderWidth: 1, borderColor: C.border },
  heroBtnText: { fontWeight: "800" },
  heroBtnTextConnect: { color: C.dark },
  heroBtnTextDisconnect: { color: C.muted },

  section: { gap: 10 },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

  syncRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  syncContent: { flex: 1, gap: 1 },
  syncText: { color: C.text, fontWeight: "700" },
  hint: { color: C.muted, fontWeight: "600" },
  refreshBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.accentSoft },
  refreshText: { color: C.dark, fontWeight: "800" },

  behaviorRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  behaviorIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  behaviorContent: { flex: 1, gap: 1 },
  behaviorTitle: { color: C.text, fontWeight: "800" },
  divider: { height: 1, backgroundColor: C.border },

  infoCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "flex-start", gap: 10 },
});
