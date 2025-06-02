// /app/(protected)/(settings)/SettingsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Appearance,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { isBiometricEnabled, setBiometricEnabled } from "@/Api/store";
import { useTheme } from "@/assets/theme/ThemeProvider"; // للألوان الفاتح/الداكن
import Button from "@/components/Button"; // زرّك الموحّد
import LogOut from "@/components/LogOut";

/* ثابت ألوان احتياطي (يُستخدم لو لم تستورد من ThemeProvider) */
const COLORS = {
  primary: "#1E3D58",
  accent: "#00A8E8",
  lightText: "#FFFFFF",
  border: "#C5CED8",
  background: "#F4F6F9",
};

const SettingsScreen: React.FC = () => {
  const { colors, scheme, toggleTheme } = useTheme(); // استعمل ألوان الثيم
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bioEnabled, setBio] = useState(false);
  const [themeMode, setThemeMode] = useState<"auto" | "light" | "dark">("auto");

  /* ─── تحميل حالة البصمة عند فتح الشاشة ─── */
  useEffect(() => {
    (async () => setBio(await isBiometricEnabled()))();
  }, []);

  /* ─── اختيار صورة شخصية ─── */
  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled) setAvatar(res.assets[0].uri);
  };

  /* ─── حفظ الصورة في الخادم ─── */
  const { mutate: saveAvatar, isPending } = useMutation({
    mutationKey: ["update-avatar"],
    mutationFn: async () => {
      if (!avatar) throw new Error("No image selected");
      // TODO: استدعِ API فعليًا، مثال:
      // await updateProfile({ avatar });
    },
    onSuccess: () => Alert.alert("Success", "Image updated 👍"),
    onError: () => Alert.alert("Error", "Something went wrong 😔"),
  });

  /* ─── تفعيل / إلغاء البصمة ─── */
  const toggleBiometric = async (value: boolean) => {
    setBio(value);
    await setBiometricEnabled(value);
  };

  /* ─── روابط التواصل ─── */
  const openLink = (url: string) =>
    Linking.openURL(url).catch((err) => console.warn("Cannot open url:", err));

  /* ─── تغيير الثيم (auto/light/dark) ─── */
  const onSelectTheme = (mode: "auto" | "light" | "dark") => {
    setThemeMode(mode);
    if (mode === "auto") {
      const sys = Appearance.getColorScheme() || "light";
      if (scheme !== sys) toggleTheme();
    } else if (mode === "light" && scheme === "dark") {
      toggleTheme();
    } else if (mode === "dark" && scheme === "light") {
      toggleTheme();
    }
  };

  /* ─── أيقونة الراديو بناءً على الاختيار ─── */
  const RadioButton: React.FC<{ selected: boolean }> = ({ selected }) => (
    <Ionicons
      name={selected ? "radio-button-on" : "radio-button-off"}
      size={20}
      color={selected ? colors.primaryAccent : colors.secondaryText}
    />
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* صورة الملف الشخصي */}
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <Ionicons name="camera" size={28} color={COLORS.lightText} />
              )}
            </TouchableOpacity>
            <Text style={[styles.sectionLabel, { color: colors.primaryText }]}>
              Profile Picture
            </Text>

            {/* زر الحفظ */}
            <Button
              title="Save photo"
              onPress={saveAvatar}
              disabled={!avatar || isPending}
            />

            {/* تقسيم الثيم */}
            <View style={[styles.sectionContainer]}>
              <Text
                style={[styles.sectionLabel, { color: colors.primaryText }]}
              >
                Theme Mode
              </Text>
              {(["auto", "light", "dark"] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={styles.radioRow}
                  onPress={() => onSelectTheme(mode)}
                >
                  <RadioButton selected={themeMode === mode} />
                  <Text
                    style={[
                      styles.radioLabel,
                      {
                        color:
                          themeMode === mode
                            ? colors.primaryText
                            : colors.secondaryText,
                      },
                    ]}
                  >
                    {mode === "auto"
                      ? "Automatic"
                      : mode === "light"
                      ? "Light"
                      : "Dark"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* روابط التواصل الاجتماعي */}
            <View style={styles.socialContainer}>
              <Text
                style={[styles.sectionLabel, { color: colors.primaryText }]}
              >
                Connect with us
              </Text>

              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openLink("https://wa.me/96565115465")}
                >
                  <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() =>
                    openLink("https://instagram.com/your_username")
                  }
                >
                  <Ionicons name="logo-instagram" size={32} color="#C13584" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openLink("https://x.com/your_username")}
                >
                  <FontAwesome6 name="x-twitter" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* مفتاح تفعيل البصمة */}
              <View style={styles.row}>
                <Text style={[styles.rowLabel, { color: colors.primaryText }]}>
                  Biometric Login
                </Text>
                <Switch value={bioEnabled} onValueChange={toggleBiometric} />
                <LogOut />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SettingsScreen;

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 60,
  },
  avatarWrapper: {
    backgroundColor: COLORS.primary,
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  sectionLabel: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  sectionContainer: { width: "100%", marginBottom: 32 },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioLabel: { fontSize: 16, marginLeft: 8 },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  rowLabel: { fontSize: 16 },
  socialContainer: {
    width: "100%",
    marginTop: 32,
    marginBottom: 24,
    alignItems: "center",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  socialButton: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.lightText,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  clearAmountButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  error: { fontWeight: "bold", textAlign: "center" },
});
