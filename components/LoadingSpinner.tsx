// /app/components/LoadingSpinner.tsx
import { useTheme } from "@/assets/theme/ThemeProvider";
import LottieView from "lottie-react-native";
import React from "react";
import {
  AccessibilityRole,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface LoadingSpinnerProps {
  visible?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible = true,
  size = 100,
  style,
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: colors.overlay }, // أضف هذا اللون في ملف colors إن شئت
        style,
      ]}
      accessibilityRole={"progressbar" as AccessibilityRole}
      accessibilityLabel="Loading"
    >
      <LottieView
        source={require("@/assets/animations/loading.json")}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
};

export default LoadingSpinner;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
