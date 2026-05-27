import { Card, Screen, Text } from "@/components/ui";

export default function SettingsScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Settings</Text>
      <Text variant="title">Preferences</Text>

      <Card>
        <Text variant="label">Reminders</Text>
        <Text color="textMuted">Morning, night, quiet hours, and pending-task nudges.</Text>
      </Card>

      <Card>
        <Text variant="label">Calendar</Text>
        <Text color="textMuted">Google Calendar connection and sync controls.</Text>
      </Card>
    </Screen>
  );
}
