import { Card, Screen, Text } from "@/components/ui";

export default function ReviewScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Review</Text>
      <Text variant="title">Weekly and monthly reflections</Text>

      <Card>
        <Text variant="label">Current month</Text>
        <Text color="textMuted">AI draft, simple stats, and edits will live here.</Text>
      </Card>
    </Screen>
  );
}
