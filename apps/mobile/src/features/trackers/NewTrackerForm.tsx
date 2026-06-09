import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text as RNText, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AutoGrowingTextInput } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

import { EmojiPicker } from "./EmojiPicker";
import { fieldTypes, TrackerFieldType } from "./trackerContent";

type FieldEntry = {
   key: string;
   label: string;
   type: TrackerFieldType;
   unit: string;
   required: boolean;
};

type Frequency = "daily" | "weekly" | "monthly" | "custom";

const FREQUENCIES: { value: Frequency; label: string }[] = [
   { value: "daily", label: "Daily" },
   { value: "weekly", label: "Weekly" },
   { value: "monthly", label: "Monthly" },
   { value: "custom", label: "Custom" },
];

type Props = {
   onClose: () => void;
   onSubmit?: (data: {
      name: string;
      emoji: string;
      frequency: Frequency;
      fields: FieldEntry[];
   }) => void;
};

export function NewTrackerForm({ onClose, onSubmit }: Props) {
   const r = useResponsiveMetrics();
   const ms = r.moderateScale;

   const [name, setName] = useState("");
   const [emoji, setEmoji] = useState("🎯");
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [frequency, setFrequency] = useState<Frequency>("daily");
   const [fields, setFields] = useState<FieldEntry[]>([{ key: "", label: "", type: "number", unit: "", required: false }]);
   const [showFieldTypePicker, setShowFieldTypePicker] = useState<number | null>(null);

   const addField = () => {
      setFields([...fields, { key: "", label: "", type: "number", unit: "", required: false }]);
   };

   const updateField = (index: number, patch: Partial<FieldEntry>) => {
      setFields(fields.map((f, i) => (i === index ? { ...f, ...patch } : f)));
   };

   const removeField = (index: number) => {
      if (fields.length > 1) setFields(fields.filter((_, i) => i !== index));
   };

   const handleSubmit = () => {
      const cleaned = fields
         .filter((f) => f.label.trim())
         .map((f) => ({ ...f, key: f.label.toLowerCase().replace(/\s+/g, "_") }));
      onSubmit?.({ name: name.trim(), emoji, frequency, fields: cleaned });
   };

   const canSubmit = name.trim().length > 0 && fields.some((f) => f.label.trim());

   return (
      <SafeAreaView style={s.root} edges={["top"]}>
         <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
               s.scroll,
               { paddingHorizontal: ms(20), paddingBottom: r.insets.bottom + ms(36), paddingTop: ms(18) },
            ]}
         >
            {/* Nav */}
            <View style={s.nav}>
               <Pressable style={[s.backBtn, { width: ms(40), height: ms(40), borderRadius: ms(13) }]} onPress={onClose}>
                  <Ionicons name="chevron-back" size={ms(18)} color={C.text} />
               </Pressable>
               <RNText style={[s.navTitle, { fontSize: ms(18) }]}>New tracker</RNText>
               <View style={{ width: ms(40) }} />
            </View>

            {/* Identity — emoji tap + inline name */}
            <View style={[s.identity, { marginTop: ms(16) }]}>
               <Pressable style={[s.emojiTap, { width: ms(48), height: ms(48), borderRadius: ms(15) }]} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <RNText style={{ fontSize: ms(24) }}>{emoji}</RNText>
               </Pressable>
               <TextInput
                  style={[s.nameInput, { fontSize: ms(20) }]}
                  placeholder="Name your tracker"
                  placeholderTextColor={C.faded}
                  value={name}
                  onChangeText={setName}
               />
            </View>

            {showEmojiPicker && (
               <View style={{ marginTop: ms(12) }}>
                  <EmojiPicker
                     selected={emoji}
                     onSelect={(e) => {
                        setEmoji(e);
                        setShowEmojiPicker(false);
                     }}
                     ms={ms}
                  />
               </View>
            )}

            {/* Frequency */}
            <View style={[s.frequencyRow, { marginTop: ms(24) }]}>
               {FREQUENCIES.map((f) => (
                  <Pressable
                     key={f.value}
                     style={[s.freqChip, { paddingVertical: ms(8), borderRadius: ms(10) }, frequency === f.value && s.freqChipActive]}
                     onPress={() => setFrequency(f.value)}
                  >
                     <RNText style={[s.freqText, { fontSize: ms(12) }, frequency === f.value && s.freqTextActive]}>{f.label}</RNText>
                  </Pressable>
               ))}
            </View>

            {/* Divider */}
            <View style={[s.divider, { marginTop: ms(24) }]} />

            {/* Fields */}
            <View style={{ marginTop: ms(20) }}>
               <RNText style={[s.sectionTitle, { fontSize: ms(17), marginBottom: ms(14) }]}>What do you track?</RNText>

               {fields.map((field, i) => (
                  <View key={i} style={[s.fieldItem, { borderRadius: ms(16), padding: ms(16) }, i > 0 && { marginTop: ms(10) }]}>
                     <View style={s.fieldInputRow}>
                        <AutoGrowingTextInput
                           style={[s.fieldNameInput, { fontSize: ms(16), paddingTop: ms(14), paddingBottom: ms(48) }]}
                           minHeight={ms(74)}
                           maxHeightMultiplier={4}
                           placeholder="e.g. Duration, Amount, Pages"
                           placeholderTextColor={C.faded}
                           value={field.label}
                           onChangeText={(v) => updateField(i, { label: v })}
                        />
                        <View style={s.fieldActions}>
                           {fields.length > 1 && (
                              <Pressable style={s.iconTap} onPress={() => removeField(i)} hitSlop={10}>
                                 <Ionicons name="close" size={ms(14)} color={C.faded} />
                              </Pressable>
                           )}
                           <Pressable
                              style={[s.configBtn, { width: ms(32), height: ms(32), borderRadius: ms(10) }]}
                              onPress={() => setShowFieldTypePicker(showFieldTypePicker === i ? null : i)}
                           >
                              <Ionicons name="options-outline" size={ms(15)} color={C.muted} />
                           </Pressable>
                        </View>
                     </View>

                     {showFieldTypePicker === i && (
                        <View style={[s.fieldConfig, { paddingHorizontal: ms(16), paddingBottom: ms(14) }]}>
                           <View style={[s.configRow, { marginBottom: ms(10) }]}>
                              <RNText style={[s.configLabel, { fontSize: ms(11) }]}>Type</RNText>
                              <View style={s.typePicker}>
                                 {fieldTypes.map((ft) => (
                                    <Pressable
                                       key={ft.type}
                                       style={[s.typeItem, { paddingHorizontal: ms(10), paddingVertical: ms(6), borderRadius: ms(8) }, field.type === ft.type && s.typeItemActive]}
                                       onPress={() => updateField(i, { type: ft.type as TrackerFieldType })}
                                    >
                                       <RNText style={[s.typeItemText, { fontSize: ms(11) }, field.type === ft.type && s.typeItemTextActive]}>{ft.label}</RNText>
                                    </Pressable>
                                 ))}
                              </View>
                           </View>
                           <View style={s.configRow}>
                              <RNText style={[s.configLabel, { fontSize: ms(11) }]}>Unit</RNText>
                              <TextInput
                                 style={[s.unitInput, { fontSize: ms(12), height: ms(32), width: ms(80), borderRadius: ms(8), paddingHorizontal: ms(10) }]}
                                 placeholder="e.g. min, kg"
                                 placeholderTextColor={C.faded}
                                 value={field.unit}
                                 onChangeText={(v) => updateField(i, { unit: v })}
                              />
                              <Pressable
                                 style={[s.reqToggle, { height: ms(32), paddingHorizontal: ms(12), borderRadius: ms(8) }, field.required && s.reqToggleActive]}
                                 onPress={() => updateField(i, { required: !field.required })}
                              >
                                 <RNText style={[s.reqText, { fontSize: ms(11) }, field.required && s.reqTextActive]}>Required</RNText>
                              </Pressable>
                           </View>
                        </View>
                     )}
                  </View>
               ))}

               <Pressable style={[s.addRow, { marginTop: ms(12), paddingVertical: ms(14), borderRadius: ms(16) }]} onPress={addField}>
                  <RNText style={[s.addText, { fontSize: ms(13) }]}>+ Add a field</RNText>
               </Pressable>
            </View>

            {/* Submit */}
            <Pressable
               style={[s.submit, { height: ms(50), borderRadius: ms(14), marginTop: ms(28) }, !canSubmit && s.submitDisabled]}
               onPress={handleSubmit}
               disabled={!canSubmit}
            >
               <RNText style={[s.submitText, { fontSize: ms(14) }]}>Create tracker</RNText>
            </Pressable>
         </ScrollView>
      </SafeAreaView>
   );
}

const s = StyleSheet.create({
   root: { flex: 1, backgroundColor: C.bg },
   scroll: {},
   nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
   navTitle: { color: C.text, fontWeight: "900" },
   backBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },

   identity: { flexDirection: "row", alignItems: "center", gap: 14 },
   emojiTap: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
   nameInput: { flex: 1, color: C.text, fontWeight: "900", padding: 0 },

   frequencyRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
   freqChip: { flex: 1, alignItems: "center", borderWidth: 1, borderColor: C.border },
   freqChipActive: { backgroundColor: C.dark, borderColor: C.dark },
   freqText: { color: C.muted, fontWeight: "700" },
   freqTextActive: { color: C.accent },

   divider: { height: 1, backgroundColor: C.border },

   sectionTitle: { color: C.text, fontWeight: "800" },

   fieldItem: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
   fieldInputRow: { position: "relative" },
   fieldActions: { position: "absolute", right: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 10 },
   fieldHeader: { flexDirection: "row", alignItems: "center" },
   fieldNameInput: { width: "100%", color: C.text, fontWeight: "700" },
   iconTap: { alignItems: "center", justifyContent: "center" },
   configBtn: { backgroundColor: C.bg, alignItems: "center", justifyContent: "center" },
   fieldConfig: { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 },
   configRow: { flexDirection: "row", alignItems: "center", gap: 8 },
   configLabel: { color: C.muted, fontWeight: "700", width: 34 },
   unitInput: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, color: C.text, fontWeight: "600" },
   reqToggle: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
   reqToggleActive: { backgroundColor: C.accentSoft, borderColor: C.accent },
   reqText: { color: C.muted, fontWeight: "700" },
   reqTextActive: { color: C.dark, fontWeight: "800" },

   typePicker: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
   typeItem: { flexDirection: "row", alignItems: "center", gap: 5 },
   typeItemActive: { backgroundColor: C.accentSoft },
   typeItemText: { color: C.muted, fontWeight: "700" },
   typeItemTextActive: { color: C.dark },

   addRow: { alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: C.border, borderStyle: "dashed" },
   addText: { color: C.muted, fontWeight: "800" },

   submit: { backgroundColor: C.dark, alignItems: "center", justifyContent: "center" },
   submitDisabled: { opacity: 0.25 },
   submitText: { color: C.accent, fontWeight: "900" },
});
