import { Button, Card, Screen, Text } from "@/components/ui";

export default function ReflectionDetailScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Reflection</Text>
      <Text variant="title">Draft and edit</Text>

      <Card>
        <Text color="textMuted">Reflection summary and simple stats placeholder</Text>
      </Card>

      <Button label="Publish reflection" onPress={() => {}} />
    </Screen>
  );
}
