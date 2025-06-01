import LogOut from "@/components/LogOut";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  // نجلب قيمة الـ insets من أسفل الشاشة
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#1E3D58",
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
          color: "#FFFFFF",
        },
        // هنا نُعطي شريط التبويبات ارتفاعاً يشمل الـ inset أسفل الشاشة
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#C5CED8",
          // نزيد الطول بمقدار inset.bottom ليُبتعد عن أزرار النظام
          height: 60 + insets.bottom,
          // ونعطيه حشوة (padding) من الأسفل تساوي inset.bottom
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: "#00A8E8",
        tabBarInactiveTintColor: "#C5CED8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
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
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(transactions)"
        options={{
          title: "التحويلات",
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
          title: "users",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="group" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    marginRight: 16,
  },
});
