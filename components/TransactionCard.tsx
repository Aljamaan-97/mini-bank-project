import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "../types/Transaction";

const getStyle = (type: string) => {
  switch (type) {
    case "withdraw":
      return styles.withdraw;
    case "deposit":
      return styles.deposit;
    case "transfer":
      return styles.transfer;
    default:
      return {};
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case "deposit":
      return <Ionicons name="arrow-down-circle" size={24} color="#2e7d32" />;
    case "withdraw":
      return <Ionicons name="arrow-up-circle" size={24} color="#c62828" />;
    case "transfer":
      return <Ionicons name="swap-horizontal" size={24} color="#f9a825" />;
    default:
      return null;
  }
};

export default function TransactionCard({
  transaction,
}: {
  transaction: Transaction;
}) {
  const style = getStyle(transaction.type);
  const icon = getIcon(transaction.type);

  const formattedDate =
    transaction.createdAt && !isNaN(new Date(transaction.createdAt).getTime())
      ? new Date(transaction.createdAt).toLocaleDateString()
      : null;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{transaction.type.toUpperCase()}</Text>
      </View>

      <Text>Amount: {transaction.amount}</Text>

      {transaction.type === "transfer" && (
        <>
          <Text>From: {transaction.from}</Text>
          <Text>To: {transaction.to}</Text>
        </>
      )}

      {formattedDate && <Text>Date: {formattedDate}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  withdraw: {
    backgroundColor: "#f8d7da",
  },
  deposit: {
    backgroundColor: "#d4edda",
  },
  transfer: {
    backgroundColor: "#fff3cd",
  },
});
