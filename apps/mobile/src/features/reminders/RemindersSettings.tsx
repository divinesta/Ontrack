import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text as RNText, View } from "react-native";

import { SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

type TimeSlot = { hour: number; minute: number };

type ActivePicker = "morning" | "night" | "quietStart" | "quietEnd" | null;

const formatTime = (slot: TimeSlot): string => {
  const h = slot.hour % 12 || 12;
  const m = slot.minute.toString().padStart(2, "0");
  const period = slot.hour < 12 ? "AM" : "PM";
  return `${h}:${m} ${period}`;
};

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

// ─── Time Picker Bottom Sheet ─────────────────────────────────────────────────

const TimePickerSheet = ({
  visible,
  value,
  label,
  onConfirm,
  onDismiss,
  ms,
}: {
  visible: boolean;
  value: TimeSlot;
  label: string;
  onConfirm: (slot: TimeSlot) => void;
  onDismiss: () => void;
  ms: (size: number) => number;
}) => {
  const [selectedHour, setSelectedHour] = useState(value.hour % 12 || 12);
  const [selectedMinute, setSelectedMinute] = useState(value.minute);
  const [isPM, setIsPM] = useState(value.hour >= 12);

  const handleConfirm = () => {
    let hour24 = selectedHour % 12;
    if (isPM) hour24 += 12;
    onConfirm({ hour: hour24, minute: selectedMinute });
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onDismiss}>
      <Pressable style={ts.overlay} onPress={onDismiss}>
        <View
          style={[ts.sheet, { borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24), paddingBottom: ms(32) }]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[ts.handle, { width: ms(36), height: ms(4), borderRadius: ms(2), marginTop: ms(12) }]} />
            <RNText style={[ts.sheetTitle, { fontSize: ms(14), marginTop: ms(16), marginBottom: ms(20) }]}>{label}</RNText>

            <View style={ts.pickerRow}>
              {/* Hour */}
              <View style={ts.pickerColumn}>
                <RNText style={[ts.pickerLabel, { fontSize: ms(9) }]}>HOUR</RNText>
                <ScrollView
                  style={[ts.pickerScroll, { height: ms(150) }]}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={ts.pickerScrollContent}
                >
                  {HOURS_12.map((h) => (
                    <Pressable
                      key={h}
                      style={[ts.pickerItem, h === selectedHour && ts.pickerItemActive, { height: ms(38), borderRadius: ms(10) }]}
                      onPress={() => setSelectedHour(h)}
                    >
                      <RNText style={[ts.pickerItemText, h === selectedHour && ts.pickerItemTextActive, { fontSize: ms(16) }]}>
                        {h}
                      </RNText>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Minute */}
              <View style={ts.pickerColumn}>
                <RNText style={[ts.pickerLabel, { fontSize: ms(9) }]}>MIN</RNText>
                <ScrollView
                  style={[ts.pickerScroll, { height: ms(150) }]}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={ts.pickerScrollContent}
                >
                  {MINUTES.map((m) => (
                    <Pressable
                      key={m}
                      style={[ts.pickerItem, m === selectedMinute && ts.pickerItemActive, { height: ms(38), borderRadius: ms(10) }]}
                      onPress={() => setSelectedMinute(m)}
                    >
                      <RNText style={[ts.pickerItemText, m === selectedMinute && ts.pickerItemTextActive, { fontSize: ms(16) }]}>
                        {m.toString().padStart(2, "0")}
                      </RNText>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* AM/PM */}
              <View style={ts.pickerColumn}>
                <RNText style={[ts.pickerLabel, { fontSize: ms(9) }]}>PERIOD</RNText>
                <View style={[ts.ampmColumn, { gap: ms(6), marginTop: ms(8) }]}>
                  <Pressable
                    style={[ts.pickerItem, !isPM && ts.pickerItemActive, { height: ms(38), borderRadius: ms(10), width: ms(56) }]}
                    onPress={() => setIsPM(false)}
                  >
                    <RNText style={[ts.pickerItemText, !isPM && ts.pickerItemTextActive, { fontSize: ms(14) }]}>AM</RNText>
                  </Pressable>
                  <Pressable
                    style={[ts.pickerItem, isPM && ts.pickerItemActive, { height: ms(38), borderRadius: ms(10), width: ms(56) }]}
                    onPress={() => setIsPM(true)}
                  >
                    <RNText style={[ts.pickerItemText, isPM && ts.pickerItemTextActive, { fontSize: ms(14) }]}>PM</RNText>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Confirm */}
            <Pressable style={[ts.confirmBtn, { height: ms(46), borderRadius: ms(14), marginTop: ms(20), marginHorizontal: ms(20) }]} onPress={handleConfirm}>
              <RNText style={[ts.confirmText, { fontSize: ms(14) }]}>Set time</RNText>
            </Pressable>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

// ─── Arc Marker ───────────────────────────────────────────────────────────────

const ArcMarker = ({
  icon,
  label,
  time,
  sublabel,
  ms,
  isQuiet,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  time: string;
  sublabel: string;
  ms: (size: number) => number;
  isQuiet?: boolean;
  onPress?: () => void;
}) => {
  return (
    <View>
      <Pressable
        style={({ pressed }) => [s.arcRow, pressed && !isQuiet && s.arcRowPressed]}
        onPress={onPress}
        disabled={isQuiet}
      >
        <View style={s.arcTimeline}>
          <View style={[s.arcDot, isQuiet && s.arcDotQuiet, { width: ms(10), height: ms(10), borderRadius: ms(5) }]} />
          <View style={[s.arcLine, isQuiet && s.arcLineQuiet]} />
        </View>
        <View style={[s.arcIcon, isQuiet && s.arcIconQuiet, { width: ms(38), height: ms(38), borderRadius: ms(12) }]}>
          <Ionicons name={icon} size={ms(17)} color={isQuiet ? C.muted : C.dark} />
        </View>
        <View style={s.arcContent}>
          <RNText style={[s.arcLabel, { fontSize: ms(14) }, isQuiet && s.arcLabelQuiet]}>{label}</RNText>
          <RNText style={[s.arcSublabel, { fontSize: ms(11) }]}>{sublabel}</RNText>
        </View>
        <View style={[s.arcTimeBadge, isQuiet && s.arcTimeBadgeQuiet, { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: ms(4) }]}>
          <RNText style={[s.arcTime, { fontSize: ms(12) }, isQuiet && s.arcTimeQuiet]}>{time}</RNText>
        </View>
      </Pressable>
    </View>
  );
};

// ─── Setting Section ──────────────────────────────────────────────────────────

const SettingSection = ({
  title,
  enabled,
  onToggle,
  ms,
  children,
}: {
  title: string;
  enabled: boolean;
  onToggle: (val: boolean) => void;
  ms: (size: number) => number;
  children?: React.ReactNode;
}) => {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>{title}</RNText>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: C.darkSoft, true: C.accent }}
          thumbColor="#fff"
          style={Platform.OS === "ios" ? { transform: [{ scale: 0.8 }] } : undefined}
        />
      </View>
      {enabled && children}
    </View>
  );
};

// ─── Nudge Count Picker ───────────────────────────────────────────────────────

const NudgeCountPicker = ({ count, onChange, ms }: { count: number; onChange: (n: number) => void; ms: (size: number) => number }) => {
  return (
    <View style={s.nudgeRow}>
      <RNText style={[s.nudgeLabel, { fontSize: ms(12) }]}>Follow-ups per prompt</RNText>
      <View style={s.nudgePills}>
        {[1, 2, 3].map((n) => (
          <Pressable
            key={n}
            style={[s.nudgePill, n === count && s.nudgePillActive, { width: ms(34), height: ms(30), borderRadius: ms(10) }]}
            onPress={() => onChange(n)}
          >
            <RNText style={[s.nudgePillText, n === count && s.nudgePillTextActive, { fontSize: ms(13) }]}>{n}</RNText>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const RemindersSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const [morningTime, setMorningTime] = useState<TimeSlot>({ hour: 9, minute: 0 });
  const [nightTime, setNightTime] = useState<TimeSlot>({ hour: 21, minute: 0 });
  const [nudgesEnabled, setNudgesEnabled] = useState(true);
  const [nudgeCount, setNudgeCount] = useState(1);
  const [quietEnabled, setQuietEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState<TimeSlot>({ hour: 22, minute: 0 });
  const [quietEnd, setQuietEnd] = useState<TimeSlot>({ hour: 7, minute: 0 });
  const [taskNudge, setTaskNudge] = useState(true);

  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Unknown";

  const getPickerValue = useCallback((): TimeSlot => {
    switch (activePicker) {
      case "morning": return morningTime;
      case "night": return nightTime;
      case "quietStart": return quietStart;
      case "quietEnd": return quietEnd;
      default: return { hour: 9, minute: 0 };
    }
  }, [activePicker, morningTime, nightTime, quietStart, quietEnd]);

  const getPickerLabel = (): string => {
    switch (activePicker) {
      case "morning": return "Morning reminder";
      case "night": return "Night reminder";
      case "quietStart": return "Quiet hours start";
      case "quietEnd": return "Quiet hours end";
      default: return "";
    }
  };

  const handleTimeConfirm = (slot: TimeSlot) => {
    switch (activePicker) {
      case "morning": setMorningTime(slot); break;
      case "night": setNightTime(slot); break;
      case "quietStart": setQuietStart(slot); break;
      case "quietEnd": setQuietEnd(slot); break;
    }
    setActivePicker(null);
  };

  return (
    <SettingsScreen eyebrow="Reminders" title="Your daily rhythm" subtitle="Set when OnTrack speaks up.">
        {/* Day Arc */}
        <View style={[s.arcCard, { borderRadius: ms(18), padding: ms(16) }]}>
          <RNText style={[s.arcTitle, { fontSize: ms(10), marginBottom: ms(12) }]}>DAY ARC</RNText>

          {quietEnabled && (
            <ArcMarker
              icon="sunny-outline"
              label="Quiet ends"
              time={formatTime(quietEnd)}
              sublabel="Notifications resume"
              ms={ms}
              isQuiet
            />
          )}

          <ArcMarker
            icon="sunny"
            label="Morning"
            time={formatTime(morningTime)}
            sublabel="Plan & intention"
            ms={ms}
            onPress={() => setActivePicker("morning")}
          />

          {nudgesEnabled &&
            Array.from({ length: nudgeCount }).map((_, i) => (
              <ArcMarker
                key={`nudge-am-${i}`}
                icon="arrow-redo-outline"
                label={`Nudge ${i + 1}`}
                time={`+${30 * (i + 1)}m`}
                sublabel="Follow-up"
                ms={ms}
              />
            ))}

          <ArcMarker
            icon="moon"
            label="Night"
            time={formatTime(nightTime)}
            sublabel="Reflect & review"
            ms={ms}
            onPress={() => setActivePicker("night")}
          />

          {taskNudge && (
            <ArcMarker
              icon="checkbox-outline"
              label="Task check"
              time="+15m"
              sublabel="Pending tasks reminder"
              ms={ms}
            />
          )}

          {quietEnabled && (
            <ArcMarker
              icon="moon-outline"
              label="Quiet starts"
              time={formatTime(quietStart)}
              sublabel="Notifications paused"
              ms={ms}
              isQuiet
            />
          )}
        </View>

        <View style={s.sections}>
          {/* Follow-up Nudges */}
          <SettingSection title="FOLLOW-UP NUDGES" enabled={nudgesEnabled} onToggle={setNudgesEnabled} ms={ms}>
            <View style={[s.sectionCard, { borderRadius: ms(14), padding: ms(14) }]}>
              <NudgeCountPicker count={nudgeCount} onChange={setNudgeCount} ms={ms} />
              <RNText style={[s.sectionHint, { fontSize: ms(11), marginTop: ms(8) }]}>
                Sent after each prompt if you haven't logged yet.
              </RNText>
            </View>
          </SettingSection>

          {/* Quiet Hours */}
          <SettingSection title="QUIET HOURS" enabled={quietEnabled} onToggle={setQuietEnabled} ms={ms}>
            <View style={[s.sectionCard, { borderRadius: ms(14), padding: ms(14) }]}>
              <View style={s.quietRow}>
                <Pressable style={s.quietSlot} onPress={() => setActivePicker("quietStart")}>
                  <RNText style={[s.quietSlotLabel, { fontSize: ms(10) }]}>FROM</RNText>
                  <RNText style={[s.quietSlotTime, { fontSize: ms(15) }]}>{formatTime(quietStart)}</RNText>
                </Pressable>
                <Ionicons name="arrow-forward" size={ms(14)} color={C.muted} />
                <Pressable style={s.quietSlot} onPress={() => setActivePicker("quietEnd")}>
                  <RNText style={[s.quietSlotLabel, { fontSize: ms(10) }]}>UNTIL</RNText>
                  <RNText style={[s.quietSlotTime, { fontSize: ms(15) }]}>{formatTime(quietEnd)}</RNText>
                </Pressable>
              </View>
              <RNText style={[s.sectionHint, { fontSize: ms(11), marginTop: ms(10) }]}>
                No notifications during this window.
              </RNText>
            </View>
          </SettingSection>

          {/* Task Nudge */}
          <SettingSection title="PENDING TASK REMINDER" enabled={taskNudge} onToggle={setTaskNudge} ms={ms}>
            <View style={[s.sectionCard, { borderRadius: ms(14), padding: ms(14) }]}>
              <RNText style={[s.sectionHint, { fontSize: ms(11) }]}>
                Evening nudge if you still have incomplete tasks.
              </RNText>
            </View>
          </SettingSection>
        </View>

        {/* Timezone */}
        <View style={[s.timezoneCard, { borderRadius: ms(14), padding: ms(14) }]}>
          <Ionicons name="globe-outline" size={ms(16)} color={C.muted} />
          <View style={s.timezoneContent}>
            <RNText style={[s.timezoneText, { fontSize: ms(12) }]}>{timezone}</RNText>
            <RNText style={[s.timezoneHint, { fontSize: ms(10) }]}>Auto-follows device</RNText>
          </View>
        </View>
      {/* Time Picker Sheet */}
      <TimePickerSheet
        visible={activePicker !== null}
        value={getPickerValue()}
        label={getPickerLabel()}
        onConfirm={handleTimeConfirm}
        onDismiss={() => setActivePicker(null)}
        ms={ms}
      />
    </SettingsScreen>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  arcCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  arcTitle: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  arcRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  arcRowPressed: { opacity: 0.7 },
  arcTimeline: { alignItems: "center", width: 10 },
  arcDot: { backgroundColor: C.accent },
  arcDotQuiet: { backgroundColor: C.faded },
  arcLine: { width: 2, flex: 1, backgroundColor: C.accentSoft, marginTop: 2, minHeight: 18 },
  arcLineQuiet: { backgroundColor: C.darkSoft },
  arcIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  arcIconQuiet: { backgroundColor: C.darkSoft },
  arcContent: { flex: 1, gap: 1 },
  arcLabel: { color: C.text, fontWeight: "800" },
  arcLabelQuiet: { color: C.muted },
  arcSublabel: { color: C.muted, fontWeight: "600" },
  arcTimeBadge: { backgroundColor: C.accentSoft },
  arcTimeBadgeQuiet: { backgroundColor: C.darkSoft },
  arcTime: { color: C.dark, fontWeight: "800" },
  arcTimeQuiet: { color: C.faded },

  sections: { gap: 14 },
  section: { gap: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  sectionCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  sectionHint: { color: C.muted, fontWeight: "600" },

  nudgeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nudgeLabel: { color: C.text, fontWeight: "700" },
  nudgePills: { flexDirection: "row", gap: 6 },
  nudgePill: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  nudgePillActive: { backgroundColor: C.accent },
  nudgePillText: { color: C.muted, fontWeight: "800" },
  nudgePillTextActive: { color: C.dark },

  quietRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", gap: 12 },
  quietSlot: { alignItems: "center", gap: 2 },
  quietSlotLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1 },
  quietSlotTime: { color: C.text, fontWeight: "800" },

  timezoneCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center", gap: 10 },
  timezoneContent: { gap: 1 },
  timezoneText: { color: C.text, fontWeight: "700" },
  timezoneHint: { color: C.muted, fontWeight: "600" },
});

const ts = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: C.card, paddingHorizontal: 20 },
  handle: { backgroundColor: C.borderMedium, alignSelf: "center" },
  sheetTitle: { color: C.text, fontWeight: "900", textAlign: "center" },
  pickerRow: { flexDirection: "row", justifyContent: "center", gap: 12, paddingHorizontal: 12 },
  pickerColumn: { flex: 1, alignItems: "center" },
  pickerLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  pickerScroll: { width: "100%" },
  pickerScrollContent: { gap: 4, paddingVertical: 4, alignItems: "center" },
  pickerItem: { width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: C.bg },
  pickerItemActive: { backgroundColor: C.accent },
  pickerItemText: { color: C.muted, fontWeight: "700" },
  pickerItemTextActive: { color: C.dark, fontWeight: "900" },
  ampmColumn: { alignItems: "center" },
  confirmBtn: { backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  confirmText: { color: C.dark, fontWeight: "900" },
});
