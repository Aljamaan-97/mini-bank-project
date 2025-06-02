import { getMyProfile } from "@/Api/auth";
import { useTheme } from "@/assets/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
const COLORS = useTheme();
// /app/components/ProfileCard.tsx

/* لوحة الألوان الموحَّدة */
// const COLORS = {
//   primary: "#1E3D58",
//   accent: "#00A8E8",
//   lightText: "#FFFFFF",
//   border: "#C5CED8",
//   card: "#FFFFFF",
// };

/**
 *بطاقة الملف الشخصي: صورة، اسم مستخدم، رصيد متاح
 */
const ProfileCard = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  if (isLoading)
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={COLORS.colors.surface} />
      </View>
    );

  if (error)
    return (
      <View style={styles.centerBox}>
        <Text style={{ color: COLORS.colors.surface }}>
          Error loading profile
        </Text>
      </View>
    );

  const getImageUrl = (imagePath: String) => {
    if (!imagePath) return console.log("No image path provided");

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      console.log("Image URL is valid:", imagePath);
      return imagePath; // إذا كان الرابط يبدأ بـ http أو https
    }

    const baseUrl = "https://react-bank-project.eapi.joincoded.com";

    let fullUrl;
    if (imagePath.startsWith("/")) {
      console.log("Full image URL 1:", fullUrl);
      fullUrl = `${baseUrl}${imagePath}`;
    } else {
      console.log("Full image URL 2:", fullUrl);
      fullUrl = `${baseUrl}/${imagePath}`;
    }

    return fullUrl; // إذا كان الرابط يبدأ بـ /، أضف القاعدة
  };

  /* fallback للصورة والبيانات */
  const avatarUri = data.image || require("@/assets/images/default-avatar.jpg");
  const username = data.username || "Unknown";
  const balance = data.balance ?? 0;

  const imageUrl = getImageUrl(data?.image);
  console.log(data.image);

  return (
    <View style={styles.card}>
      {/* رأس البطاقة */}
      <View style={styles.headerRow}>
        <Image
          source={imageUrl ? { uri: imageUrl } : avatarUri}
          style={styles.avatar}
        />
        <Text
          style={[styles.welcomeText, { color: COLORS.colors.primaryText }]}
        >
          Welcome, {username}
        </Text>

        <View style={styles.balanceRow}>
          <Ionicons name="wallet" size={20} color={COLORS.colors.primaryText} />
          <Text
            style={[styles.balanceText, { color: COLORS.colors.primaryText }]}
          >
            {balance.toFixed(3)} KD
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    borderRadius: 12,
    padding: 24,
    alignSelf: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  welcomeText: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  balanceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  balanceText: { fontSize: 20, fontWeight: "700" },
});
