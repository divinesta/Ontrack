import { Button, Chip, Screen, Text } from "@/components/ui";

const starterCategories = ["Work/Projects", "Learning", "Personal", "Health", "Faith"];

export default function OnboardingCategoriesScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Quick start</Text>
      <Text variant="title">Choose your first areas</Text>
      <Text color="textMuted">Pick 3 to 5 areas OnTrack should organize your entries around.</Text>

      {starterCategories.map((category) => (
        <Chip key={category} label={category} selected={category !== "Health"} />
      ))}

      <Button label="Continue" onPress={() => {}} />
    </Screen>
  );
}
