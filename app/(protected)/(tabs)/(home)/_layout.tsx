import { Stack } from "expo-router";
import React from "react";

const protectedLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(transaction)" />
    </Stack>
  );
};
export default protectedLayout;
