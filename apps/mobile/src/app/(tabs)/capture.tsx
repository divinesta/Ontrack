import { Button, Card, Screen, Text } from "@/components/ui";

export default function CaptureScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Capture</Text>
      <Text variant="title">Log by text or voice</Text>

      <Card>
        <Text color="textMuted">Entry composer placeholder</Text>
      </Card>

      <Button label="Start voice note" onPress={() => {}} />
      <Button label="Save entry" variant="secondary" onPress={() => {}} />
    </Screen>
  );
}
