import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { provisionalGreenPalette } from "@/theme";

import { SignupImageStage, WelcomeImageStage } from "./OnboardingImages";

const palette = provisionalGreenPalette;

type Step = "welcome" | "needs" | "categories" | "notifications" | "pricing" | "signup";
const STEPS: Step[] = ["welcome", "needs", "categories", "notifications", "pricing", "signup"];

const needs = [
   { key: "organize", label: "Organize my day" },
   { key: "remember", label: "Remember tasks" },
   { key: "habits", label: "Build routines" },
   { key: "focus", label: "Focus better" },
   { key: "reflect", label: "Reflect more" },
];

const categories = [
   { emoji: "💼", label: "Work" },
   { emoji: "🏋️", label: "Fitness" },
   { emoji: "📚", label: "Learning" },
   { emoji: "🧘", label: "Wellness" },
   { emoji: "🙏", label: "Faith" },
   { emoji: "🎨", label: "Creative" },
   { emoji: "👥", label: "Social" },
   { emoji: "🏡", label: "Home" },
];

type OnboardingFlowBProps = {
   initialStep?: Step;
};

export function OnboardingFlowB({ initialStep = "welcome" }: OnboardingFlowBProps) {
   const router = useRouter();
   const [step, setStep] = useState<Step>(initialStep);
   const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [activeSlide, setActiveSlide] = useState(0);
   const canContinueCategories = selectedCategories.length >= 3;

   useEffect(() => {
      const interval = setInterval(() => setActiveSlide((p) => (p + 1) % 3), 2800);
      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      setStep(initialStep);
   }, [initialStep]);

   const next = useCallback(() => {
      const index = STEPS.indexOf(step);
      if (index < STEPS.length - 1) setStep(STEPS[index + 1]);
   }, [step]);

   const skipCategories = useCallback(() => setStep("notifications"), []);
   const toggleNeed = (key: string) =>
      setSelectedNeeds((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);

   const toggleCategory = (category: string) =>
      setSelectedCategories((current) => {
         if (current.includes(category)) return current.filter((item) => item !== category);
         if (current.length >= 5) return current;
         return [...current, category];
      });

   return (
      <SafeAreaView style={s.screen}>
         <View style={s.bgCircleA} />
         <View style={s.bgCircleB} />
         <View style={s.bgLineA} />
         <View style={s.bgLineB} />

         {(step === "categories" || step === "notifications" || step === "pricing") && (
            <View style={s.skipRow}>
               <Pressable hitSlop={12} onPress={step === "categories" ? skipCategories : next}>
                  <Text style={s.skipText}>Skip</Text>
               </Pressable>
            </View>
         )}

         {step === "welcome" && (
            <View style={s.mediaScreen}>
               <WelcomeImageStage activeSlide={activeSlide} label="Progress log" tone="bold" size="cover" />
               <View style={s.welcomeBottom}>
                  <Text style={s.heroTitle}>Progress Tracker{"\n"}with a calmer rhythm.</Text>
                  <Text style={s.heroBody}>Your all-in-one productivity companion.</Text>
                  <Pressable style={s.primaryButton} onPress={next}>
                     <Text style={s.primaryButtonText}>Get Started</Text>
                  </Pressable>
                  <Pressable hitSlop={12} onPress={() => router.push("/sign-in")} style={s.linkWrap}>
                     <Text style={s.linkText}>Already have an account? <Text style={s.linkBold}>Log in here</Text></Text>
                  </Pressable>
               </View>
            </View>
         )}

         {step === "needs" && (
            <View style={s.plainScreen}>
               <View>
                  <Text style={s.title}>What’s your biggest{"\n"}need right now?</Text>
                  <Text style={s.body}>Pick what you most need help with in your daily life.</Text>
                  <View style={s.needsList}>
                     {needs.map(({ key, label }) => {
                        const selected = selectedNeeds.includes(key);
                        return (
                           <Pressable key={key} onPress={() => toggleNeed(key)} style={[s.needRow, selected && s.needRowOn]}>
                              <Text style={[s.needText, selected && s.needTextOn]}>{label}</Text>
                              {selected && <View style={s.needDot} />}
                           </Pressable>
                        );
                     })}
                  </View>
               </View>
               <Pressable style={s.primaryButton} onPress={next}>
                  <Text style={s.primaryButtonText}>Continue</Text>
               </Pressable>
            </View>
         )}

         {step === "categories" && (
            <View style={s.plainScreen}>
               <View>
                  <Text style={s.title}>What do you want{"\n"}to track?</Text>
                  <Text style={s.body}>Choose 3-5 areas. Defaults are ready if you skip.</Text>
                  <View style={s.emojiGrid}>
                     {categories.map(({ emoji, label }) => {
                        const selected = selectedCategories.includes(label);
                        return (
                           <Pressable key={label} onPress={() => toggleCategory(label)} style={[s.emojiChip, selected && s.emojiChipOn]}>
                              <Text style={s.emoji}>{emoji}</Text>
                              <Text style={[s.emojiLabel, selected && s.emojiLabelOn]}>{label}</Text>
                           </Pressable>
                        );
                     })}
                  </View>
               </View>
               <Pressable disabled={!canContinueCategories} style={[s.primaryButton, !canContinueCategories && s.primaryButtonDisabled]} onPress={next}>
                  <Text style={s.primaryButtonText}>{canContinueCategories ? "Continue" : "Choose at least 3"}</Text>
               </Pressable>
            </View>
         )}

         {step === "notifications" && (
            <View style={s.plainScreen}>
               <View style={s.notificationTop}>
                  <Text style={s.title}>Gentle nudges,{"\n"}not noise</Text>
                  <Text style={s.body}>A morning plan and evening reflection. You can adjust both later.</Text>
                  <View style={s.reminders}>
                     <View style={s.reminderCard}>
                        <Text style={s.reminderEmoji}>🌅</Text>
                        <View style={s.reminderInfo}><Text style={s.reminderName}>Morning plan</Text><Text style={s.reminderTime}>9:00 AM</Text></View>
                        <View style={s.reminderToggle}><View style={s.toggleKnob} /></View>
                     </View>
                     <View style={s.reminderCard}>
                        <Text style={s.reminderEmoji}>🌙</Text>
                        <View style={s.reminderInfo}><Text style={s.reminderName}>Evening reflect</Text><Text style={s.reminderTime}>9:00 PM</Text></View>
                        <View style={s.reminderToggle}><View style={s.toggleKnob} /></View>
                     </View>
                  </View>
               </View>
               <Pressable style={s.primaryButton} onPress={next}>
                  <Text style={s.primaryButtonText}>Enable Notifications</Text>
               </Pressable>
            </View>
         )}

         {step === "pricing" && (
            <View style={s.priceScreen}>
               <Text style={s.priceTitle}>Start simple.{"\n"}Grow when ready.</Text>
               <View style={s.planRow}>
                  <View style={s.planCard}>
                     <Text style={s.planName}>Monthly</Text>
                     <Text style={s.planPrice}>$2</Text>
                     <Text style={s.planDesc}>billed monthly</Text>
                  </View>
                  <View style={[s.planCard, s.planCardActive]}>
                     <View style={s.badge}><Text style={s.badgeText}>BEST VALUE</Text></View>
                     <Text style={s.planName}>Yearly</Text>
                     <Text style={s.planPrice}>$20</Text>
                     <Text style={s.planDesc}>billed yearly</Text>
                  </View>
               </View>
               <View style={s.reviewBlock}>
                  <Text style={s.reviewTitle}>Built for remembering your year</Text>
                  <Text style={s.stars}>★★★★★</Text>
                  <Text style={s.reviewText}>“Finally, a calm place for plans, logs, and reflection.”</Text>
               </View>
               <View>
                  <Pressable style={s.trialButton} onPress={next}>
                     <Text style={s.trialButtonText}>Start 7 days free trial</Text>
                  </Pressable>
                  <Text style={s.trialFinePrint}>7 days free, then $20/yr. Cancel anytime.</Text>
               </View>
            </View>
         )}

         {step === "signup" && (
            <View style={s.mediaScreen}>
               <SignupImageStage activeSlide={activeSlide} tone="bold" size="cover" />
               <View style={s.signupBottom}>
                  <Text style={s.title}>Sign up to OnTrack</Text>
                  <Text style={s.body}>One account to keep everything in sync.</Text>
                  <View style={s.authBtns}>
                     <Pressable style={s.googleBtn}>
                        <Text style={s.gIcon}>G</Text>
                        <Text style={s.gText}>Continue with Google</Text>
                     </Pressable>
                     <Pressable style={s.emailBtn} onPress={() => router.push("/sign-up")}>
                        <Text style={s.emailBtnText}>Sign up with email</Text>
                     </Pressable>
                  </View>
                  <Pressable hitSlop={12} onPress={() => router.push("/sign-in")} style={s.linkWrap}>
                     <Text style={s.linkText}>Already have an account? <Text style={s.linkBold}>Log in here</Text></Text>
                  </Pressable>
               </View>
            </View>
         )}
      </SafeAreaView>
   );
}

const s = StyleSheet.create({
   authBtns: { gap: 12, width: "100%" },
   badge: { alignSelf: "center", backgroundColor: palette.mint, borderRadius: 999, marginBottom: 10, marginTop: -32, paddingHorizontal: 14, paddingVertical: 7 },
   badgeText: { color: "#102016", fontSize: 11, fontWeight: "900", letterSpacing: 1 },
   bgCircleA: { borderColor: "rgba(134,231,184,0.25)", borderRadius: 220, borderWidth: 1.5, height: 440, left: -180, position: "absolute", top: -60, width: 440 },
   bgCircleB: { borderColor: "rgba(16,32,22,0.05)", borderRadius: 180, borderWidth: 1.5, bottom: -100, height: 360, position: "absolute", right: -120, width: 360 },
   bgLineA: { backgroundColor: "rgba(134,231,184,0.3)", height: 120, position: "absolute", right: 60, top: 100, transform: [{ rotate: "35deg" }], width: 2 },
   bgLineB: { backgroundColor: "rgba(178,255,168,0.2)", bottom: 200, height: 80, left: 40, position: "absolute", transform: [{ rotate: "-20deg" }], width: 2 },
   body: { color: "#5a7560", fontSize: 14, lineHeight: 20, marginBottom: 20 },
   emailBtn: { alignItems: "center", backgroundColor: "#102016", borderRadius: 24, height: 46, justifyContent: "center" },
   emailBtnText: { color: "#ffffff", fontSize: 15, fontWeight: "800" },
   emoji: { fontSize: 16 },
   emojiChip: { alignItems: "center", backgroundColor: "#ffffff", borderColor: "rgba(16,32,22,0.1)", borderRadius: 14, borderWidth: 1.5, flexDirection: "row", gap: 8, paddingHorizontal: 14, paddingVertical: 10 },
   emojiChipOn: { backgroundColor: "rgba(134,231,184,0.12)", borderColor: palette.mint },
   emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
   emojiLabel: { color: "#5a7560", fontSize: 14, fontWeight: "700" },
   emojiLabelOn: { color: "#102016", fontWeight: "900" },
   gIcon: { color: palette.mint, fontSize: 18, fontWeight: "900" },
   gText: { color: "#102016", fontSize: 15, fontWeight: "800" },
   googleBtn: { alignItems: "center", backgroundColor: "#ffffff", borderColor: "rgba(16,32,22,0.12)", borderRadius: 24, borderWidth: 1.5, flexDirection: "row", gap: 10, height: 46, justifyContent: "center" },
   heroBody: { color: "#5a7560", fontSize: 15, textAlign: "center" },
   heroTitle: { color: "#102016", fontSize: 29, fontWeight: "900", letterSpacing: -0.5, lineHeight: 34, marginBottom: 8, textAlign: "center" },
   linkBold: { color: "#102016", fontWeight: "900" },
   linkText: { color: "#5a7560", fontSize: 14, textAlign: "center" },
   linkWrap: { alignItems: "center", paddingVertical: 8 },
   mediaScreen: { flex: 1 },
   needDot: { backgroundColor: palette.mint, borderRadius: 5, height: 10, width: 10 },
   needRow: { alignItems: "center", backgroundColor: "#ffffff", borderColor: "rgba(16,32,22,0.1)", borderRadius: 24, borderWidth: 1.5, flexDirection: "row", height: 48, justifyContent: "space-between", paddingHorizontal: 18 },
   needRowOn: { borderColor: palette.mint },
   needText: { color: "#5a7560", fontSize: 15, fontWeight: "700" },
   needTextOn: { color: "#102016", fontWeight: "900" },
   needsList: { gap: 10 },
   notificationTop: { paddingTop: 22 },
   planCard: { alignItems: "center", backgroundColor: "#1d1d1d", borderColor: "#343434", borderRadius: 24, borderWidth: 1.5, flex: 1, minHeight: 164, padding: 18 },
   planCardActive: { borderColor: "#ffffff", borderWidth: 2 },
   planDesc: { color: "#d7d0d0", fontSize: 13, textAlign: "center" },
   planName: { color: "#ffffff", fontSize: 14, fontWeight: "900", letterSpacing: 0.8, marginBottom: 14, textTransform: "uppercase" },
   planPrice: { color: "#ffffff", fontSize: 34, fontWeight: "900", marginBottom: 8 },
   planRow: { flexDirection: "row", gap: 16 },
   plainScreen: { flex: 1, justifyContent: "space-between", paddingBottom: 34, paddingHorizontal: 32, paddingTop: 52 },
   priceScreen: { backgroundColor: "#000000", flex: 1, justifyContent: "space-between", paddingBottom: 34, paddingHorizontal: 24, paddingTop: 54 },
   priceTitle: { color: "#ffffff", fontFamily: "serif", fontSize: 39, lineHeight: 47, textAlign: "center" },
   primaryButton: { alignItems: "center", backgroundColor: "#102016", borderRadius: 24, height: 48, justifyContent: "center", width: "100%", marginTop: 32 },
   primaryButtonDisabled: { backgroundColor: "rgba(16,32,22,0.18)" },
   primaryButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
   reminderCard: { alignItems: "center", backgroundColor: "#ffffff", borderColor: "rgba(16,32,22,0.08)", borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: 14, height: 62, paddingHorizontal: 16 },
   reminderEmoji: { fontSize: 22 },
   reminderInfo: { flex: 1 },
   reminderName: { color: "#102016", fontSize: 14, fontWeight: "800" },
   reminderTime: { color: "#5a7560", fontSize: 12, marginTop: 2 },
   reminders: { gap: 12 },
   reminderToggle: { backgroundColor: palette.mint, borderRadius: 12, height: 24, justifyContent: "center", paddingHorizontal: 2, width: 42 },
   reviewBlock: { alignItems: "center", gap: 10 },
   reviewText: { color: "#ffffff", fontSize: 18, lineHeight: 24, textAlign: "center" },
   reviewTitle: { color: "#ffffff", fontSize: 24, fontWeight: "800", textAlign: "center" },
   screen: { backgroundColor: "#f4f9f2", flex: 1, overflow: "hidden" },
   signupBottom: { bottom: 28, left: 32, position: "absolute", right: 32 },
   skipRow: { alignItems: "flex-end", paddingHorizontal: 32, paddingTop: 8 },
   skipText: { color: "#5a7560", fontSize: 14, fontWeight: "800" },
   stars: { color: "#cbd2ff", fontSize: 34, letterSpacing: 3 },
   title: { color: "#102016", fontSize: 30, fontWeight: "900", letterSpacing: -0.4, lineHeight: 36, marginBottom: 8 },
   toggleKnob: { alignSelf: "flex-end", backgroundColor: "#ffffff", borderRadius: 10, height: 20, width: 20 },
   trialButton: { alignItems: "center", backgroundColor: "#f8f0ea", borderRadius: 26, height: 56, justifyContent: "center" },
   trialButtonText: { color: "#090909", fontSize: 20, fontWeight: "900" },
   trialFinePrint: { color: "#ffffff", fontSize: 15, lineHeight: 22, marginTop: 14, textAlign: "center" },
   welcomeBottom: { bottom: 68, left: 32, position: "absolute", right: 32 },
});
