import { useLocalSearchParams } from "expo-router";

import { OnboardingFlow } from "@/features/onboarding";

export default function Index() {
  const { step } = useLocalSearchParams<{ step?: string }>();

  return <OnboardingFlow initialStep={step === "signup" ? "signup" : undefined} />;
}
