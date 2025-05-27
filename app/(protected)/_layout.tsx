import AuthContext from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import React, { useContext } from "react";

const protectedLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Redirect href="/Login" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};
export default protectedLayout;
