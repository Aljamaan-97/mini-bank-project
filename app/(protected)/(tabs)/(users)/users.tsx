import { getAllUsers, transferToUser } from "@/Api/auth";
import { useTheme } from "@/assets/theme/ThemeProvider";
import UserCard from "@/components/UserCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function UsersScreen() {
  // الحصول على ألوان الثيم الحالية
  const COLORS = useTheme();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { mutate: transfer } = useMutation({
    mutationFn: ({ amount, userId }: { amount: number; userId: string }) =>
      transferToUser(amount, userId),
    onSuccess: () => {
      Alert.alert("✅ Success", "Funds transferred successfully!");
    },
    onError: (error: any) => {
      console.log("Transfer error:", error?.response?.data);
      Alert.alert("Error", error?.response?.data?.message || "Transfer failed");
    },
  });

  const handleTransfer = (userId: string, amount: number) => {
    if (!amount || amount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }
    transfer({ amount, userId });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: COLORS.colors.background }]}
    >
      {/* عنوان الشاشة */}
      <Text style={[styles.title, { color: COLORS.colors.primaryText }]}>
        Users
      </Text>

      {isLoading ? (
        <Text style={{ color: COLORS.colors.secondaryText }}>
          Loading users...
        </Text>
      ) : isError ? (
        <Text style={{ color: COLORS.colors.error }}>Error loading users.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <UserCard user={item} onTransfer={handleTransfer} />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
