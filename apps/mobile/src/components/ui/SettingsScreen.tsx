import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

type SettingsScreenProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  subtitle?: string;
}>;

export const SettingsScreen = ({ eyebrow, title, subtitle, children }: SettingsScreenProps) => {
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
            paddingBottom: r.insets.bottom + ms(36),
            paddingHorizontal: r.contentPaddingX,
            paddingTop: ms(18),
          },
        ]}
      >
        <View style={s.nav}>
          <Pressable style={[s.backBtn, { width: ms(40), height: ms(40), borderRadius: ms(13) }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={ms(18)} color={C.text} />
          </Pressable>
          <View style={s.navTitle}>
            <RNText style={[s.eyebrow, { fontSize: ms(10) }]}>{eyebrow.toUpperCase()}</RNText>
            <RNText style={[s.title, { fontSize: ms(20), marginTop: ms(2) }]}>{title}</RNText>
            {subtitle && <RNText style={[s.subtitle, { fontSize: ms(12), marginTop: ms(2) }]}>{subtitle}</RNText>}
          </View>
        </View>

        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { gap: 22 },
  nav: { gap: 14 },
  backBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
  navTitle: {},
  eyebrow: { color: C.accent, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: C.text, fontWeight: "900" },
  subtitle: { color: C.muted, fontWeight: "600" },
});
