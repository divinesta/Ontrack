import { Button, Card, ProgressBar, Screen, Text } from "@/components/ui";

export default function TodayScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">Today</Text>
      <Text variant="title">Your daily command center</Text>

      <Card>
        <Text variant="label">Streak</Text>
        <Text variant="headline">0 days</Text>
      </Card>

      <Card>
        <Text variant="label">Month logging rate</Text>
        <ProgressBar value={0.24} />
      </Card>

      <Button label="Capture progress" onPress={() => {}} />
      <Button label="Plan today" variant="secondary" onPress={() => {}} />
    </Screen>
  );
}
