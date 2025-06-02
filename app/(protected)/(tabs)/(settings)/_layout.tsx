// /app/(protected)/(settings)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

/** Global layout for Settings screens (header hidden). */
const SettingsLayout = () => <Stack screenOptions={{ headerShown: false }} />;

export default SettingsLayout;
