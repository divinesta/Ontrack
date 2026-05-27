import { Card, Screen, Text } from "@/components/ui";

export default function CalendarScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Calendar</Text>
      <Text variant="title">Month and agenda</Text>

      <Card>
        <Text variant="label">Selected day</Text>
        <Text color="textMuted">Native tasks and imported calendar items will appear here.</Text>
      </Card>
    </Screen>
  );
}
