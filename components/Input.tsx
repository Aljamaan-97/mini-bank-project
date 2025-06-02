// /app/components/Input.tsx
import { useTheme } from "@/assets/theme/ThemeProvider";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  fullWidth = true,
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, fullWidth && { alignSelf: "stretch" }]}>
      <Text style={[styles.label, { color: colors.primaryText }]}>{label}</Text>

      <TextInput
        placeholderTextColor={colors.secondaryText}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.primaryText,
            borderColor: error ? colors.error : colors.border,
          },
          style,
        ]}
        {...rest}
      />

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

export default Input;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  label: { fontSize: 14, marginBottom: 4 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 2,
  },
  errorText: { marginTop: 4, fontSize: 12 },
});
