import { Stack } from "expo-router";
import React from "react";

const ProtectedLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000042", // خلفية الكابتن كحلي
        },
        headerTintColor: "#ffffff", // لون نص العنوان وأيقونات الرجوع أبيض
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
        headerTitleAlign: "center", // يتموضع العنوان في الوسط
        presentation: "modal", // إذا أردت فتح الشاشات كـ modal (اختياري)
      }}
    >
      {/* شاشة الترحيب */}
      <Stack.Screen
        name="WelcomeScreen"
        options={{
          title: " بنك سهالة",

          headerShown: false,
        }}
      />

      {/* شاشة تسجيل الدخول */}
      <Stack.Screen
        name="Login"
        options={{
          title: "تسجيل الدخول",
        }}
      />

      {/* شاشة التسجيل */}
      <Stack.Screen
        name="Register"
        options={{
          title: "إنشاء حساب",
        }}
      />
    </Stack>
  );
};

export default ProtectedLayout;
