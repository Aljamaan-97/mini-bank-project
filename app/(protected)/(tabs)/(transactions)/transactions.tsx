import { getTransactions } from "@/Api/auth";
import TransactionCard from "@/components/TransactionCard";
import { Transaction } from "@/types/Transaction";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TransactionsScreen() {
  const [filterType, setFilterType] = useState<
    "all" | "withdraw" | "deposit" | "transfer"
  >("all");

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === "all" || tx.type === filterType;

    const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
    const validTxDate = txDate && !isNaN(txDate.getTime());

    const inRange =
      validTxDate &&
      (!fromDate || txDate >= fromDate) &&
      (!toDate || txDate <= toDate);

    return matchesType && inRange;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>

      {/* Type Filter Buttons */}
      <View style={styles.filterRow}>
        {["all", "withdraw", "deposit", "transfer"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filterType === type && styles.activeButton,
            ]}
            onPress={() => setFilterType(type as any)}
          >
            <Text style={styles.buttonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Range Filter */}
      <View style={styles.dateRow}>
        <View style={styles.datePickerWrapper}>
          <Button
            title={
              fromDate
                ? `From: ${fromDate.toLocaleDateString()}`
                : "Select From Date"
            }
            onPress={() => setShowFromPicker(true)}
          />
          {showFromPicker && (
            <DateTimePicker
              value={fromDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowFromPicker(Platform.OS === "ios");
                if (selectedDate) setFromDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.datePickerWrapper}>
          <Button
            title={
              toDate ? `To: ${toDate.toLocaleDateString()}` : "Select To Date"
            }
            onPress={() => setShowToPicker(true)}
          />
          {showToPicker && (
            <DateTimePicker
              value={toDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowToPicker(Platform.OS === "ios");
                if (selectedDate) setToDate(selectedDate);
              }}
            />
          )}
        </View>
      </View>

      {/* Transaction List */}
      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <>
          {console.log("Transaction load error:", error)}
          <Text style={styles.error}>Error loading transactions.</Text>
        </>
      ) : filteredTransactions.length === 0 ? (
        <Text>No transactions found.</Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <TransactionCard transaction={item as Transaction} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  buttonText: {
    textTransform: "capitalize",
  },
  activeButton: {
    backgroundColor: "#d0e8ff",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  datePickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  error: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});

// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// const transactions = () => {
//   return (
//     <View>
//       <Text>transactions</Text>
//     </View>
//   );
// };

// export default transactions;

// const styles = StyleSheet.create({});
