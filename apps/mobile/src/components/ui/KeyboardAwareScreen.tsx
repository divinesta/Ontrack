import { PropsWithChildren } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type KeyboardAwareScreenProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}>;

export function KeyboardAwareScreen({
  children,
  contentContainerStyle,
  style,
}: KeyboardAwareScreenProps) {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
          <ScrollView
            bounces={false}
            contentContainerStyle={[styles.content, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
