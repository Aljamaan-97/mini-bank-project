// /app/components/Header.tsx
import { useTheme } from "@/assets/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  /** النص الذي سيظهر في المنتصف. إذا غاب يُعرض شعار التطبيق. */
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { colors, scheme, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.primaryDark, flexDirection: "row" },
      ]}
    >
      {/* زرّ تبديل الثيم */}
      <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
        <Ionicons
          name={scheme === "light" ? "moon-outline" : "sunny-outline"}
          size={24}
          color={colors.primaryText}
        />
      </TouchableOpacity>

      {/* العنوان أو الشعار */}
      <View style={styles.titleContainer}>
        {title ? (
          <Text style={[styles.title, { color: colors.primaryText }]}>
            {title}
          </Text>
        ) : (
          <Image
            source={require("@/assets/images/sahala-log.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>

      {/* زر إشعارات (placeholder) */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.primaryText}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconButton: { padding: 8 },
  titleContainer: { flex: 1, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700" },
  logo: { width: 120, height: 32 },
});
