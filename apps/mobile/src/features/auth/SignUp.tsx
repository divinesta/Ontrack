import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { provisionalGreenPalette } from "@/theme";

const palette = provisionalGreenPalette;

export function SignUp() {
   const router = useRouter();

   return (
      <SafeAreaView style={styles.screen}>
            <View style={styles.contourOne} />
            <View style={styles.contourTwo} />
            <View style={styles.contourThree} />
            <View style={styles.contourFour} />

            <View style={styles.waypointA} />
            <View style={styles.waypointB} />
            <View style={styles.trailLine} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
               <View style={styles.nav}>
                  <View style={styles.compassWrap}>
                     <View style={styles.compassRing} />
                     <View style={styles.compassNeedle} />
                  </View>
                  <Text style={styles.navBrand}>ONTRACK</Text>
               </View>

               <View style={styles.hero}>
                  <Text style={styles.heroEyebrow}>BEGIN YOUR JOURNEY</Text>
                  <Text style={styles.heroTitle}>Create account</Text>
                  <Text style={styles.heroBody}>Start tracking your days with clarity. Set up takes less than a minute.</Text>
               </View>

               <View style={styles.form}>
                  <View style={styles.inputWrap}>
                     <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email address" placeholderTextColor="#6b8a6f" style={styles.input} />
                  </View>

                  <View style={styles.inputWrap}>
                     <TextInput placeholder="Password" placeholderTextColor="#6b8a6f" secureTextEntry style={styles.input} />
                  </View>

                  <Pressable style={styles.primaryButton}>
                     <Text style={styles.primaryButtonText}>Get Started</Text>
                     <View style={styles.buttonArrow}>
                        <Text style={styles.arrowText}>→</Text>
                     </View>
                  </Pressable>

                  <View style={styles.orSection}>
                     <View style={styles.orLine} />
                     <Text style={styles.orText}>or</Text>
                     <View style={styles.orLine} />
                  </View>

                  <Pressable style={styles.appleButton}>
                     <Text style={styles.appleIcon}></Text>
                     <Text style={styles.appleButtonText}>Sign up with Apple</Text>
                  </Pressable>

                  <Pressable style={styles.googleButton}>
                     <Text style={styles.googleIcon}>G</Text>
                     <Text style={styles.googleButtonText}>Sign up with Google</Text>
                  </Pressable>
               </View>

               <View style={styles.footer}>
                  <Pressable
                     accessibilityRole="button"
                     hitSlop={12}
                     onPress={() => router.push("/sign-in")}
                     style={styles.footerPressable}
                  >
                     <Text style={styles.footerText}>
                        Already have an account? <Text style={styles.footerLink}>Sign in</Text>
                     </Text>
                  </Pressable>
                  <Text style={styles.legal}>By signing up you agree to our Terms & Privacy Policy</Text>
               </View>
            </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   screen: {
      backgroundColor: "#f4f9f2",
      flex: 1,
      overflow: "hidden",
   },
   appleButton: {
      alignItems: "center",
      backgroundColor: "#102016",
      borderRadius: 26,
      flexDirection: "row",
      gap: 10,
      height: 52,
      justifyContent: "center",
   },
   appleButtonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "700",
   },
   appleIcon: {
      color: "#ffffff",
      fontSize: 18,
   },
   arrowText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
   },
   buttonArrow: {
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 12,
      height: 28,
      justifyContent: "center",
      position: "absolute",
      right: 12,
      width: 28,
   },
   compassNeedle: {
      backgroundColor: "#102016",
      borderRadius: 1,
      height: 10,
      position: "absolute",
      top: 3,
      width: 2,
   },
   compassRing: {
      borderColor: "#102016",
      borderRadius: 9,
      borderWidth: 2,
      height: 18,
      width: 18,
   },
   compassWrap: {
      alignItems: "center",
      height: 18,
      justifyContent: "center",
      width: 18,
   },
   content: {
      flexGrow: 1,
      paddingBottom: 36,
      paddingHorizontal: 28,
      paddingTop: 20,
   },
   contourFour: {
      borderColor: "rgba(16,32,22,0.06)",
      borderRadius: 300,
      borderWidth: 1.5,
      height: 600,
      left: -200,
      position: "absolute",
      top: 300,
      width: 600,
   },
   contourOne: {
      borderColor: "rgba(134,231,184,0.25)",
      borderRadius: 200,
      borderWidth: 1.5,
      height: 400,
      position: "absolute",
      right: -140,
      top: -120,
      width: 400,
   },
   contourThree: {
      borderColor: "rgba(134,231,184,0.12)",
      borderRadius: 160,
      borderWidth: 1,
      height: 320,
      position: "absolute",
      right: -100,
      top: -80,
      width: 320,
   },
   contourTwo: {
      borderColor: "rgba(178,255,168,0.18)",
      borderRadius: 180,
      borderWidth: 1.5,
      height: 360,
      position: "absolute",
      right: -120,
      top: -100,
      width: 360,
   },
   footer: {
      alignItems: "center",
      gap: 10,
      marginTop: 28,
   },
   footerLink: {
      color: "#102016",
      fontWeight: "900",
   },
   footerPressable: {
      alignItems: "center",
      minHeight: 36,
      justifyContent: "center",
      paddingHorizontal: 12,
   },
   footerText: {
      color: "#5a7560",
      fontSize: 14,
   },
   form: {
      gap: 16,
      marginTop: 32,
   },
   googleButton: {
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderColor: "rgba(16,32,22,0.12)",
      borderRadius: 26,
      borderWidth: 1.5,
      flexDirection: "row",
      gap: 10,
      height: 52,
      justifyContent: "center",
      shadowColor: "#102016",
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
   },
   googleButtonText: {
      color: "#102016",
      fontSize: 15,
      fontWeight: "700",
   },
   googleIcon: {
      color: palette.mint,
      fontSize: 18,
      fontWeight: "900",
   },
   hero: {
      gap: 8,
      marginTop: 44,
   },
   heroBody: {
      color: "#5a7560",
      fontSize: 14,
      lineHeight: 21,
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
      fontSize: 38,
      fontWeight: "900",
      letterSpacing: -0.5,
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
   legal: {
      color: "#8fa893",
      fontSize: 11,
      textAlign: "center",
   },
   nav: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
   },
   navBrand: {
      color: "#102016",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 2,
   },
   orLine: {
      backgroundColor: "rgba(16,32,22,0.12)",
      flex: 1,
      height: 1,
   },
   orSection: {
      alignItems: "center",
      flexDirection: "row",
      gap: 14,
      marginVertical: 6,
   },
   orText: {
      color: "#6b8a6f",
      fontSize: 13,
      fontWeight: "600",
   },
   primaryButton: {
      alignItems: "center",
      backgroundColor: "#102016",
      borderRadius: 26,
      flexDirection: "row",
      gap: 10,
      height: 52,
      justifyContent: "center",
      marginTop: 8,
   },
   primaryButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "800",
   },
   trailLine: {
      backgroundColor: "rgba(134,231,184,0.35)",
      height: 80,
      left: 48,
      position: "absolute",
      top: 200,
      transform: [{ rotate: "30deg" }],
      width: 2,
   },
   waypointA: {
      backgroundColor: palette.mint,
      borderRadius: 5,
      height: 10,
      left: 38,
      opacity: 0.6,
      position: "absolute",
      top: 190,
      width: 10,
   },
   waypointB: {
      backgroundColor: palette.bright,
      borderRadius: 4,
      height: 8,
      left: 62,
      opacity: 0.45,
      position: "absolute",
      top: 290,
      width: 8,
   },
});
