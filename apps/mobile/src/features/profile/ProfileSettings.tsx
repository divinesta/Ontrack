import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text as RNText, TextInput, View } from "react-native";

import { BottomSheet, SettingsScreen } from "@/components/ui";
import { palette as C } from "@/features/journal/colors";
import { useResponsiveMetrics } from "@/theme";

type SheetType = "profile" | "password" | null;

export const ProfileSettings = () => {
  const r = useResponsiveMetrics();
  const ms = r.moderateScale;

  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  // Profile edit state
  const [name, setName] = useState("Emilola Divine");
  const [email, setEmail] = useState("divine@gmail.com");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Unknown";
  const hasPassword = true;

  const openProfileSheet = () => {
    setEditName(name);
    setEditEmail(email);
    setActiveSheet("profile");
  };

  const handleProfileSave = () => {
    setName(editName);
    setEmail(editEmail);
    setActiveSheet(null);
  };

  const handlePasswordSave = () => {
    setActiveSheet(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <SettingsScreen eyebrow="Profile" title="Profile" subtitle="Who you are on OnTrack.">
      {/* Identity Card */}
      <View style={[s.identityCard, { borderRadius: ms(16), padding: ms(16) }]}>
        <View style={s.identityRow}>
          <View style={[s.avatar, { width: ms(44), height: ms(44), borderRadius: ms(14) }]}>
            <RNText style={[s.avatarText, { fontSize: ms(16) }]}>{initials}</RNText>
          </View>
          <View style={s.identityContent}>
            <RNText style={[s.identityName, { fontSize: ms(15) }]}>{name}</RNText>
            <RNText style={[s.identityEmail, { fontSize: ms(12) }]}>{email}</RNText>
          </View>
          <Pressable style={[s.editBtn, { width: ms(34), height: ms(34), borderRadius: ms(10) }]} onPress={openProfileSheet}>
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
              onPress={() => setActiveSheet("password")}
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

      {/* Edit Profile Sheet */}
      <BottomSheet
        visible={activeSheet === "profile"}
        title="Edit profile"
        onClose={() => setActiveSheet(null)}
        onConfirm={handleProfileSave}
        confirmDisabled={!editName.trim() || !editEmail.trim()}
      >
        <View style={{ gap: ms(12) }}>
          {/* Avatar */}
          <View style={ts.avatarSection}>
            <View style={[ts.avatarLarge, { width: ms(64), height: ms(64), borderRadius: ms(22) }]}>
              <RNText style={[ts.avatarLargeText, { fontSize: ms(22) }]}>{initials}</RNText>
            </View>
            <Pressable style={[ts.changePhotoBtn, { borderRadius: ms(8), paddingHorizontal: ms(12), paddingVertical: ms(6) }]}>
              <RNText style={[ts.changePhotoText, { fontSize: ms(11) }]}>Change photo</RNText>
            </Pressable>
          </View>

          {/* Name */}
          <View style={ts.field}>
            <RNText style={[ts.fieldLabel, { fontSize: ms(10), marginBottom: ms(6) }]}>NAME</RNText>
            <TextInput
              style={[ts.input, { height: ms(44), borderRadius: ms(12), paddingHorizontal: ms(14), fontSize: ms(14) }]}
              placeholder="Your name"
              placeholderTextColor={C.faded}
              value={editName}
              onChangeText={setEditName}
            />
          </View>

          {/* Email */}
          <View style={ts.field}>
            <RNText style={[ts.fieldLabel, { fontSize: ms(10), marginBottom: ms(6) }]}>EMAIL</RNText>
            <TextInput
              style={[ts.input, { height: ms(44), borderRadius: ms(12), paddingHorizontal: ms(14), fontSize: ms(14) }]}
              placeholder="Your email"
              placeholderTextColor={C.faded}
              keyboardType="email-address"
              autoCapitalize="none"
              value={editEmail}
              onChangeText={setEditEmail}
            />
          </View>
        </View>
      </BottomSheet>

      {/* Password Sheet */}
      <BottomSheet
        visible={activeSheet === "password"}
        title="Update password"
        onClose={() => { setActiveSheet(null); setNewPassword(""); setConfirmPassword(""); }}
        onConfirm={handlePasswordSave}
        confirmDisabled={!newPassword || newPassword !== confirmPassword}
      >
        <View style={{ gap: ms(12) }}>
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
      </BottomSheet>
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
  avatarSection: { alignItems: "center", gap: 10, paddingBottom: 8 },
  avatarLarge: { backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  avatarLargeText: { color: C.dark, fontWeight: "900" },
  changePhotoBtn: { backgroundColor: C.darkSoft },
  changePhotoText: { color: C.text, fontWeight: "800" },
  field: {},
  fieldLabel: { color: C.muted, fontWeight: "800", letterSpacing: 1 },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, color: C.text, fontWeight: "700" },
});
