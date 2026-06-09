import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text as RNText, TextInput, View } from "react-native";

import { palette as C } from "@/features/journal/colors";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
   {
      label: "Activity",
      emojis: ["🏋️", "🏃", "🚴", "🧘", "⚽", "🏊", "🎯", "💪", "🧗", "🎾", "🏄", "🥊"],
   },
   {
      label: "Money",
      emojis: ["💸", "💰", "🏦", "💳", "🪙", "📊", "📈", "🧾", "💵", "🛒"],
   },
   {
      label: "Learning",
      emojis: ["📖", "📚", "✍️", "🎓", "🧠", "💡", "📝", "🔬", "🎨", "🎵"],
   },
   {
      label: "Health",
      emojis: ["💊", "🩺", "😴", "💧", "🥗", "🧘", "❤️", "🫁", "🦷", "👁️"],
   },
   {
      label: "Social",
      emojis: ["🤝", "👥", "💬", "🎉", "❤️‍🔥", "🙏", "📞", "✉️", "🫂", "👋"],
   },
   {
      label: "Work",
      emojis: ["💻", "📋", "⏰", "🚀", "📌", "🔧", "📦", "🗂️", "✅", "🎯"],
   },
   {
      label: "Nature",
      emojis: ["🌱", "🌿", "☀️", "🌊", "🌸", "🍃", "🐾", "🦋", "🌙", "⭐"],
   },
];

type Props = {
   selected: string;
   onSelect: (emoji: string) => void;
   ms: (v: number) => number;
};

export function EmojiPicker({ selected, onSelect, ms }: Props) {
   const [search, setSearch] = useState("");

   const filtered = search
      ? EMOJI_GROUPS.map((g) => ({ ...g, emojis: g.emojis.filter(() => g.label.toLowerCase().includes(search.toLowerCase())) })).filter(
           (g) => g.emojis.length > 0,
        )
      : EMOJI_GROUPS;

   return (
      <View style={[s.root, { borderRadius: ms(14), padding: ms(14) }]}>
         <TextInput
            style={[s.search, { height: ms(36), borderRadius: ms(10), fontSize: ms(13), paddingHorizontal: ms(12) }]}
            placeholder="Search category..."
            placeholderTextColor={C.muted}
            value={search}
            onChangeText={setSearch}
         />
         <FlatList
            data={filtered}
            keyExtractor={(item) => item.label}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: ms(220) }}
            renderItem={({ item: group }) => (
               <View style={s.group}>
                  <RNText style={[s.groupLabel, { fontSize: ms(10) }]}>{group.label}</RNText>
                  <View style={s.grid}>
                     {group.emojis.map((emoji) => (
                        <Pressable
                           key={emoji}
                           onPress={() => onSelect(emoji)}
                           style={[s.emojiBtn, { width: ms(38), height: ms(38), borderRadius: ms(10) }, emoji === selected && s.emojiBtnActive]}
                        >
                           <RNText style={{ fontSize: ms(20) }}>{emoji}</RNText>
                        </Pressable>
                     ))}
                  </View>
               </View>
            )}
         />
      </View>
   );
}

const s = StyleSheet.create({
   root: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1 },
   search: { backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, color: C.text, fontWeight: "600" },
   group: { marginTop: 12 },
   groupLabel: { color: C.muted, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 },
   grid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
   emojiBtn: { alignItems: "center", justifyContent: "center", backgroundColor: C.darkSoft },
   emojiBtnActive: { backgroundColor: C.accentSoft, borderColor: C.accent, borderWidth: 1.5 },
});
