import { Modal, Pressable, ScrollView, StyleSheet, Text as RNText, View } from "react-native";

import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

type BottomSheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  children: React.ReactNode;
};

export const BottomSheet = ({ visible, title, onClose, onConfirm, confirmDisabled, children }: BottomSheetProps) => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />
        <View style={[s.sheet, { borderTopLeftRadius: ms(28), borderTopRightRadius: ms(28) }]}>
          {/* Header */}
          <View style={[s.header, { paddingHorizontal: ms(20), paddingVertical: ms(18) }]}>
            <Pressable onPress={onClose} style={[s.iconBtn, { width: ms(36), height: ms(36), borderRadius: ms(18) }]} hitSlop={10}>
              <RNText style={[s.iconBtnText, { fontSize: ms(14) }]}>✕</RNText>
            </Pressable>
            <RNText style={[s.title, { fontSize: ms(16) }]}>{title}</RNText>
            {onConfirm ? (
              <Pressable
                onPress={onConfirm}
                disabled={confirmDisabled}
                style={[s.iconBtn, s.iconBtnSave, confirmDisabled && s.iconBtnDisabled, { width: ms(36), height: ms(36), borderRadius: ms(18) }]}
                hitSlop={10}
              >
                <RNText style={[s.iconBtnSaveText, { fontSize: ms(14) }]}>✓</RNText>
              </Pressable>
            ) : (
              <View style={{ width: ms(36) }} />
            )}
          </View>

          <ScrollView
            contentContainerStyle={[s.body, { paddingHorizontal: ms(20), paddingTop: ms(20), paddingBottom: ms(40) }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    backgroundColor: "#ffffff",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  title: { color: C.text, fontWeight: "900" },
  iconBtn: {
    backgroundColor: C.darkSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: { color: C.text, fontWeight: "700" },
  iconBtnSave: { backgroundColor: C.dark },
  iconBtnDisabled: { opacity: 0.4 },
  iconBtnSaveText: { color: C.accent, fontWeight: "900" },
  body: { gap: 12 },
});
