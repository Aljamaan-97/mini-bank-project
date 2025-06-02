// /app/(protected)/HomeScreen.tsx   ← ضعه في المسار الذي تريده
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getMyProfile } from "@/Api/auth";
import { useTheme } from "@/assets/theme/ThemeProvider";
import TransactionTabs from "@/components/MonyActionCard";
import ProfileCard from "@/components/ProfileCard";

const HomeScreen: React.FC = () => {
  const COLORS = useTheme();

  /* ───── fetch balance ───── */
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  if (isLoading) {
    return (
      <View
        style={[styles.center, { backgroundColor: COLORS.colors.background }]}
      >
        <ActivityIndicator size="large" color={COLORS.colors.primaryAccent} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.center, { backgroundColor: COLORS.colors.background }]}
      >
        <Text style={{ color: COLORS.colors.primaryText }}>
          Failed to load profile
        </Text>
      </View>
    );
  }

  const balance = data?.balance ?? 0;

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const baseUrl = "https://react-bank-project.eapi.joincoded.com";
    return `${baseUrl}${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
  };

  const avatarUri = data.image
    ? { uri: getImageUrl(data.image) }
    : require("@/assets/images/default-avatar.jpg");

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: COLORS.colors.background }]}
    >
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
            <Image source={avatarUri} style={styles.avatar} />
            <Text
              style={[styles.welcomeText, { color: COLORS.colors.primaryText }]}
            >
              welcome:{data.username || "Unknown"}
            </Text>
            <ProfileCard />

            <TransactionTabs balance={balance} />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
