// /app/components/LogOut.tsx
import { Entypo } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  deleteBiometricFlag,
  deleteToken,
  isBiometricEnabled,
} from "@/Api/store";
import { useTheme } from "@/assets/theme/ThemeProvider";
import AuthContext from "@/context/AuthContext";

const LogOut: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const { colors } = useTheme();

  const handleLogout = async () => {
    const bioFlag = await isBiometricEnabled();

    const doLogout = async (clearBiometric = false) => {
      await deleteToken();
      if (clearBiometric) await deleteBiometricFlag();
      setIsAuthenticated(false);
    };

    if (bioFlag) {
      Alert.alert(
        "Logout",
        "Do you also want to remove biometric login?",
        [
          {
            text: "Keep",
            onPress: () => setIsAuthenticated(false), // يخرج مع بقاء البصمة مفعّلة
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => doLogout(true), // حذف التوكِن + علم البصمة
          },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert("Logout", "You are about to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          style: "destructive",
          onPress: () => doLogout(),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.btn,
          {
            borderColor: colors.primaryText,
            backgroundColor: colors.primaryAccent,
          },
        ]}
        onPress={handleLogout}
      >
        <Entypo name="log-out" size={18} color={colors.primaryText} />
        <Text style={[styles.btnText, { color: colors.primaryText }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogOut;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { alignItems: "center" },
  btn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
