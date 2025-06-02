// /app/(auth)/LoginScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as LocalAuth from "expo-local-authentication";
import { Redirect, router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
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

import { login } from "@/Api/auth";
import {
  isBiometricEnabled,
  setBiometricEnabled,
  storeToken,
} from "@/Api/store";
import { useTheme } from "@/assets/theme/ThemeProvider";
import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthContext from "@/context/AuthContext";

export default function LoginScreen() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { colors } = useTheme();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [canBio, setCanBio] = useState(false);

  // Check if the device supports biometric auth and if the user enabled it
  useEffect(() => {
    (async () => {
      const hardware = await LocalAuth.hasHardwareAsync();
      const enrolled = await LocalAuth.isEnrolledAsync();
      const enabled = await isBiometricEnabled();
      setCanBio(hardware && enrolled && enabled);
    })();
  }, []);

  // Move to protected stack
  const finalize = () => {
    setIsAuthenticated(true);
    router.replace("/(protected)/(tabs)/(home)");
  };

  // React-Query login call
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login({ username: userName, password }),
    onError: () => Alert.alert("Login failed", "Wrong username or password"),
    onSuccess: async (data) => {
      await storeToken(data.token);
      Alert.alert(
        "Enable biometric login?",
        "You can use fingerprint / face-ID next time.",
        [
          { text: "Later", style: "cancel", onPress: finalize },
          {
            text: "Enable",
            onPress: async () => {
              await setBiometricEnabled(true);
              setCanBio(true);
              finalize();
            },
          },
        ],
        { cancelable: false }
      );
    },
  });

  // Trigger biometric auth
  const handleBiometric = async () => {
    const { success } = await LocalAuth.authenticateAsync({
      promptMessage: "Login with biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });
    if (success) finalize();
  };

  // Handle “Login” button
  const handleLogin = () => {
    if (!userName.trim() || !password.trim()) {
      return Alert.alert("Missing data", "Please fill all fields");
    }
    mutate();
  };

  // Already logged in? → redirect
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/(home)" />;
  }

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
              Sahala Bank
            </Text>
            <Text style={[styles.subtitle, { color: colors.primaryAccent }]}>
              Login to continue
            </Text>

            {/* biometric button (if available) */}
            {canBio && (
              <TouchableOpacity
                style={[
                  styles.bioBtn,
                  { backgroundColor: colors.primaryAccent },
                ]}
                onPress={handleBiometric}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={28}
                  color={colors.primaryText}
                />
              </TouchableOpacity>
            )}

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

            <Button title="Login" onPress={handleLogin} disabled={isPending} />

            {/* link to Register */}
            <View style={styles.switchWrapper}>
              <Text style={{ color: colors.primaryText }}>
                Need an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/Register")}
              >
                <Text style={[styles.link, { color: colors.primaryAccent }]}>
                  Register
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
  bioBtn: {
    padding: 16,
    borderRadius: 40,
    marginBottom: 24,
  },
  link: { textDecorationLine: "underline", fontWeight: "600" },
  switchWrapper: { marginTop: 18, flexDirection: "row" },
});
