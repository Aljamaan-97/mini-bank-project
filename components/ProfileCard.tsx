import { getMyProfile } from "@/Api/auth";
import { useTheme } from "@/assets/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ProfileCard = () => {
  const COLORS = useTheme();

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

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const baseUrl = "https://react-bank-project.eapi.joincoded.com";
    return `${baseUrl}${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
  };

  const avatarUri = data.image
    ? { uri: getImageUrl(data.image) }
    : require("@/assets/images/default-avatar.jpg");

  return (
    <ImageBackground
      source={require("@/assets/images/cardb.png")}
      style={styles.card}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          {/* إذا أردت عرض الصورة، فك التعليق هنا مع ضبط الـ styles.avatar */}
          {/* <Image source={avatarUri} style={styles.avatar} /> */}
          {/* <Text
            style={[styles.welcomeText, { color: COLORS.colors.primaryText }]}
          >
            welcome: {data.username || "Unknown"}
          </Text> */}

          {/* هنا الموديفيكاشن */}
          <View style={styles.balanceRow}>
            <Text
              style={[
                styles.balanceLabel,
                { color: COLORS.colors.primaryText },
              ]}
            >
              current balance
            </Text>

            <View style={styles.amountRow}>
              <Text
                style={[
                  styles.balanceText,
                  { color: COLORS.colors.primaryText },
                ]}
              >
                {data.balance.toFixed(3)} KD
              </Text>
              <Ionicons
                name="wallet"
                size={20}
                color={COLORS.colors.primaryText}
              />
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    alignSelf: "center",
    height: 220,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
  },
  balanceRow: {
    flexDirection: "column", // نص فوق بعض
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  balanceLabel: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8, // مسافة بسيطة بين النص والصف التالي
  },
  amountRow: {
    flexDirection: "row", // الأيقونة والمبلغ جنب بعض
    alignItems: "flex-start",
    gap: 6,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "700",
  },
});
