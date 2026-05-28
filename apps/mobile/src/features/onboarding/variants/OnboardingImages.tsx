import { Image, StyleSheet, Text, View } from "react-native";

import { provisionalGreenPalette } from "@/theme";

const palette = provisionalGreenPalette;

const welcomeImages = [
   "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
];

const signupImages = [
   "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=900&q=80",
];

type ImageStageProps = {
   activeSlide: number;
   compact?: boolean;
   label?: string;
   size?: "medium" | "cover";
   tone?: "soft" | "bold" | "clean";
};

export function WelcomeImageStage({
   activeSlide,
   compact = false,
   label = "Today",
   size,
   tone = "soft",
}: ImageStageProps) {
   return (
      <View style={[styles.stage, compact && styles.stageCompact, size === "cover" && styles.stageCover, tone === "bold" && styles.stageBold]}>
         {welcomeImages.map((uri, index) => (
            <Image
               key={uri}
               source={{ uri }}
               style={[styles.stageImage, { opacity: activeSlide === index ? 1 : 0 }]}
            />
         ))}
         <View style={styles.tint} />
         <View style={styles.previewCard}>
            <Text style={styles.previewKicker}>{label}</Text>
            <View style={styles.previewTitle} />
            <View style={styles.previewRow} />
            <View style={[styles.previewRow, styles.previewRowShort]} />
         </View>
      </View>
   );
}

export function SignupImageStage({ activeSlide, compact = false, size, tone = "soft" }: ImageStageProps) {
   return (
      <View style={[styles.signupStage, compact && styles.signupStageCompact, size === "cover" && styles.signupStageCover, size === "medium" && styles.signupStageMedium, tone === "bold" && styles.stageBold]}>
         {signupImages.map((uri, index) => (
            <Image
               key={uri}
               source={{ uri }}
               style={[styles.stageImage, { opacity: activeSlide === index ? 1 : 0 }]}
            />
         ))}
         <View style={styles.signupTint} />
         <View style={styles.signupCut} />
      </View>
   );
}

const styles = StyleSheet.create({
   previewCard: {
      backgroundColor: "rgba(244,249,242,0.92)",
      borderColor: "rgba(255,255,255,0.72)",
      borderRadius: 18,
      borderWidth: 1,
      bottom: 28,
      left: 26,
      padding: 14,
      position: "absolute",
      right: 26,
   },
   previewKicker: {
      color: "#102016",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.2,
      marginBottom: 10,
      textTransform: "uppercase",
   },
   previewRow: {
      backgroundColor: "rgba(16,32,22,0.1)",
      borderRadius: 999,
      height: 9,
      marginTop: 8,
      width: "100%",
   },
   previewRowShort: {
      backgroundColor: "rgba(134,231,184,0.55)",
      width: "62%",
   },
   previewTitle: {
      backgroundColor: "#102016",
      borderRadius: 999,
      height: 12,
      width: "74%",
   },
   signupCut: {
      backgroundColor: "#f4f9f2",
      bottom: -44,
      height: 76,
      left: 0,
      position: "absolute",
      right: 0,
      transform: [{ skewY: "-5deg" }],
   },
   signupStage: {
      borderRadius: 0,
      height: 178,
      marginBottom: 24,
      overflow: "hidden",
      width: "100%",
   },
   signupStageCover: {
      height: 500,
      marginBottom: 0,
   },
   signupStageCompact: {
      height: 150,
   },
   signupStageMedium: {
      height: 330,
      marginBottom: 0,
   },
   signupTint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(16,32,22,0.24)",
   },
   stage: {
      alignSelf: "stretch",
      borderRadius: 0,
      height: 310,
      marginBottom: 16,
      overflow: "hidden",
   },
   stageBold: {
      shadowColor: palette.mint,
      shadowOffset: { height: 18, width: 0 },
      shadowOpacity: 0.16,
      shadowRadius: 30,
   },
   stageCompact: {
      height: 274,
   },
   stageCover: {
      height: 500,
      marginBottom: 0,
   },
   stageImage: {
      ...StyleSheet.absoluteFillObject,
      height: "100%",
      width: "100%",
   },
   tint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(16,32,22,0.18)",
   },
});
