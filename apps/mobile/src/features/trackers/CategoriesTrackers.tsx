import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

import { NewTrackerForm } from "./NewTrackerForm";
import { TrackerCard } from "./TrackerCard";
import { lifeAreas } from "./trackerContent";

export function CategoriesTrackers() {
   const router = useRouter();
   const r = useResponsiveMetrics();
   const ms = r.moderateScale;
   const [showForm, setShowForm] = useState(false);

   if (showForm) {
      return <NewTrackerForm onClose={() => setShowForm(false)} />;
   }

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
               <Pressable style={[s.newBtn, { height: ms(40), borderRadius: ms(13) }]} onPress={() => setShowForm(true)}>
                  <Ionicons name="add" size={ms(16)} color={C.dark} />
                  <RNText style={[s.newBtnText, { fontSize: ms(12) }]}>New tracker</RNText>
               </Pressable>
            </View>

            <View style={s.header}>
               <RNText style={[s.eyebrow, { fontSize: ms(10) }]}>CATEGORIES & TRACKERS</RNText>
               <RNText style={[s.title, { fontSize: ms(22), marginTop: ms(4) }]}>Your life areas</RNText>
               <RNText style={[s.subtitle, { fontSize: ms(13), marginTop: ms(4) }]}>Each area has its own fields and rhythm.</RNText>
            </View>

            <View style={s.list}>
               {lifeAreas.map((area) => (
                  <TrackerCard key={area.key} area={area} ms={ms} />
               ))}
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const s = StyleSheet.create({
   root: { flex: 1, backgroundColor: C.bg },
   content: { gap: 22 },
   nav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
   backBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
   newBtn: { backgroundColor: C.accent, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14 },
   newBtnText: { color: C.dark, fontWeight: "900" },
   header: {},
   eyebrow: { color: C.accent, fontWeight: "900", letterSpacing: 1.5 },
   title: { color: C.text, fontWeight: "900" },
   subtitle: { color: C.muted, fontWeight: "600" },
   list: { gap: 12 },
});
