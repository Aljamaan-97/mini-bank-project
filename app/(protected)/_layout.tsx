// /app/(protected)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import React, { useContext } from "react";

import AuthContext from "@/context/AuthContext";

/** Parent layout for all protected stacks. */
const ProtectedLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  /* If the user is not authenticated, bounce back to the auth flow */
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/WelcomeScreen" />;
  }

  /* Otherwise render the tab-stack normally */
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default ProtectedLayout;
