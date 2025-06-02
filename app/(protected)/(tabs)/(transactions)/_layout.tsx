import { Stack } from "expo-router";
import React from "react";

/** Layout for all Transactions-related screens (header hidden). */
const TransactionsLayout = () => (
  <Stack screenOptions={{ headerShown: false }} />
);

export default TransactionsLayout;
