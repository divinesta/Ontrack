import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

import { settingGroups } from "./settingsContent";

export function Settings() {
  const router = useRouter();
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.content,
          {
            paddingBottom: r.insets.bottom + ms(104),
            paddingHorizontal: r.contentPaddingX,
            paddingTop: ms(18),
          },
        ]}
      >
        <View style={s.header}>
          <RNText style={[s.eyebrow, { fontSize: ms(10) }]}>SETTINGS</RNText>
          <RNText style={[s.title, { fontSize: ms(24), marginTop: ms(4) }]}>Settings</RNText>
        </View>

        {settingGroups.map((group) => (
          <View key={group.key} style={s.section}>
            <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>{group.title.toUpperCase()}</RNText>
            {group.routes.map((item) => (
              <Pressable
                key={item.key}
                style={({ pressed }) => [s.item, pressed && s.itemPressed]}
                onPress={() => item.route && router.push(item.route as never)}
              >
                <View style={[s.itemIcon, { width: ms(42), height: ms(42), borderRadius: ms(14) }]}>
                  <Ionicons name={item.icon} size={ms(19)} color={C.dark} />
                </View>
                <View style={s.itemContent}>
                  <RNText style={[s.itemTitle, { fontSize: ms(15) }]}>{item.title}</RNText>
                  <RNText style={[s.itemDetail, { fontSize: ms(12), lineHeight: ms(17) }]} numberOfLines={2}>
                    {item.detail}
                  </RNText>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { gap: 28 },
  header: {},
  eyebrow: { color: C.accent, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: C.text, fontWeight: "900" },
  section: { gap: 12 },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  item: {
    backgroundColor: C.card,
    borderColor: C.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  itemPressed: { backgroundColor: C.accentSoft },
  itemIcon: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  itemContent: { flex: 1, gap: 3 },
  itemTitle: { color: C.text, fontWeight: "800" },
  itemDetail: { color: C.muted, fontWeight: "600" },
});
