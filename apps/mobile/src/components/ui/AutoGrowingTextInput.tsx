import { forwardRef, useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputContentSizeChangeEventData,
  TextInputProps,
  TextStyle,
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
  const [contentHeight, setContentHeight] = useState(minHeight);
  const previousValueLength = useRef(typeof props.value === "string" ? props.value.length : 0);
  const resolvedMaxHeight = maxHeight ?? (maxHeightMultiplier ? minHeight * maxHeightMultiplier : undefined);
  const height = resolvedMaxHeight ? Math.min(Math.max(contentHeight, minHeight), resolvedMaxHeight) : Math.max(contentHeight, minHeight);
  const shouldScroll = scrollEnabled ?? (resolvedMaxHeight ? contentHeight > resolvedMaxHeight : false);

  useEffect(() => {
    if (typeof props.value !== "string") return;

    if (props.value.length === 0 || props.value.length < previousValueLength.current) {
      setContentHeight(minHeight);
    }

    previousValueLength.current = props.value.length;
  }, [minHeight, props.value]);

  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    setContentHeight(event.nativeEvent.contentSize.height);
    onContentSizeChange?.(event);
  };

  const handleChangeText = (text: string) => {
    if (text.length === 0 || text.length < previousValueLength.current) {
      setContentHeight(minHeight);
    }

    previousValueLength.current = text.length;
    onChangeText?.(text);
  };

  return (
    <TextInput
      ref={ref}
      {...props}
      multiline={multiline}
      onChangeText={handleChangeText}
      onContentSizeChange={handleContentSizeChange}
      scrollEnabled={shouldScroll}
      style={[
        style,
        inputStyle,
        {
          flexGrow: 0,
          flexShrink: 0,
          height,
          maxHeight: resolvedMaxHeight,
          minHeight,
          textAlignVertical: "top",
        },
      ]}
    />
  );
});
