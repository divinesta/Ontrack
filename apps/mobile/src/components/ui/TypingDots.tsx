import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { palette as C } from "@/features/journal/colors";

type TypingDotsProps = {
   color?: string;
   size: number;
};

export function TypingDots({ color = C.accent, size }: TypingDotsProps) {
   const anim = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      const loop = Animated.loop(
         Animated.sequence([Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }), Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true })]),
      );

      loop.start();
      return () => loop.stop();
   }, [anim]);

   const dotStyle = { width: size, height: size, borderRadius: size / 2, backgroundColor: color };

   return (
      <View style={styles.dotsContainer}>
         <Animated.View style={[dotStyle, { opacity: anim }]} />
         <Animated.View style={[dotStyle, { opacity: Animated.add(0.3, Animated.multiply(anim, 0.7)) }]} />
         <Animated.View style={[dotStyle, { opacity: Animated.add(0.1, Animated.multiply(anim, 0.5)) }]} />
      </View>
   );
}

const styles = StyleSheet.create({
   dotsContainer: { flexDirection: "row", gap: 4 },
});
