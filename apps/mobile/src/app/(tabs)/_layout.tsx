import { Tabs, usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { useResponsiveMetrics } from "@/theme";

type TabItem = {
  name: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabItem[] = [
  { name: "today",    route: "/(tabs)/today",    icon: "today-outline",      iconActive: "today" },
  { name: "capture",  route: "/(tabs)/capture",  icon: "mic-outline",        iconActive: "mic" },
  { name: "review",   route: "/(tabs)/review",   icon: "bar-chart-outline",  iconActive: "bar-chart" },
  { name: "settings", route: "/(tabs)/settings", icon: "settings-outline",   iconActive: "settings" },
];

function FloatingTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { insets } = useResponsiveMetrics();

  return (
    <View style={[b.wrap, { bottom: Math.max(insets.bottom, 8) + 10 }]}>
      <View style={b.bar}>
        {TABS.map((tab) => {
          const active = pathname.includes(tab.name);
          return (
            <Pressable
              key={tab.name}
              style={b.item}
              onPress={() => router.push(tab.route as any)}
              hitSlop={6}
            >
              {active && <View style={b.activeDot} />}
              <Ionicons
                name={active ? tab.iconActive : tab.icon}
                size={22}
                color={active ? "#102016" : "rgba(16,32,22,0.3)"}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <FloatingTabBar />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="calendar" options={{ href: null }} />
      <Tabs.Screen name="capture" />
      <Tabs.Screen name="review" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const b = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 24,
    right: 24,
  },
  bar: {
    flexDirection: "row",
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#102016",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 14,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  activeDot: {
    position: "absolute",
    top: 10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#86e7b8",
  },
});
