// /app/(protected)/HomeScreen.tsx   ← ضعه في المسار الذي تريده
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
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
  const { colors } = useTheme();

  /* ───── fetch balance ───── */
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primaryAccent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.primaryText }}>
          Failed to load profile
        </Text>
      </View>
    );
  }

  const balance = data?.balance ?? 0;

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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
});
