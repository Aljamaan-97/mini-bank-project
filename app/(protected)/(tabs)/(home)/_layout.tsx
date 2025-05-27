import AuthContext from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import React, { useContext } from "react";

const protectedLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(home)" />
    </Stack>
  );
};
export default protectedLayout;
