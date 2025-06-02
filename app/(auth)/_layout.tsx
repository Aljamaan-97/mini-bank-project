import { useTheme } from "@/assets/theme/ThemeProvider";
import { Stack } from "expo-router";
import React from "react";

/**
 * Layout for all unauthenticated (auth) screens.
 * ├── WelcomeScreen   (no header)
 * ├── Login           (title: “Login”)
 * └── Register        (title: “Register”)
 */
const AuthLayout = () => {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primaryDark },
        headerTintColor: colors.primaryText,
        headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
        headerTitleAlign: "center",
      }}
    >
      {/* Welcome (splash / landing) */}
      <Stack.Screen name="WelcomeScreen" options={{ headerShown: false }} />

      {/* Login */}
      <Stack.Screen name="Login" options={{ title: "Login" }} />

      {/* Register */}
      <Stack.Screen name="Register" options={{ title: "Register" }} />
    </Stack>
  );
};

export default AuthLayout;
