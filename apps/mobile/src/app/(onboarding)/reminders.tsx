import { Button, Card, Screen, Text } from "@/components/ui";

export default function OnboardingRemindersScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Reminders</Text>
      <Text variant="title">Set your daily rhythm</Text>
      <Text color="textMuted">
        Morning planning and night reflection prompts can be adjusted later.
      </Text>

      <Card>
        <Text variant="label">Morning</Text>
        <Text>9:00 AM</Text>
      </Card>

      <Card>
        <Text variant="label">Night</Text>
        <Text>9:00 PM</Text>
      </Card>

      <Button label="Finish setup" onPress={() => {}} />
    </Screen>
  );
}
