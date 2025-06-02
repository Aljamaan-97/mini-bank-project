// /app/(protected)/_layout.tsx   ← ضع الملف أو استبدله بالمسار المناسب
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/assets/theme/ThemeProvider";
import LogOut from "@/components/LogOut";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primaryDark,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: colors.primaryText,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
          color: colors.primaryText,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.primaryAccent,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        headerRight: () => (
          <View style={styles.logoutContainer}>
            <LogOut />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(transactions)"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="account-balance-wallet"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(users)"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="group" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutContainer: { marginRight: 16 },
});
