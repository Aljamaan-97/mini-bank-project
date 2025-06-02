// /app/(auth)/RegisterScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { register } from "@/Api/auth";
import { setBiometricEnabled, storeToken } from "@/Api/store";
import { useTheme } from "@/assets/theme/ThemeProvider";
import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthContext from "@/context/AuthContext";

export default function RegisterScreen() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const { colors } = useTheme();
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Pick a profile image
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  // Move to protected stack
  const finalize = () => {
    setIsAuthenticated(true);
    router.replace("/(protected)/(tabs)/(home)");
  };

  // React-Query register call
  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: () => register(userName, password, image || ""),
    onError: () => Alert.alert("Registration failed", "Please try again later"),
    onSuccess: async (data) => {
      if (data?.token) await storeToken(data.token);

      Alert.alert(
        "Enable biometric login?",
        "You can use fingerprint / face-ID next time.",
        [
          { text: "Later", style: "cancel", onPress: finalize },
          {
            text: "Enable",
            onPress: async () => {
              await setBiometricEnabled(true);
              finalize();
            },
          },
        ],
        { cancelable: false }
      );
    },
  });

  // Handle “Register” button
  const handleRegister = () => {
    if (!userName.trim() || !password.trim()) {
      return Alert.alert("Missing data", "Please enter username & password");
    }
    mutate();
  };

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
            {/* logo */}
            <Ionicons
              name="cash-outline"
              size={64}
              color={colors.primaryAccent}
              style={styles.logo}
            />

            {/* heading */}
            <Text style={[styles.title, { color: colors.primaryAccent }]}>
              Create an account
            </Text>
            <Text style={[styles.subtitle, { color: colors.primaryText }]}>
              It only takes a minute
            </Text>

            {/* profile image */}
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <View
                style={[
                  styles.avatarWrapper,
                  { backgroundColor: colors.border },
                ]}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.avatar} />
                ) : (
                  <Ionicons
                    name="camera"
                    size={28}
                    color={colors.secondaryText}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* form */}
            <Input
              label="Username"
              placeholder="Username"
              placeholderTextColor={colors.border}
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
            />
            <Input
              label="Password"
              placeholder="Password"
              placeholderTextColor={colors.border}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Button
              title="Register"
              onPress={handleRegister}
              disabled={isPending}
            />

            {/* go to login */}
            <View style={[styles.switchWrapper, { flexDirection: "row" }]}>
              <Text style={{ color: colors.primaryText }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/Login")}>
                <Text style={[styles.link, { color: colors.primaryAccent }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  logo: { marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  link: { textDecorationLine: "underline", fontWeight: "600" },
  switchWrapper: { marginTop: 18 },
});
