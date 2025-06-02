// /app/(protected)/(transactions)/TransactionsScreen.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getTransactions } from "@/Api/auth";
import { useTheme } from "@/assets/theme/ThemeProvider";
import TransactionCard from "@/components/TransactionCard";
import { Transaction } from "@/types/Transaction";

/* ─── filter-type helpers ─── */
const FILTER_TYPES = ["all", "withdraw", "deposit", "transfer"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [searchAmount, setSearchAmount] = useState<string>("");

  /* ─── fetch transactions ─── */
  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  /* ─── filtered + sorted list ─── */
  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesType = filterType === "all" || tx.type === filterType;
      const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
      const valid = txDate && !isNaN(txDate.getTime());
      const inRange =
        valid &&
        (!fromDate || (txDate as Date) >= fromDate) &&
        (!toDate || (txDate as Date) <= toDate);
      return matchesType && inRange;
    })
    .filter((tx) => {
      if (!searchAmount) return true;
      const amt = parseFloat(searchAmount);
      if (isNaN(amt)) return true;
      return tx.amount === amt;
    })
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // أحدث أولاً
    });

  /* ─── handlers ─── */
  const onChangeFrom = (_: any, d?: Date) => {
    if (Platform.OS !== "ios") setShowFromPicker(false);
    if (d) setFromDate(d);
  };
  const onChangeTo = (_: any, d?: Date) => {
    if (Platform.OS !== "ios") setShowToPicker(false);
    if (d) setToDate(d);
  };

  const clearDateFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  /* ─── ui ─── */
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Transaction History
      </Text>

      {/* filter buttons */}
      <View style={styles.filterRow}>
        {FILTER_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filterType === type && {
                backgroundColor: colors.primaryAccent,
                borderColor: colors.primaryAccent,
              },
            ]}
            onPress={() => setFilterType(type)}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    filterType === type ? colors.surface : colors.primaryText,
                },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* date range + clear */}
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[styles.datePickerWrapper, { borderColor: colors.border }]}
          onPress={() => setShowFromPicker(true)}
        >
          <Text style={{ color: colors.primaryText }}>
            {fromDate
              ? `From: ${fromDate.toLocaleDateString()}`
              : "Select From Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.datePickerWrapper, { borderColor: colors.border }]}
          onPress={() => setShowToPicker(true)}
        >
          <Text style={{ color: colors.primaryText }}>
            {toDate ? `To: ${toDate.toLocaleDateString()}` : "Select To Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.clearButton, { borderColor: colors.primaryAccent }]}
          onPress={clearDateFilters}
        >
          <Text style={{ color: colors.primaryAccent }}>Clear</Text>
        </TouchableOpacity>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeFrom}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeTo}
        />
      )}

      {/* amount search */}
      <View style={styles.searchRow}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              color: colors.primaryText,
              borderColor: colors.border,
            },
          ]}
          placeholder="Search by amount"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          value={searchAmount}
          onChangeText={(text) => setSearchAmount(text.replace(/[^0-9.]/g, ""))}
        />
        <TouchableOpacity
          style={[
            styles.clearAmountButton,
            { borderColor: colors.primaryAccent },
          ]}
          onPress={() => setSearchAmount("")}
        >
          <Text style={{ color: colors.primaryAccent }}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* list / states */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primaryAccent} />
      ) : isError ? (
        <>
          {console.error("Transaction load error:", error)}
          <Text style={[styles.error, { color: colors.error || "red" }]}>
            Error loading transactions.
          </Text>
        </>
      ) : filteredTransactions.length === 0 ? (
        <Text style={{ color: colors.primaryText }}>
          No transactions found.
        </Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          renderItem={({ item }) => (
            <TransactionCard transaction={item as Transaction} />
          )}
          refreshing={isFetching}
          onRefresh={() =>
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
          }
        />
      )}
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  buttonText: { textTransform: "capitalize" },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  datePickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  clearAmountButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  error: { fontWeight: "bold", textAlign: "center" },
});
