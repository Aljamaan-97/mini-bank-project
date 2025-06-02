// /app/RootLayout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { getToken, isBiometricEnabled } from "@/Api/store";
import { ThemeProvider, useTheme } from "@/assets/theme/ThemeProvider";
import AuthContext from "@/context/AuthContext";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const queryClient = new QueryClient();

  /* ---------- check auth once ---------- */
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const bioFlag = await isBiometricEnabled();
      setIsAuthenticated(!!(token && bioFlag));
      setReady(true);
    })();
  }, []);

  /* ---------- loading splash ---------- */
  const Loading = () => {
    const { colors } = useTheme();
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primaryAccent} />
        <Text
          style={{ marginTop: 12, fontSize: 16, color: colors.primaryAccent }}
        >
          Loading…
        </Text>
      </View>
    );
  };

  if (!ready)
    return (
      <ThemeProvider>
        <Loading />
      </ThemeProvider>
    );

  /* ---------- app tree ---------- */
  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(protected)" />
          </Stack>
        </QueryClientProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

/* ---------- local styles ---------- */
const styles = {
  center: { flex: 1, justifyContent: "center", alignItems: "center" } as const,
};
