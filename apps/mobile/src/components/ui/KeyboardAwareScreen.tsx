import { PropsWithChildren } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

type KeyboardAwareScreenProps = PropsWithChildren<{
  behavior?: KeyboardAvoidingViewProps["behavior"];
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
  safeAreaEdges?: Edge[];
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function KeyboardAwareScreen({
  behavior,
  children,
  contentContainerStyle,
  keyboardVerticalOffset = 0,
  safeAreaEdges,
  scrollEnabled = true,
  style,
}: KeyboardAwareScreenProps) {
  const keyboardBehavior = behavior ?? (Platform.OS === "ios" ? "padding" : "height");
  const content = scrollEnabled ? (
    <ScrollView
      bounces={false}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedContent, contentContainerStyle]}>{children}</View>
  );
  const body = scrollEnabled ? (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      {content}
    </TouchableWithoutFeedback>
  ) : (
    content
  );

  return (
    <SafeAreaView edges={safeAreaEdges} style={[styles.safeArea, style]}>
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.keyboardView}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  fixedContent: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
