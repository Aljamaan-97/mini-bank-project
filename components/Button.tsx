// /app/components/Button.tsx
import { useTheme } from "@/assets/theme/ThemeProvider";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "outline";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const { colors } = useTheme();

  /* background / text */
  const bg = variant === "primary" ? colors.primaryAccent : "transparent";

  const fg = variant === "primary" ? colors.primaryText : colors.primaryAccent;

  /* outline border */
  const border =
    variant === "outline"
      ? { borderWidth: 1, borderColor: colors.primaryAccent }
      : {};

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
        border,
        fullWidth && { alignSelf: "stretch" },
        disabled && { opacity: 0.5 },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <Text style={[styles.text, { color: fg }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
