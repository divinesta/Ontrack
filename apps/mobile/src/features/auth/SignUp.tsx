import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { KeyboardAwareScreen } from "@/components/ui";
import { provisionalGreenPalette, useResponsiveMetrics } from "@/theme";

const palette = provisionalGreenPalette;

export function SignUp() {
   const router = useRouter();
   const r = useResponsiveMetrics();

   return (
      <KeyboardAwareScreen
         contentContainerStyle={[
            styles.content,
            { paddingBottom: r.moderateVerticalScale(30), paddingHorizontal: r.contentPaddingX, paddingTop: r.moderateVerticalScale(26) },
         ]}
         style={styles.screen}
      >
         <View style={styles.contourOne} />
         <View style={styles.contourTwo} />
         <View style={styles.contourThree} />
         <View style={styles.contourFour} />
         <View style={styles.waypointA} />
         <View style={styles.waypointB} />
         <View style={styles.trailLine} />

         <View>
            <Pressable hitSlop={12} onPress={() => router.push("/?step=signup")} style={styles.backButton}>
               <Text style={styles.backText}>‹</Text>
            </Pressable>

            <View style={styles.hero}>
               <Text style={styles.heroEyebrow}>BEGIN YOUR JOURNEY</Text>
               <Text style={[styles.heroTitle, { fontSize: r.smallWidth ? 32 : 36, lineHeight: r.smallWidth ? 38 : 42 }]}>Sign up with email</Text>
               <Text style={styles.heroBody}>Create your account to save your plans, logs, and reflections.</Text>
            </View>
         </View>

         <View style={styles.form}>
            <View style={[styles.inputWrap, { height: r.moderateVerticalScale(52) }]}>
               <TextInput autoCapitalize="words" placeholder="Name" placeholderTextColor="#6b8a6f" style={styles.input} />
            </View>
            <View style={[styles.inputWrap, { height: r.moderateVerticalScale(52) }]}>
               <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="E-mail" placeholderTextColor="#6b8a6f" style={styles.input} />
            </View>
            <View style={[styles.inputWrap, { height: r.moderateVerticalScale(52) }]}>
               <TextInput placeholder="Password" placeholderTextColor="#6b8a6f" secureTextEntry style={styles.input} />
            </View>

            <Pressable style={[styles.primaryButton, { height: r.buttonHeight, borderRadius: r.buttonHeight / 2 }]}>
               <Text style={styles.primaryButtonText}>Continue</Text>
               <View style={styles.buttonArrow}>
                  <Text style={styles.arrowText}>→</Text>
               </View>
            </Pressable>

            <Pressable hitSlop={12} onPress={() => router.push("/sign-in")} style={styles.footerPressable}>
               <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Sign in</Text></Text>
            </Pressable>
         </View>
      </KeyboardAwareScreen>
   );
}

const styles = StyleSheet.create({
   arrowText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "800",
   },
   backButton: {
      alignItems: "center",
      height: 44,
      justifyContent: "center",
      marginBottom: 20,
      width: 44,
   },
   backText: {
      color: "#102016",
      fontSize: 48,
      lineHeight: 48,
   },
   buttonArrow: {
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 12,
      height: 26,
      justifyContent: "center",
      position: "absolute",
      right: 10,
      width: 26,
   },
   content: {
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: 34,
      paddingHorizontal: 32,
      paddingTop: 30,
   },
   contourFour: {
      borderColor: "rgba(16,32,22,0.06)",
      borderRadius: 300,
      borderWidth: 1.5,
      height: 600,
      left: -200,
      position: "absolute",
      top: 260,
      width: 600,
   },
   contourOne: {
      borderColor: "rgba(134,231,184,0.3)",
      borderRadius: 200,
      borderWidth: 1.5,
      height: 400,
      position: "absolute",
      right: -120,
      top: -100,
      width: 400,
   },
   contourThree: {
      borderColor: "rgba(134,231,184,0.15)",
      borderRadius: 160,
      borderWidth: 1,
      height: 320,
      position: "absolute",
      right: -80,
      top: -60,
      width: 320,
   },
   contourTwo: {
      borderColor: "rgba(178,255,168,0.2)",
      borderRadius: 180,
      borderWidth: 1.5,
      height: 360,
      position: "absolute",
      right: -100,
      top: -80,
      width: 360,
   },
   footerLink: {
      color: "#102016",
      fontWeight: "900",
      textDecorationLine: "underline",
   },
   footerPressable: {
      alignItems: "center",
      paddingTop: 6,
   },
   footerText: {
      color: "#5a7560",
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
   },
   form: {
      gap: 13,
      width: "100%",
   },
   hero: {
      gap: 8,
   },
   heroBody: {
      color: "#5a7560",
      fontSize: 15,
      lineHeight: 22,
      marginTop: 4,
   },
   heroEyebrow: {
      color: palette.mint,
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2,
   },
   heroTitle: {
      color: "#102016",
      fontSize: 36,
      fontWeight: "900",
      letterSpacing: -0.5,
      lineHeight: 42,
   },
   input: {
      color: "#102016",
      flex: 1,
      fontSize: 15,
      height: "100%",
      paddingHorizontal: 20,
   },
   inputWrap: {
      backgroundColor: "#ffffff",
      borderColor: "rgba(16,32,22,0.1)",
      borderRadius: 18,
      borderWidth: 1.5,
      height: 52,
      overflow: "hidden",
      shadowColor: "#7e9d80",
      shadowOffset: { height: 6, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
   },
   primaryButton: {
      alignItems: "center",
      backgroundColor: "#102016",
      borderRadius: 24,
      flexDirection: "row",
      height: 48,
      justifyContent: "center",
      marginTop: 2,
   },
   primaryButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "900",
   },
   screen: {
      backgroundColor: "#f4f9f2",
      flex: 1,
      overflow: "hidden",
   },
   trailLine: {
      backgroundColor: "rgba(134,231,184,0.4)",
      height: 100,
      left: 56,
      position: "absolute",
      top: 210,
      transform: [{ rotate: "25deg" }],
      width: 2,
   },
   waypointA: {
      backgroundColor: palette.mint,
      borderRadius: 5,
      height: 10,
      left: 44,
      opacity: 0.7,
      position: "absolute",
      top: 200,
      width: 10,
   },
   waypointB: {
      backgroundColor: palette.bright,
      borderRadius: 4,
      height: 8,
      left: 68,
      opacity: 0.5,
      position: "absolute",
      top: 310,
      width: 8,
   },
});
