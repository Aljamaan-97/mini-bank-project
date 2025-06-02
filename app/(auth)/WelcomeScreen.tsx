// /app/(auth)/WelcomeScreen.tsx
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect } from "react";
import {
  Image,
  Platform,
  StatusBar as RNStatusBar,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AuthContext from "@/context/AuthContext";

const WelcomeScreen = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  // ─── ننقل هنا منطق التحقق والتنقل داخل useEffect ───
  useEffect(() => {
    if (isAuthenticated) {
      // إذا كان المستخدم موثّقًا، نعيد توجيهه إلى تبويب Home
      router.replace("/(protected)/(tabs)/(home)");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      {Platform.OS === "android" && (
        <View style={styles.statusBarPlaceholder} />
      )}

      <SafeAreaView style={styles.container}>
        <Image
          source={require("@/assets/images/icon-removebg-preview.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome to Sahala Bank</Text>
        <Text style={styles.subtitle}>The bank that makes banking simple</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace("/Login")}
          >
            <Text style={styles.buttonText}>Lets start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;

/* ---------- styling ---------- */
const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : 0;

const styles = StyleSheet.create({
  statusBarPlaceholder: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: "#000042",
  },
  container: {
    flex: 1,
    backgroundColor: "#000042",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginVertical: 8,
    textAlign: "center",
  },
  buttonsContainer: {
    marginTop: 32,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    borderColor: "#ffffff",
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: "center",
    color: "#000042",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
