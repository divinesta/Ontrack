import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useResponsiveMetrics } from "@/theme";
import { palette as C } from "@/features/journal/colors";

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  entryCount: number;
};

const CATEGORIES: Category[] = [
  { id: "1", name: "Work/Projects", icon: "briefcase-outline", entryCount: 18 },
  { id: "2", name: "Learning", icon: "book-outline", entryCount: 14 },
  { id: "3", name: "Personal/Wellbeing", icon: "heart-outline", entryCount: 15 },
  { id: "4", name: "Side Projects", icon: "code-slash-outline", entryCount: 4 },
  { id: "5", name: "Faith", icon: "leaf-outline", entryCount: 12 },
];

export const ReviewCategories = () => {
  const router = useRouter();
  const { insets, moderateScale, contentPaddingX } = useResponsiveMetrics();
  const ms = moderateScale;

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCategories(new Set(CATEGORIES.map((c) => c.id)));
  }, []);

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: insets.bottom + ms(100) }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: contentPaddingX }}>
          <View style={[s.header, { paddingTop: ms(12) }]}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="arrow-back" size={ms(20)} color={C.text} />
            </Pressable>
            <RNText style={[s.stepTitle, { fontSize: ms(16) }]}>Select Areas</RNText>
            <Pressable onPress={selectAll}>
              <RNText style={[s.selectAllText, { fontSize: ms(12) }]}>Select all</RNText>
            </Pressable>
          </View>

          <RNText style={[s.stepDesc, { fontSize: ms(13), marginTop: ms(16), lineHeight: ms(20) }]}>
            Choose the categories and trackers you want to include in this review.
          </RNText>

          <View style={{ marginTop: ms(20), gap: ms(10) }}>
            {CATEGORIES.map((cat) => {
              const selected = selectedCategories.has(cat.id);
              return (
                <Pressable
                  key={cat.id}
                  style={[s.categoryCard, selected && s.categoryCardSelected, { borderRadius: ms(14), padding: ms(16) }]}
                  onPress={() => toggleCategory(cat.id)}
                >
                  <View style={[s.categoryIcon, selected && s.categoryIconSelected, { width: ms(40), height: ms(40), borderRadius: ms(12) }]}>
                    <Ionicons name={cat.icon} size={ms(18)} color={selected ? C.dark : C.muted} />
                  </View>
                  <View style={s.categoryInfo}>
                    <RNText style={[s.categoryName, { fontSize: ms(14) }]}>{cat.name}</RNText>
                    <RNText style={[s.categoryCount, { fontSize: ms(11) }]}>{cat.entryCount} entries this period</RNText>
                  </View>
                  <View style={[s.checkCircle, selected && s.checkCircleSelected, { width: ms(22), height: ms(22), borderRadius: ms(11) }]}>
                    {selected && <Ionicons name="checkmark" size={ms(12)} color={C.dark} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[s.continueBtn, selectedCategories.size === 0 && s.continueBtnDisabled, { borderRadius: ms(16), paddingVertical: ms(16), marginTop: ms(24) }]}
            onPress={() => router.push("/(tabs)/review/pre-generate" as any)}
            disabled={selectedCategories.size === 0}
          >
            <RNText style={[s.continueBtnText, selectedCategories.size === 0 && s.continueBtnTextDisabled, { fontSize: ms(14) }]}>
              Continue with {selectedCategories.size} {selectedCategories.size === 1 ? "area" : "areas"}
            </RNText>
            <Ionicons name="arrow-forward" size={ms(14)} color={selectedCategories.size === 0 ? C.muted : C.dark} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stepTitle: { color: C.text, fontWeight: "900" },
  selectAllText: { color: C.accent, fontWeight: "800" },
  stepDesc: { color: C.text, fontWeight: "600" },
  categoryCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  categoryCardSelected: { borderColor: C.accent, backgroundColor: C.accentSoft },
  categoryIcon: { backgroundColor: C.darkSoft, alignItems: "center", justifyContent: "center" },
  categoryIconSelected: { backgroundColor: C.accent },
  categoryInfo: { flex: 1, gap: 2 },
  categoryName: { color: C.text, fontWeight: "800" },
  categoryCount: { color: C.muted, fontWeight: "600" },
  checkCircle: { borderWidth: 1.5, borderColor: C.borderMedium, alignItems: "center", justifyContent: "center" },
  checkCircleSelected: { borderColor: C.accent, backgroundColor: C.accent },
  continueBtn: { backgroundColor: C.accent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  continueBtnDisabled: { backgroundColor: C.darkSoft },
  continueBtnText: { color: C.dark, fontWeight: "900" },
  continueBtnTextDisabled: { color: C.muted },
});
