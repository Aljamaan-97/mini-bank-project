import { isBiometricEnabled } from "@/Api/store";
import * as LocalAuth from "expo-local-authentication";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar"; // ✅ أضفنا شريط الحالة
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WelcomeScreen = () => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const ready =
        (await LocalAuth.hasHardwareAsync()) &&
        (await LocalAuth.isEnrolledAsync()) &&
        (await isBiometricEnabled());
    })();
  }, []);
  return (
    <View style={styles.container}>
      {/* ✅ شريط الحالة بألوان متناسقة */}
      <StatusBar style="light" backgroundColor="#000042" />

      {/* الشعار */}
      <Image
        source={require("@/assets/images/sahala-log.png")}
        style={styles.logo}
      />

      {/* النصوص */}
      <Text style={styles.title}>أهلاً بك في بنك سهالة</Text>
      <Text style={styles.subtitle}>البنك إلي يسهل لك كل شيء</Text>

      {/* الأزرار */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/Login")}
        >
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/Register")}
        >
          <Text style={styles.secondaryButtonText}>تسجيل جديد</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000042", // خلفية كحلي
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
    color: "#ffffff", // ✅ تم التعديل ليكون أبيض
    fontSize: 16,
    fontWeight: "600",
  },
});
