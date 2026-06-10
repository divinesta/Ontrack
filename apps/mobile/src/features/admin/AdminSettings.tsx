import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text as RNText, View } from "react-native";

import { BottomSheet, SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

const MODELS = ["Qwen 2.5", "Qwen 2.0", "Qwen 1.5", "Llama 3.1", "Mistral Large"];

type SheetType = "primary" | "fallback" | null;

export const AdminSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const [primaryModel, setPrimaryModel] = useState("Qwen 2.5");
  const [fallbackModel, setFallbackModel] = useState("Qwen 2.0");
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [selectedModel, setSelectedModel] = useState("");

  const provider = "OpenRouter";
  const lastChanged = "Jun 8, 2026";

  const openSheet = (type: SheetType) => {
    setSelectedModel(type === "primary" ? primaryModel : fallbackModel);
    setActiveSheet(type);
  };

  const handleConfirm = () => {
    if (activeSheet === "primary") setPrimaryModel(selectedModel);
    if (activeSheet === "fallback") setFallbackModel(selectedModel);
    setActiveSheet(null);
  };

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
            <RNText style={[s.configModel, { fontSize: ms(16) }]}>{primaryModel}</RNText>
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
          <Pressable style={[s.actionRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]} onPress={() => openSheet("primary")}>
            <Ionicons name="swap-horizontal-outline" size={ms(16)} color={C.dark} />
            <View style={s.actionContent}>
              <RNText style={[s.actionTitle, { fontSize: ms(13) }]}>Change model</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Switch primary AI model</RNText>
            </View>
            <Ionicons name="chevron-forward" size={ms(14)} color={C.muted} />
          </Pressable>
          <View style={s.actionDivider} />
          <Pressable style={[s.actionRow, { paddingHorizontal: ms(14), paddingVertical: ms(14) }]} onPress={() => openSheet("fallback")}>
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

      {/* Model Selection Sheet */}
      <BottomSheet
        visible={activeSheet !== null}
        title={activeSheet === "primary" ? "Select primary model" : "Select fallback model"}
        onClose={() => setActiveSheet(null)}
        onConfirm={handleConfirm}
      >
        <View style={{ gap: 6 }}>
          {MODELS.map((model) => (
            <Pressable
              key={model}
              style={[s.optionRow, model === selectedModel && s.optionRowActive, { borderRadius: ms(12), paddingHorizontal: ms(14), paddingVertical: ms(13) }]}
              onPress={() => setSelectedModel(model)}
            >
              <RNText style={[s.optionText, model === selectedModel && s.optionTextActive, { fontSize: ms(14) }]}>
                {model}
              </RNText>
              {model === selectedModel && <Ionicons name="checkmark" size={ms(16)} color={C.dark} />}
            </Pressable>
          ))}
        </View>
      </BottomSheet>
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

  optionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  optionRowActive: { backgroundColor: C.accentSoft, borderColor: C.accent },
  optionText: { color: C.text, fontWeight: "700" },
  optionTextActive: { color: C.dark, fontWeight: "900" },
});
