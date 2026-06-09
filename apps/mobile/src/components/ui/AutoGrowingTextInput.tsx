import { forwardRef, useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text as NativeText,
  StyleProp,
  TextInput,
  TextInputContentSizeChangeEventData,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";

type AutoGrowingTextInputProps = TextInputProps & {
  inputStyle?: StyleProp<TextStyle>;
  maxHeight?: number;
  maxHeightMultiplier?: number;
  minHeight: number;
};

export const AutoGrowingTextInput = forwardRef<TextInput, AutoGrowingTextInputProps>(function AutoGrowingTextInput(
  {
    inputStyle,
    maxHeight,
    maxHeightMultiplier,
    minHeight,
    multiline = true,
    onContentSizeChange,
    onChangeText,
    scrollEnabled,
    style,
    ...props
  },
  ref,
) {
  const initialText = typeof props.value === "string" ? props.value : typeof props.defaultValue === "string" ? props.defaultValue : "";
  const [contentHeight, setContentHeight] = useState(minHeight);
  const [measureText, setMeasureText] = useState(initialText);
  const resolvedMaxHeight = maxHeight ?? (maxHeightMultiplier ? minHeight * maxHeightMultiplier : undefined);
  const height = resolvedMaxHeight ? Math.min(Math.max(contentHeight, minHeight), resolvedMaxHeight) : Math.max(contentHeight, minHeight);
  const shouldScroll = scrollEnabled ?? (resolvedMaxHeight ? contentHeight > resolvedMaxHeight : false);

  useEffect(() => {
    if (typeof props.value !== "string") return;

    setMeasureText(props.value);

    if (props.value.length === 0) {
      setContentHeight(minHeight);
    }
  }, [minHeight, props.value]);

  const handleMeasureLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    onContentSizeChange?.(event);
  };

  const handleChangeText = (text: string) => {
    setMeasureText(text);

    if (text.length === 0) {
      setContentHeight(minHeight);
    }

    onChangeText?.(text);
  };

  return (
    <View style={[styles.container, { height, maxHeight: resolvedMaxHeight, minHeight }]}>
      <TextInput
        ref={ref}
        {...props}
        multiline={multiline}
        onChangeText={handleChangeText}
        onContentSizeChange={handleContentSizeChange}
        scrollEnabled={shouldScroll}
        style={[
          styles.input,
          style,
          inputStyle,
          {
            height,
            maxHeight: resolvedMaxHeight,
            minHeight,
            textAlignVertical: "top",
          },
        ]}
      />
      <NativeText
        accessibilityElementsHidden
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        onLayout={handleMeasureLayout}
        style={[styles.measure, style, inputStyle]}
      >
        {measureText || " "}
      </NativeText>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 0,
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
  },
  measure: {
    left: 0,
    opacity: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: -1,
  },
});
