// /app/(protected)/(tabs)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

/** Layout for the Home tab-stack (no headers). */
const HomeLayout = () => <Stack screenOptions={{ headerShown: false }} />;

export default HomeLayout;
