import { Stack } from "expo-router";

const TransactionsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="alltransactions"
        options={{ title: "transactions" }}
      />
      <Stack.Screen name="transaction" options={{ title: "transaction" }} />
    </Stack>
  );
};

export default TransactionsLayout;
