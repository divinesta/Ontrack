import { Pressable, StyleSheet, Text as RNText, View } from "react-native";

import { palette as C } from "@/features/journal/colors";

import { LifeArea } from "./trackerContent";

type Props = {
   area: LifeArea;
   ms: (v: number) => number;
   onPress?: () => void;
};

export function TrackerCard({ area, ms, onPress }: Props) {
   return (
      <Pressable
         style={({ pressed }) => [s.card, { borderRadius: ms(14), padding: ms(14) }, pressed && s.cardPressed]}
         onPress={onPress}
      >
         <View style={s.row}>
            <View style={[s.emoji, { width: ms(38), height: ms(38), borderRadius: ms(12) }]}>
               <RNText style={{ fontSize: ms(18) }}>{area.emoji}</RNText>
            </View>
            <View style={s.info}>
               <RNText style={[s.name, { fontSize: ms(15) }]}>{area.name}</RNText>
               <RNText style={[s.sub, { fontSize: ms(11) }]}>
                  {area.frequency} &middot; {area.fields.length} {area.fields.length === 1 ? "field" : "fields"}
               </RNText>
            </View>
            <RNText style={[s.records, { fontSize: ms(11) }]}>{area.records}</RNText>
         </View>
      </Pressable>
   );
}

const s = StyleSheet.create({
   card: {
      backgroundColor: C.card,
      borderColor: C.border,
      borderWidth: 1,
   },
   cardPressed: { backgroundColor: C.accentSoft },
   row: { flexDirection: "row", alignItems: "center", gap: 12 },
   emoji: { backgroundColor: C.darkSoft, alignItems: "center", justifyContent: "center" },
   info: { flex: 1, gap: 2 },
   name: { color: C.text, fontWeight: "800" },
   sub: { color: C.muted, fontWeight: "600", textTransform: "capitalize" },
   records: { color: C.faded, fontWeight: "700" },
});
