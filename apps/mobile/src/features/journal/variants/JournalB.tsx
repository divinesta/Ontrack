import { useCallback, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text as RNText,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { KeyboardAwareScreen } from "@/components/ui";
import { useResponsiveMetrics } from "@/theme";
import { createMockEntry, simulateProcessing, simulateRefine, simulateSave } from "../mock";
import { palette as C } from "../colors";

type MessageStatus = "sending" | "processing" | "ready" | "saved" | "refining";

type Message = {
  id: string;
  text: string;
  status: MessageStatus;
};

type CaptureNavItem = {
  name: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
};

function PulsingDots({ size }: { size: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useState(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  });

  const dotStyle = { width: size, height: size, borderRadius: size / 2, backgroundColor: C.accent };

  return (
    <View style={b.dotsContainer}>
      <Animated.View style={[dotStyle, { opacity: anim }]} />
      <Animated.View style={[dotStyle, { opacity: Animated.add(0.3, Animated.multiply(anim, 0.7)) }]} />
      <Animated.View style={[dotStyle, { opacity: Animated.add(0.1, Animated.multiply(anim, 0.5)) }]} />
    </View>
  );
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CAPTURE_NAV_ITEMS: CaptureNavItem[] = [
  { name: "today", route: "/(tabs)/today", icon: "today-outline" },
  { name: "review", route: "/(tabs)/review", icon: "bar-chart-outline" },
  { name: "settings", route: "/(tabs)/settings", icon: "settings-outline" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function CalendarModal({
  visible,
  selectedDate,
  onSelect,
  onClose,
  ms,
}: {
  visible: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  ms: (size: number) => number;
}) {
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const today = new Date();

  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const goToNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={cal.overlay} onPress={onClose}>
        <Pressable style={[cal.sheet, { borderRadius: ms(20), padding: ms(20) }]} onPress={() => {}}>
          <View style={cal.navRow}>
            <Pressable onPress={goToPrev} hitSlop={10} style={[cal.navBtn, { width: ms(32), height: ms(32), borderRadius: ms(16) }]}>
              <Ionicons name="chevron-back" size={ms(16)} color={C.text} />
            </Pressable>
            <RNText style={[cal.monthLabel, { fontSize: ms(15) }]}>
              {MONTHS[viewMonth]} {viewYear}
            </RNText>
            <Pressable onPress={goToNext} hitSlop={10} style={[cal.navBtn, { width: ms(32), height: ms(32), borderRadius: ms(16) }]}>
              <Ionicons name="chevron-forward" size={ms(16)} color={C.text} />
            </Pressable>
          </View>

          <View style={[cal.weekRow, { marginTop: ms(14), marginBottom: ms(8) }]}>
            {DAYS_OF_WEEK.map((d) => (
              <View key={d} style={cal.weekCell}>
                <RNText style={[cal.weekDayText, { fontSize: ms(11) }]}>{d}</RNText>
              </View>
            ))}
          </View>

          <View style={cal.grid}>
            {cells.map((day, i) => {
              if (day === null) return <View key={`e-${i}`} style={cal.dayCell} />;
              const date = new Date(viewYear, viewMonth, day);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              return (
                <Pressable
                  key={day}
                  style={[cal.dayCell, { height: ms(36) }]}
                  onPress={() => { onSelect(date); onClose(); }}
                >
                  <View style={[
                    cal.dayInner,
                    { width: ms(32), height: ms(32), borderRadius: ms(16) },
                    isSelected && cal.daySelected,
                    isToday && !isSelected && cal.dayToday,
                  ]}>
                    <RNText style={[
                      cal.dayText,
                      { fontSize: ms(13) },
                      isSelected && cal.dayTextSelected,
                    ]}>
                      {day}
                    </RNText>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={[cal.todayBtn, { marginTop: ms(14), paddingVertical: ms(10), borderRadius: ms(10) }]} onPress={() => { onSelect(today); onClose(); }}>
            <RNText style={[cal.todayBtnText, { fontSize: ms(13) }]}>Today</RNText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function JournalB() {
  const router = useRouter();
  const { insets, moderateScale, captureComposer, contentPaddingX } = useResponsiveMetrics();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const navExpandAnim = useRef(new Animated.Value(0)).current;

  const hasText = inputText.trim().length > 0;
  const showPlaceholder = !inputFocused && inputText.length === 0;

  const ms = moderateScale;
  const composerHeight = captureComposer.rowHeight;
  const composerControlHeight = captureComposer.controlHeight;
  const navExpandedHeight = navExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      captureComposer.tabSize,
      captureComposer.tabSize + CAPTURE_NAV_ITEMS.length * captureComposer.tabSize + captureComposer.floatingTabExpandedExtra,
    ],
  });

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return;
    const entry = createMockEntry(inputText.trim());
    const msg: Message = { id: entry.id, text: entry.text, status: "sending" };
    setMessages((prev) => [...prev, msg]);
    setInputText("");

    setTimeout(() => updateMessage(entry.id, { status: "processing" }), 300);
    await simulateProcessing();
    updateMessage(entry.id, { status: "ready" });
  }, [inputText, updateMessage]);

  const handleRefine = useCallback(async (id: string, originalText: string) => {
    updateMessage(id, { status: "refining" });
    const refined = await simulateRefine(originalText);
    updateMessage(id, { text: refined, status: "ready" });
  }, [updateMessage]);

  const handleSave = useCallback(async (id: string) => {
    updateMessage(id, { status: "saved" });
    await simulateSave();
  }, [updateMessage]);

  const toggleCaptureNav = useCallback(() => {
    const toValue = navExpanded ? 0 : 1;
    setNavExpanded(!navExpanded);
    Animated.spring(navExpandAnim, {
      toValue,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();
  }, [navExpandAnim, navExpanded]);

  const handleCaptureNavPress = useCallback((route: string) => {
    setNavExpanded(false);
    Animated.timing(navExpandAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    router.push(route as any);
  }, [navExpandAnim, router]);

  const renderMessage = useCallback(({ item, index }: { item: Message; index: number }) => (
    <View style={{ marginTop: ms(18) }}>
      <View style={[b.entryHeader, { gap: ms(8), marginBottom: ms(8) }]}>
        <View style={[b.entryNumber, { width: ms(22), height: ms(22), borderRadius: ms(11) }]}>
          <RNText style={[b.numberText, { fontSize: ms(10) }]}>{index + 1}</RNText>
        </View>
        <RNText style={[b.entryTime, { fontSize: ms(11) }]}>
          {new Date(Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </RNText>
      </View>

      <RNText style={[b.entryText, { fontSize: ms(14), lineHeight: ms(22) }]}>{item.text}</RNText>

      {item.status === "saved" && (
        <View style={[b.savedRow, { marginTop: ms(8) }]}>
          <Ionicons name="checkmark-circle" size={ms(13)} color={C.accent} />
          <RNText style={[b.savedLabel, { fontSize: ms(11) }]}>Captured</RNText>
        </View>
      )}

      {(item.status === "processing" || item.status === "refining") && (
        <View style={[b.statusDots, { marginTop: ms(10), height: ms(10) }]}>
          <PulsingDots size={ms(5)} />
        </View>
      )}

      {item.status === "ready" && (
        <View style={[b.actions, { marginTop: ms(10), gap: ms(8) }]}>
          <Pressable
            style={[b.actionPill, { paddingHorizontal: ms(12), paddingVertical: ms(8), borderRadius: ms(18) }]}
            onPress={() => handleRefine(item.id, item.text)}
          >
            <Ionicons name="color-wand-outline" size={ms(13)} color={C.text} />
            <RNText style={[b.actionPillText, { fontSize: ms(12) }]}>Refine with AI</RNText>
          </Pressable>
          <Pressable
            style={[b.actionPillPrimary, { paddingHorizontal: ms(12), paddingVertical: ms(8), borderRadius: ms(18) }]}
            onPress={() => handleSave(item.id)}
          >
            <Ionicons name="download-outline" size={ms(13)} color={C.dark} />
            <RNText style={[b.actionPillPrimaryText, { fontSize: ms(12) }]}>Save</RNText>
          </Pressable>
        </View>
      )}

      <View style={[b.divider, { marginTop: ms(18) }]} />
    </View>
  ), [handleRefine, handleSave, ms]);

  return (
    <KeyboardAwareScreen safeAreaEdges={[]} scrollEnabled={false} style={b.container}>
      <View style={{ paddingHorizontal: contentPaddingX, paddingTop: insets.top + ms(12), paddingBottom: ms(14) }}>
        <View style={b.headerTop}>
          <View>
            <RNText style={[b.eyebrow, { fontSize: ms(10), letterSpacing: ms(1.5) }]}>
              {isSameDay(selectedDate, new Date()) ? "DAILY LOG" : selectedDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }).toUpperCase()}
            </RNText>
            <RNText style={[b.headerTitle, { fontSize: ms(20), marginTop: ms(3) }]}>Capture</RNText>
          </View>
          <View style={[b.headerActions, { gap: ms(8) }]}>
            <View style={[b.streakBadge, { paddingHorizontal: ms(10), paddingVertical: ms(6), borderRadius: ms(12) }]}>
              <Ionicons name="flame" size={ms(14)} color="#e8a838" />
              <RNText style={[b.streakText, { fontSize: ms(13) }]}>7</RNText>
            </View>
            <Pressable
              style={[b.calendarBtn, { width: ms(36), height: ms(36), borderRadius: ms(12) }]}
              onPress={() => setCalendarVisible(true)}
              hitSlop={6}
            >
              <Ionicons name="calendar-outline" size={ms(18)} color={C.text} />
            </Pressable>
          </View>
        </View>
      </View>

      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setCalendarVisible(false)}
        ms={ms}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        style={b.list}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[b.listContent, { paddingHorizontal: contentPaddingX }]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[b.emptyState, { paddingBottom: ms(80) }]}>
            <View style={[b.emptyCircle, { width: ms(56), height: ms(56), borderRadius: ms(28), marginBottom: ms(16) }]}>
              <Ionicons name="create-outline" size={ms(22)} color={C.muted} />
            </View>
            <RNText style={[b.emptyTitle, { fontSize: ms(16), marginBottom: ms(5) }]}>Your blank canvas</RNText>
            <RNText style={[b.emptyDesc, { fontSize: ms(13), lineHeight: ms(19), maxWidth: ms(220) }]}>
              Drop in a thought, a feeling, a fragment.{"\n"}No structure required.
            </RNText>
          </View>
        }
      />

      <View
        style={[
          b.inputArea,
          {
            paddingBottom: captureComposer.bottomOffset,
            paddingHorizontal: captureComposer.horizontalPadding,
            paddingTop: captureComposer.verticalPadding,
          },
        ]}
      >
        <View style={[b.captureTabDock, { marginBottom: captureComposer.floatingTabGap }]}>
          <Animated.View
            style={[
              b.captureTabBar,
              { borderRadius: captureComposer.tabSize / 2, height: navExpandedHeight, width: captureComposer.tabSize },
            ]}
          >
            {navExpanded && (
              <View style={[b.captureTabItems, { paddingTop: captureComposer.floatingTabExpandedExtra }]}>
                {CAPTURE_NAV_ITEMS.map((item) => (
                  <Pressable
                    key={item.name}
                    style={[b.captureTabItem, { height: captureComposer.tabSize, width: captureComposer.tabSize }]}
                    onPress={() => handleCaptureNavPress(item.route)}
                    hitSlop={4}
                  >
                    <Ionicons name={item.icon} size={ms(20)} color="rgba(16,32,22,0.5)" />
                  </Pressable>
                ))}
              </View>
            )}
            <Pressable
              style={[b.captureTabToggle, { height: captureComposer.tabSize, width: captureComposer.tabSize }]}
              onPress={toggleCaptureNav}
              hitSlop={8}
            >
              <Ionicons name={navExpanded ? "close" : "apps"} size={ms(18)} color={C.text} />
            </Pressable>
          </Animated.View>
        </View>

        <View
          style={[
            b.inputRow,
            {
              borderRadius: composerHeight / 2,
              minHeight: composerHeight,
              paddingLeft: ms(16),
              paddingRight: ms(8),
              paddingVertical: ms(8),
            },
          ]}
        >
          <View style={[b.inputContent, { height: composerControlHeight, gap: ms(8) }]}>
            <View style={[b.inputSlot, { height: composerControlHeight }]}>
              {showPlaceholder && (
                <Pressable style={b.placeholderPressable} onPress={() => inputRef.current?.focus()}>
                  <RNText style={[b.inputPlaceholder, { fontSize: ms(15), lineHeight: ms(20) }]}>
                    Drop a thought here...
                  </RNText>
                </Pressable>
              )}
              <TextInput
                ref={inputRef}
                style={[b.input, { fontSize: ms(15), lineHeight: ms(20), height: composerControlHeight }]}
                value={inputText}
                onBlur={() => setInputFocused(false)}
                onChangeText={setInputText}
                onFocus={() => setInputFocused(true)}
                multiline
                maxLength={2000}
                scrollEnabled
              />
            </View>
            <Pressable
              style={[
                b.sendButton,
                { width: composerControlHeight, height: composerControlHeight, borderRadius: composerControlHeight / 2 },
                hasText && b.sendButtonActive,
              ]}
              onPress={hasText ? handleSend : undefined}
            >
              {hasText ? (
                <Ionicons name="arrow-up" size={ms(17)} color={C.dark} />
              ) : (
                <Ionicons name="mic" size={ms(17)} color={C.muted} />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAwareScreen>
  );
}

const b = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerActions: { flexDirection: "row", alignItems: "center" },
  calendarBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
  eyebrow: { color: C.accent, fontWeight: "900" },
  headerTitle: { color: C.text, fontWeight: "900" },
  streakBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  streakText: { color: C.text, fontWeight: "800" },
  list: { flex: 1 },
  listContent: { paddingBottom: 16, flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyCircle: { borderWidth: 2, borderStyle: "dashed", borderColor: C.borderMedium, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: C.text, fontWeight: "900" },
  emptyDesc: { color: C.muted, fontWeight: "600", textAlign: "center" },
  entryHeader: { flexDirection: "row", alignItems: "center" },
  entryNumber: { backgroundColor: C.dark, alignItems: "center", justifyContent: "center" },
  numberText: { color: C.accent, fontWeight: "900" },
  entryTime: { color: C.muted, fontWeight: "700" },
  entryText: { color: C.text, fontWeight: "600" },
  savedRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  savedLabel: { color: C.accent, fontWeight: "700" },
  statusDots: { flexDirection: "row", alignItems: "center" },
  actions: { flexDirection: "row" },
  actionPill: { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: C.borderMedium },
  actionPillText: { color: C.text, fontWeight: "700" },
  actionPillPrimary: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.accent },
  actionPillPrimaryText: { color: C.dark, fontWeight: "700" },
  divider: { height: 1, backgroundColor: C.border },
  dotsContainer: { flexDirection: "row", gap: 4 },
  captureTabBar: {
    alignItems: "center",
    backgroundColor: C.card,
    elevation: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  captureTabDock: { alignItems: "flex-end" },
  captureTabItem: { alignItems: "center", justifyContent: "center" },
  captureTabItems: { flex: 1, justifyContent: "flex-start" },
  captureTabToggle: { alignItems: "center", justifyContent: "center" },
  inputArea: {},
  inputRow: { borderWidth: 1, borderColor: C.borderMedium, backgroundColor: C.card, justifyContent: "center" },
  inputContent: { width: "100%", flexDirection: "row", alignItems: "center" },
  inputSlot: { flex: 1, justifyContent: "center" },
  input: {
    flex: 1,
    color: C.text,
    fontWeight: "600",
    includeFontPadding: false,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    textAlignVertical: "center",
  },
  inputPlaceholder: {
    color: C.muted,
    fontWeight: "600",
    includeFontPadding: false,
  },
  placeholderPressable: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    zIndex: 1,
  },
  sendButton: { alignItems: "center", justifyContent: "center", backgroundColor: C.bg },
  sendButtonActive: { backgroundColor: C.accent },
});

const cal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: C.card,
    width: "100%",
    maxWidth: 340,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    color: C.text,
    fontWeight: "900",
  },
  weekRow: {
    flexDirection: "row",
  },
  weekCell: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    color: C.muted,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    justifyContent: "center",
  },
  dayInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: C.dark,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: C.accent,
  },
  dayText: {
    color: C.text,
    fontWeight: "700",
  },
  dayTextSelected: {
    color: C.accent,
  },
  todayBtn: {
    backgroundColor: C.bg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  todayBtnText: {
    color: C.text,
    fontWeight: "800",
  },
});
