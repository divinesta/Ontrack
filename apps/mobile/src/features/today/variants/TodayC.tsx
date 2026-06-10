import { useCallback, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text as RNText,
} from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheet } from "@/components/ui";
import { useResponsiveMetrics } from "@/theme";

const STREAK = 7;
const MONTH_DONE = 18;
const MONTH_TOTAL = 29;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeekDays(anchorDate: Date) {
  const days = [];
  const start = new Date(anchorDate);
  start.setDate(anchorDate.getDate() - 10);
  for (let i = 0; i < 21; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

const TODAY = new Date(2026, 6, 210 ); // May 29 2026
const LOGGED_DATES = new Set([
  "2026-05-25", "2026-05-26", "2026-05-27", "2026-05-29",
]);

type TaskStatus = "done" | "pending" | "skipped";
type Task = { id: string; label: string; status: TaskStatus };

const INITIAL_TASKS: Task[] = [
  { id: "1", label: "Review project proposal", status: "done" },
  { id: "2", label: "Read 20 pages", status: "pending" },
  { id: "3", label: "Morning prayer", status: "done" },
  { id: "4", label: "Gym session", status: "skipped" },
  { id: "5", label: "Write journal entry", status: "pending" },
];

const pct = Math.round((MONTH_DONE / MONTH_TOTAL) * 100);

const REPEAT_OPTIONS = ["No repeat", "Daily", "Weekly", "Weekdays", "Weekends"];

function CreateTaskModal({ visible, onClose, onSave }: {
  visible: boolean;
  onClose: () => void;
  onSave: (label: string) => void;
}) {
  const [name, setName] = useState("");
  const [startDate] = useState("29 May 2026");
  const [startTime] = useState("09:00");
  const [endDate] = useState("29 May 2026");
  const [endTime] = useState("09:30");
  const [repeat, setRepeat] = useState("No repeat");
  const [showRepeat, setShowRepeat] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setShowRepeat(false);
  };

  const handleClose = () => {
    setName("");
    setShowRepeat(false);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Create task"
      onClose={handleClose}
      onConfirm={handleSave}
      confirmDisabled={!name.trim()}
    >
      {/* Task name */}
      <View style={m.fieldGroup}>
        <RNText style={m.fieldLabel}>Task name</RNText>
        <TextInput
          style={m.nameInput}
          placeholder="What do you want to do?"
          placeholderTextColor="rgba(16,32,22,0.3)"
          value={name}
          onChangeText={setName}
          autoFocus
        />
      </View>

      {/* Time of day */}
      <View style={m.fieldGroup}>
        <RNText style={m.fieldLabel}>Time of day</RNText>
        <View style={m.fieldRow}>
          <RNText style={m.fieldIcon}>🕐</RNText>
          <RNText style={m.fieldValue}>At time</RNText>
        </View>
      </View>

      {/* Starts */}
      <View style={m.dateTimeRow}>
        <View style={[m.fieldGroup, { flex: 1 }]}>
          <RNText style={m.fieldLabel}>Starts</RNText>
          <View style={m.fieldRow}>
            <RNText style={m.fieldIcon}>📅</RNText>
            <RNText style={m.fieldValue}>{startDate}</RNText>
          </View>
        </View>
        <View style={[m.fieldGroup, { flex: 1 }]}>
          <RNText style={m.fieldLabel}>Start time</RNText>
          <View style={m.fieldRow}>
            <RNText style={m.fieldIcon}>🕐</RNText>
            <RNText style={m.fieldValue}>{startTime}</RNText>
          </View>
        </View>
      </View>

      {/* Ends */}
      <View style={m.dateTimeRow}>
        <View style={[m.fieldGroup, { flex: 1 }]}>
          <RNText style={m.fieldLabel}>Ends</RNText>
          <View style={m.fieldRow}>
            <RNText style={m.fieldIcon}>📅</RNText>
            <RNText style={m.fieldValue}>{endDate}</RNText>
          </View>
        </View>
        <View style={[m.fieldGroup, { flex: 1 }]}>
          <RNText style={m.fieldLabel}>End time</RNText>
          <View style={m.fieldRow}>
            <RNText style={m.fieldIcon}>🕐</RNText>
            <RNText style={m.fieldValue}>{endTime}</RNText>
          </View>
        </View>
      </View>

      {/* Repeat */}
      <View style={m.fieldGroup}>
        <RNText style={m.fieldLabel}>Repeat</RNText>
        <Pressable style={m.fieldRow} onPress={() => setShowRepeat((v) => !v)}>
          <RNText style={m.fieldIcon}>🔁</RNText>
          <RNText style={[m.fieldValue, { flex: 1 }]}>{repeat}</RNText>
          <RNText style={m.chevron}>{showRepeat ? "▲" : "▼"}</RNText>
        </Pressable>
        {showRepeat && (
          <View style={m.repeatDropdown}>
            {REPEAT_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                style={[m.repeatOption, opt === repeat && m.repeatOptionActive]}
                onPress={() => { setRepeat(opt); setShowRepeat(false); }}
              >
                <RNText style={[m.repeatOptionText, opt === repeat && m.repeatOptionTextActive]}>
                  {opt}
                </RNText>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function TodayC() {
  const r = useResponsiveMetrics();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);
  const weekDays = buildWeekDays(TODAY);

  const doneTasks = tasks.filter((t) => t.status === "done").length;

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t)
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSaveTask = useCallback((label: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      label,
      status: "pending",
    };
    setTasks((prev) => [...prev, newTask]);
    setShowCreate(false);
  }, []);

  const renderTask = useCallback(({ item, drag, isActive }: RenderItemParams<Task>) => {
    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
      const opacity = progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.6, 1],
      });
      return (
        <Animated.View style={[s.deleteAction, { opacity }]}>
          <Ionicons name="trash-outline" size={22} color="#d14343" />
        </Animated.View>
      );
    };

    return (
      <ScaleDecorator activeScale={1.03}>
        <Swipeable
          renderRightActions={renderRightActions}
          rightThreshold={60}
          overshootRight={false}
          onSwipeableWillOpen={() => deleteTask(item.id)}
        >
          <Pressable
            onLongPress={drag}
            onPress={() => toggleTask(item.id)}
            style={[s.taskCard, isActive && s.taskCardActive]}
            delayLongPress={150}
          >
            <View style={s.dragHandle}>
              <View style={s.dragDot} />
              <View style={s.dragDot} />
              <View style={s.dragDot} />
              <View style={s.dragDot} />
              <View style={s.dragDot} />
              <View style={s.dragDot} />
            </View>
            <RNText style={[s.taskLabel, item.status === "done" && s.taskLabelFaded]} numberOfLines={2}>
              {item.label}
            </RNText>
            <View style={[s.checkCircle, item.status === "done" && s.checkCircleDone]}>
              {item.status === "done" && <RNText style={s.checkTick}>✓</RNText>}
            </View>
          </Pressable>
        </Swipeable>
      </ScaleDecorator>
    );
  }, [toggleTask, deleteTask]);

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <View style={s.contourOne} />
      <View style={s.contourTwo} />
      <View style={s.contourThree} />
      <View style={s.trailLine} />
      <View style={s.waypointA} />
      <View style={s.waypointB} />

      {/* Fixed header */}
      <View style={s.fixedHeader}>
        <View style={s.header}>
          <View>
            <RNText style={s.eyebrow}>WEDNESDAY · JUNE 10</RNText>
            <RNText style={s.greeting}>Good morning, Divine.</RNText>
          </View>
          <Pressable style={s.avatarCircle}>
            <RNText style={s.avatarInitial}>D</RNText>
          </Pressable>
        </View>

        <View style={s.statsRow}>
          <View style={[s.statCard, s.statCardDark]}>
            <RNText style={s.streakNum}>{STREAK}</RNText>
            <RNText style={s.streakLabel}>day streak 🔥</RNText>
          </View>
          <View style={[s.statCard, s.statCardLight]}>
            <RNText style={s.monthNum}>{pct}<RNText style={s.monthPctSign}>%</RNText></RNText>
            <RNText style={s.monthLabel}>May logged</RNText>
            <View style={s.monthBarTrack}>
              <View style={[s.monthBarFill, { width: `${pct}%` as `${number}%` }]} />
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.weekScroll}
          style={s.weekWrap}
        >
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, TODAY);
            const hasLog = LOGGED_DATES.has(toKey(day));
            return (
              <Pressable
                key={i}
                style={[s.dayCol, isSelected && s.dayColSelected]}
                onPress={() => setSelectedDate(day)}
              >
                <RNText style={[s.dayNum, isSelected && s.dayNumSelected]}>
                  {day.getDate()}
                </RNText>
                <RNText style={[s.dayLabel, isSelected && s.dayLabelSelected]}>
                  {DAY_LABELS[day.getDay()]}
                </RNText>
                <View style={[s.dayDot, hasLog && s.dayDotActive, isSelected && s.dayDotSelected]} />
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[s.sectionHead, { marginTop: 8 }]}>
          <RNText style={s.sectionTitle}>Tasks</RNText>
          <RNText style={s.sectionSub}>{doneTasks} of {tasks.length} done</RNText>
        </View>
      </View>

      {/* Scrollable task list */}
      <DraggableFlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setTasks(data)}
        renderItem={renderTask}
        contentContainerStyle={[s.taskList, { paddingBottom: r.insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <Pressable style={s.addTile} onPress={() => setShowCreate(true)}>
              <RNText style={s.addTileText}>+ Add a task</RNText>
            </Pressable>
            <View style={s.rateRow}>
              <RNText style={s.rateLabel}>{MONTH_DONE}/{MONTH_TOTAL} days logged in May</RNText>
            </View>
          </>
        }
      />

      <CreateTaskModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleSaveTask}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f4f9f2", overflow: "hidden" },
  contourOne: {
    borderColor: "rgba(134,231,184,0.3)", borderRadius: 200, borderWidth: 1.5,
    height: 400, position: "absolute", right: -120, top: -100, width: 400,
  },
  contourTwo: {
    borderColor: "rgba(178,255,168,0.2)", borderRadius: 180, borderWidth: 1.5,
    height: 360, position: "absolute", right: -100, top: -80, width: 360,
  },
  contourThree: {
    borderColor: "rgba(134,231,184,0.15)", borderRadius: 160, borderWidth: 1,
    height: 320, position: "absolute", right: -80, top: -60, width: 320,
  },
  trailLine: {
    backgroundColor: "rgba(134,231,184,0.4)", height: 100, left: 56,
    position: "absolute", top: 186, transform: [{ rotate: "25deg" }], width: 2,
  },
  waypointA: {
    backgroundColor: "#86e7b8", borderRadius: 5, height: 10,
    left: 44, opacity: 0.7, position: "absolute", top: 176, width: 10,
  },
  waypointB: {
    backgroundColor: "#93ff96", borderRadius: 4, height: 8,
    left: 68, opacity: 0.5, position: "absolute", top: 286, width: 8,
  },
  fixedHeader: { paddingHorizontal: 24, paddingTop: 16, gap: 20 },
  taskList: { paddingHorizontal: 24, paddingTop: 10, gap: 10 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: "#86e7b8", fontSize: 11, fontWeight: "900", letterSpacing: 2, marginBottom: 10 },
  greeting: { color: "#102016", fontSize: 20, fontWeight: "900", letterSpacing: -0.3, marginBottom: 4 },
  avatarCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#102016", alignItems: "center", justifyContent: "center",
  },
  avatarInitial: { color: "#86e7b8", fontSize: 16, fontWeight: "900" },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, borderRadius: 20, padding: 20, borderWidth: 1, overflow: "hidden", minHeight: 120 },
  statCardDark: { backgroundColor: "#102016", borderColor: "#203327" },
  statCardLight: {
    backgroundColor: "#ffffff", borderColor: "rgba(16,32,22,0.1)",
    shadowColor: "#102016", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  streakNum: { color: "#86e7b8", fontSize: 44, fontWeight: "900", letterSpacing: -2, lineHeight: 48 },
  streakLabel: { color: "rgba(134,231,184,0.6)", fontSize: 12, fontWeight: "700", marginTop: 4 },
  monthNum: { color: "#102016", fontSize: 44, fontWeight: "900", letterSpacing: -2, lineHeight: 48 },
  monthPctSign: { fontSize: 22, color: "#86e7b8" },
  monthLabel: { color: "#9fb59f", fontSize: 12, fontWeight: "700", marginTop: 4, marginBottom: 8 },
  monthBarTrack: { height: 3, borderRadius: 2, backgroundColor: "rgba(16,32,22,0.08)", overflow: "hidden" },
  monthBarFill: { height: 3, borderRadius: 2, backgroundColor: "#86e7b8" },
  weekWrap: {
    backgroundColor: "#ffffff", borderRadius: 16,
    borderColor: "rgba(16,32,22,0.08)", borderWidth: 1,
  },
  weekScroll: {
    paddingVertical: 12, paddingHorizontal: 8, gap: 4,
  },
  dayCol: {
    alignItems: "center", justifyContent: "center",
    gap: 5, paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 14, minWidth: 48,
  },
  dayColSelected: {
    backgroundColor: "#102016",
  },
  dayNum: {
    color: "#102016", fontSize: 15, fontWeight: "800", lineHeight: 18,
  },
  dayNumSelected: { color: "#86e7b8" },
  dayLabel: {
    color: "rgba(16,32,22,0.35)", fontSize: 10, fontWeight: "700",
  },
  dayLabelSelected: { color: "rgba(134,231,184,0.7)" },
  dayDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: "transparent",
  },
  dayDotActive: { backgroundColor: "#86e7b8" },
  dayDotSelected: { backgroundColor: "rgba(134,231,184,0.5)" },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: 2 },
  sectionTitle: { color: "#102016", fontSize: 18, fontWeight: "900" },
  sectionSub: { color: "#9fb59f", fontSize: 12, fontWeight: "700" },
  taskCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff",
    borderRadius: 16, paddingVertical: 13, paddingHorizontal: 14,
    borderColor: "rgba(16,32,22,0.07)", borderWidth: 1, gap: 10,
    shadowColor: "#102016", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  taskCardActive: { shadowOpacity: 0.12, shadowRadius: 12, elevation: 6, backgroundColor: "#f9fdf7" },
  dragHandle: { flexDirection: "row", flexWrap: "wrap", width: 12, gap: 2.5, paddingVertical: 2 },
  dragDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(16,32,22,0.2)" },
  checkCircle: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5, borderColor: "rgba(16,32,22,0.2)",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  checkCircleDone: { backgroundColor: "#102016", borderColor: "#102016" },
  checkTick: { color: "#86e7b8", fontSize: 9, fontWeight: "900" },
  taskLabel: { flex: 1, color: "#102016", fontSize: 14, fontWeight: "700", lineHeight: 20 },
  taskLabelFaded: { color: "#b8ccb6", textDecorationLine: "line-through" },
  deleteAction: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  addTile: {
    borderWidth: 1.5, borderColor: "rgba(16,32,22,0.15)", borderStyle: "dashed",
    borderRadius: 16, paddingVertical: 16, alignItems: "center", justifyContent: "center",
  },
  addTileText: { color: "#9fb59f", fontSize: 14, fontWeight: "800" },
  rateRow: { alignItems: "center", paddingTop: 4 },
  rateLabel: { color: "#b8ccb6", fontSize: 12, fontWeight: "600" },
});

const m = StyleSheet.create({
  fieldGroup: { gap: 6 },
  fieldLabel: { color: "#9fb59f", fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  fieldRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#f4f9f2", borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1, borderColor: "rgba(16,32,22,0.07)",
  },
  fieldIcon: { fontSize: 16 },
  fieldValue: { color: "#102016", fontSize: 14, fontWeight: "700" },
  chevron: { color: "#9fb59f", fontSize: 11, fontWeight: "800" },
  nameInput: {
    backgroundColor: "#f4f9f2", borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1, borderColor: "#86e7b8",
    color: "#102016", fontSize: 15, fontWeight: "700",
  },
  dateTimeRow: { flexDirection: "row", gap: 10 },
  repeatDropdown: {
    backgroundColor: "#ffffff", borderRadius: 14, marginTop: 4,
    borderWidth: 1, borderColor: "rgba(16,32,22,0.08)",
    overflow: "hidden",
  },
  repeatOption: { paddingHorizontal: 16, paddingVertical: 13 },
  repeatOptionActive: { backgroundColor: "#f4f9f2" },
  repeatOptionText: { color: "#62705f", fontSize: 14, fontWeight: "700" },
  repeatOptionTextActive: { color: "#102016", fontWeight: "900" },
});
