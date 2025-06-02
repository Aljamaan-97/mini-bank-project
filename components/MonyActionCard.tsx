// /app/components/TransactionTabs.tsx

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { depositt, withdrawFunds } from "@/Api/auth";
import { useTheme } from "@/assets/theme/ThemeProvider";
import Button from "@/components/Button";

interface TransactionTabsProps {
  balance: number;
}

/**
 * A card component with two tabs (deposit / withdraw) and amount field.
 */
const TransactionTabs: React.FC<TransactionTabsProps> = ({ balance }) => {
  /* ----------------------------- local state ----------------------------- */
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  /* ----------------------------- theme hooks ---------------------------- */
  const { colors } = useTheme();

  /* --------------------------- shake animation -------------------------- */
  const shake = useRef(new Animated.Value(0)).current;
  const runShake = () => {
    const values = [10, -10, 6, -6, 0];
    Animated.sequence(
      values.map((v) =>
        Animated.timing(shake, {
          toValue: v,
          duration: 50,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  /* --------------------------- react‑query hooks ------------------------- */
  const qc = useQueryClient();

  type TxResp = number;

  const { mutate: depositMutate, isPending: depositPending } = useMutation<
    TxResp,
    Error,
    number
  >({
    mutationKey: ["deposit"],
    mutationFn: (amt) => depositt(amt),
    onSuccess: () => {
      Alert.alert("Success", "Amount deposited successfully");
      qc.invalidateQueries({ queryKey: ["profile"] });
      setAmount("");
    },
    onError: () => Alert.alert("Deposit Failed", "Please try again later"),
  });

  const { mutate: withdrawMutate, isPending: withdrawPending } = useMutation<
    TxResp,
    Error,
    number
  >({
    mutationKey: ["withdraw"],
    mutationFn: (amt) => withdrawFunds(amt),
    onSuccess: () => {
      Alert.alert("Success", "Amount withdrawn successfully");
      qc.invalidateQueries({ queryKey: ["profile"] });
      setAmount("");
    },
    onError: () => Alert.alert("Withdrawal Failed", "Please try again later"),
  });

  /* --------------------------- helpers / UI ----------------------------- */
  const numericAmount = parseFloat(amount);
  const isInvalid = !amount || isNaN(numericAmount) || numericAmount <= 0;
  const loading = depositPending || withdrawPending;

  const validateAndSend = () => {
    setError(null);

    if (isInvalid) {
      setError("Enter a valid amount greater than zero");
      runShake();
      return;
    }
    if (activeTab === "withdraw" && numericAmount > balance) {
      setError("Insufficient balance");
      runShake();
      return;
    }
    activeTab === "deposit"
      ? depositMutate(numericAmount)
      : withdrawMutate(numericAmount);
  };

  const onTabSelect = (tab: "deposit" | "withdraw") => {
    setActiveTab(tab);
    setError(null);
    setAmount("");
  };

  /* -------------------------------- render ------------------------------ */
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, shadowColor: "#000" },
      ]}
    >
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(
          [
            { key: "deposit", label: "Deposit" },
            { key: "withdraw", label: "Withdraw" },
          ] as const
        ).map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tab,
              { backgroundColor: colors.border },
              activeTab === key && { backgroundColor: colors.primaryAccent },
            ]}
            onPress={() => onTabSelect(key)}
          >
            <Text
              style={{
                color:
                  activeTab === key ? colors.background : colors.primaryText,
                fontWeight: "600",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Amount input with shake */}
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <TextInput
          inputMode="decimal"
          placeholder="Enter amount"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          value={amount}
          onChangeText={(v) => {
            const cleaned = v.replace(/[^0-9.]/g, "");
            setAmount(cleaned);
            setError(null);
          }}
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.primaryText,
              borderColor: error ? colors.error : colors.border,
            },
          ]}
        />
      </Animated.View>

      {/* Error */}
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}

      {/* Submit button */}
      <Button
        title="Submit"
        onPress={validateAndSend}
        loading={loading}
        disabled={isInvalid}
        fullWidth
      />
    </View>
  );
};

export default TransactionTabs;

/* --------------------------- local styles --------------------------- */
const styles = StyleSheet.create({
  card: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
    alignSelf: "center",
    marginTop: 20,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tabsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: {
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 14,
  },
});
