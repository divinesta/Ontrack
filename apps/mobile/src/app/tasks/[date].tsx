import { Button, Card, Screen, Text } from "@/components/ui";

export default function TasksForDateScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Tasks</Text>
      <Text variant="title">Day plan</Text>

      <Card>
        <Text color="textMuted">Pending, done, and skipped tasks placeholder</Text>
      </Card>

      <Button label="Brain dump to plan" onPress={() => {}} />
      <Button label="Add task" variant="secondary" onPress={() => {}} />
    </Screen>
  );
}
