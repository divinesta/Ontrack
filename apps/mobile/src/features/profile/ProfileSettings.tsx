import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text as RNText, TextInput, View } from "react-native";

import { SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

export const ProfileSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Unknown";
  const hasPassword = true;

  const handlePasswordSave = () => {
    setShowPasswordSheet(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SettingsScreen eyebrow="Profile" title="Profile" subtitle="Who you are on OnTrack.">
      {/* Identity Card */}
      <View style={[s.identityCard, { borderRadius: ms(16), padding: ms(16) }]}>
        <View style={s.identityRow}>
          <View style={[s.avatar, { width: ms(44), height: ms(44), borderRadius: ms(14) }]}>
            <RNText style={[s.avatarText, { fontSize: ms(16) }]}>ED</RNText>
          </View>
          <View style={s.identityContent}>
            <RNText style={[s.identityName, { fontSize: ms(15) }]}>Emilola Divine</RNText>
            <RNText style={[s.identityEmail, { fontSize: ms(12) }]}>divine@gmail.com</RNText>
          </View>
          <Pressable style={[s.editBtn, { width: ms(34), height: ms(34), borderRadius: ms(10) }]}>
            <Ionicons name="pencil-outline" size={ms(14)} color={C.dark} />
          </Pressable>
        </View>
      </View>

      {/* Password */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>PASSWORD</RNText>
        <View style={[s.card, { borderRadius: ms(14), padding: ms(14) }]}>
          <View style={s.passwordRow}>
            <Ionicons name="lock-closed-outline" size={ms(16)} color={C.accent} />
            <View style={s.passwordContent}>
              <RNText style={[s.passwordTitle, { fontSize: ms(13) }]}>
                {hasPassword ? "Password set" : "No password"}
              </RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>
                {hasPassword ? "••••••••" : "Set a password for your account"}
              </RNText>
            </View>
            <Pressable
              style={[s.passwordBtn, { borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: ms(5) }]}
              onPress={() => setShowPasswordSheet(true)}
            >
              <RNText style={[s.passwordBtnText, { fontSize: ms(11) }]}>
                {hasPassword ? "Update" : "Set"}
              </RNText>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Providers */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>SIGN-IN</RNText>
        <View style={[s.providersRow, { gap: ms(10) }]}>
          <View style={[s.providerCard, { borderRadius: ms(14), padding: ms(14) }]}>
            <Ionicons name="logo-google" size={ms(20)} color={C.dark} />
            <RNText style={[s.providerName, { fontSize: ms(11), marginTop: ms(6) }]}>Google</RNText>
            <View style={[s.providerStatus, s.providerStatusActive, { borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: ms(2), marginTop: ms(6) }]}>
              <RNText style={[s.providerStatusText, s.providerStatusTextActive, { fontSize: ms(8) }]}>LINKED</RNText>
            </View>
          </View>
          <View style={[s.providerCard, s.providerCardInactive, { borderRadius: ms(14), padding: ms(14) }]}>
            <Ionicons name="logo-apple" size={ms(20)} color={C.muted} />
            <RNText style={[s.providerName, s.providerNameInactive, { fontSize: ms(11), marginTop: ms(6) }]}>Apple</RNText>
            <Pressable style={[s.providerStatus, { borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: ms(2), marginTop: ms(6) }]}>
              <RNText style={[s.providerStatusText, { fontSize: ms(8) }]}>LINK</RNText>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Timezone */}
      <View style={s.section}>
        <RNText style={[s.sectionLabel, { fontSize: ms(11) }]}>TIMEZONE</RNText>
        <View style={[s.card, { borderRadius: ms(14), padding: ms(14) }]}>
          <View style={s.timezoneRow}>
            <Ionicons name="globe-outline" size={ms(16)} color={C.accent} />
            <View style={s.timezoneContent}>
              <RNText style={[s.timezoneValue, { fontSize: ms(13) }]}>{timezone}</RNText>
              <RNText style={[s.hint, { fontSize: ms(11) }]}>Auto-follows device</RNText>
            </View>
          </View>
        </View>
      </View>

      {/* Sign out */}
      <Pressable style={[s.signOutCard, { borderRadius: ms(14), padding: ms(14) }]}>
        <Ionicons name="log-out-outline" size={ms(16)} color={C.muted} />
        <RNText style={[s.signOutText, { fontSize: ms(13) }]}>Sign out</RNText>
      </Pressable>

      {/* Password Bottom Sheet */}
      <Modal transparent animationType="slide" visible={showPasswordSheet} onRequestClose={() => setShowPasswordSheet(false)}>
        <Pressable style={ts.overlay} onPress={() => setShowPasswordSheet(false)}>
          <View style={[ts.sheet, { borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24), paddingBottom: ms(32) }]}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[ts.handle, { width: ms(36), height: ms(4), borderRadius: ms(2), marginTop: ms(12) }]} />
              <RNText style={[ts.sheetTitle, { fontSize: ms(14), marginTop: ms(16), marginBottom: ms(20) }]}>
                Update password
              </RNText>

              <View style={[ts.inputGroup, { gap: ms(12), paddingHorizontal: ms(20) }]}>
                <View style={ts.field}>
                  <RNText style={[ts.fieldLabel, { fontSize: ms(10), marginBottom: ms(6) }]}>NEW PASSWORD</RNText>
                  <TextInput
                    style={[ts.input, { height: ms(44), borderRadius: ms(12), paddingHorizontal: ms(14), fontSize: ms(14) }]}
                    placeholder="Enter new password"
                    placeholderTextColor={C.faded}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>

                <View style={ts.field}>
                  <RNText style={[ts.fieldLabel, { fontSize: ms(10), marginBottom: ms(6) }]}>CONFIRM PASSWORD</RNText>
                  <TextInput
                    style={[ts.input, { height: ms(44), borderRadius: ms(12), paddingHorizontal: ms(14), fontSize: ms(14) }]}
                    placeholder="Confirm new password"
                    placeholderTextColor={C.faded}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              </View>

              <Pressable
                style={[
                  ts.saveBtn,
                  (!newPassword || newPassword !== confirmPassword) && ts.saveBtnDisabled,
                  { height: ms(46), borderRadius: ms(14), marginTop: ms(20), marginHorizontal: ms(20) },
                ]}
                onPress={handlePasswordSave}
                disabled={!newPassword || newPassword !== confirmPassword}
              >
                <RNText style={[ts.saveBtnText, { fontSize: ms(14) }]}>Save password</RNText>
              </Pressable>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SettingsScreen>
  );
};

const s = StyleSheet.create({
  identityCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  identityRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { color: C.dark, fontWeight: "900" },
  identityContent: { flex: 1, gap: 2 },
  identityName: { color: C.text, fontWeight: "900" },
  identityEmail: { color: C.muted, fontWeight: "600" },
  editBtn: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },

  section: { gap: 10 },
  sectionLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1.2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },

  passwordRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  passwordContent: { flex: 1, gap: 1 },
  passwordTitle: { color: C.text, fontWeight: "800" },
  passwordBtn: { backgroundColor: C.accentSoft },
  passwordBtnText: { color: C.dark, fontWeight: "800" },

  providersRow: { flexDirection: "row" },
  providerCard: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  providerCardInactive: { borderStyle: "dashed" },
  providerName: { color: C.text, fontWeight: "800" },
  providerNameInactive: { color: C.muted },
  providerStatus: { backgroundColor: C.darkSoft },
  providerStatusActive: { backgroundColor: C.accentSoft },
  providerStatusText: { color: C.muted, fontWeight: "800", letterSpacing: 0.5 },
  providerStatusTextActive: { color: C.dark },

  timezoneRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  timezoneContent: { flex: 1, gap: 1 },
  timezoneValue: { color: C.text, fontWeight: "800" },
  hint: { color: C.muted, fontWeight: "600" },

  signOutCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center", gap: 10 },
  signOutText: { color: C.muted, fontWeight: "800" },
});

const ts = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: C.card, paddingHorizontal: 0 },
  handle: { backgroundColor: C.borderMedium, alignSelf: "center" },
  sheetTitle: { color: C.text, fontWeight: "900", textAlign: "center" },
  inputGroup: {},
  field: {},
  fieldLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1 },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, color: C.text, fontWeight: "700" },
  saveBtn: { backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: C.dark, fontWeight: "900" },
});
