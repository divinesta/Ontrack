import { Button, Screen, Text } from "@/components/ui";

export default function SignInScreen() {
  return (
    <Screen>
      <Text variant="eyebrow">OnTrack</Text>
      <Text variant="title">Sign in</Text>
      <Text color="textMuted">
        Start with your account so your logs, plans, and reflections stay in sync.
      </Text>

      <Button label="Continue with Apple" onPress={() => {}} />
      <Button label="Continue with Google" variant="secondary" onPress={() => {}} />
    </Screen>
  );
}
