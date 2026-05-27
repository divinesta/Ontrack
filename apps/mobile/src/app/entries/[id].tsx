import { Button, Card, Screen, Text } from "@/components/ui";

export default function EntryDetailScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Entry</Text>
      <Text variant="title">Edit log</Text>

      <Card>
        <Text color="textMuted">Entry detail and category controls placeholder</Text>
      </Card>

      <Button label="Save changes" onPress={() => {}} />
    </Screen>
  );
}
