// /app/components/TransactionCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/assets/theme/ThemeProvider";
import type { Transaction } from "@/types/Transaction";

interface Props {
  transaction: Transaction;
}

const TransactionCard: React.FC<Props> = ({ transaction }) => {
  const { colors } = useTheme();

  /* ---------- helpers ---------- */
  const formatAmount = (n: number) => `${n.toFixed(3)} KD`;

  const formatDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toLocaleString();
  };

  const { bg, iconName, iconColor } = (() => {
    switch (transaction.type) {
      case "deposit":
        return {
          bg: colors.successBg ?? "#E8F5E9",
          iconName: "arrow-down-circle",
          iconColor: colors.success,
        };
      case "withdraw":
        return {
          bg: colors.errorBg ?? "#FFEBEE",
          iconName: "arrow-up-circle",
          iconColor: colors.error,
        };
      case "transfer":
        return {
          bg: colors.warningBg ?? "#FFF8E1",
          iconName: "swap-horizontal",
          iconColor: colors.primaryAccent,
        };
      default:
        return {
          bg: colors.card,
          iconName: "document-text",
          iconColor: colors.primaryText,
        };
    }
  })();

  /* ---------- render ---------- */
  return (
    <View
      style={[styles.card, { backgroundColor: bg, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <Ionicons name={iconName as any} size={24} color={iconColor} />
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {transaction.type.toUpperCase()}
        </Text>
      </View>

      <Text style={{ color: colors.primaryText }}>
        Amount: {formatAmount(transaction.amount)}
      </Text>

      {transaction.type === "transfer" && (
        <>
          <Text style={{ color: colors.primaryText }}>
            From: {transaction.from}
          </Text>
          <Text style={{ color: colors.primaryText }}>
            To: {transaction.to}
          </Text>
        </>
      )}

      {transaction.createdAt && (
        <Text style={{ color: colors.secondaryText }}>
          Date: {formatDate(transaction.createdAt)}
        </Text>
      )}
    </View>
  );
};

export default TransactionCard;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  title: { fontWeight: "700", fontSize: 16, marginLeft: 8 },
});
