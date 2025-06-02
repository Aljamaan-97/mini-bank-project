import { getAllUsers, transferToUser } from "@/Api/auth";
import UserCard from "@/components/UserCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function UsersScreen() {
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
      console.log(" Transfer error:", error?.response?.data);
      Alert.alert(
        " Error",
        error?.response?.data?.message || "Transfer failed"
      );
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
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>

      {isLoading ? (
        <Text>Loading users...</Text>
      ) : isError ? (
        <Text>Error loading users.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <UserCard user={item} onTransfer={handleTransfer} />
          )}
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
