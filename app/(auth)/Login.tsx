import { login } from "@/Api/auth";
import AuthContext from "@/context/AuthContext";
import UserType from "@/types/usertype";
import { useMutation } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import React, { useContext, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Redirect href={"/(protected)/(tabs)/(home)"} />;
  }
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login({ username: UserName, password: password }),
    onError: (error) => {
      console.error("Login failed:", error);
      //   alert("Login failed. Please check your input.");
    },
    onSuccess: (data: UserType) => {
      setIsAuthenticated(true);
      router.replace("/(protected)/(tabs)/(home)");
    },
  });
  const handleLogin = () => {
    if (!UserName || !password) {
      alert("Please write your username and password");
      return;
    }
    mutate();
    console.log("Login request sent");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <TextInput
        placeholder="Username"
        style={{
          borderWidth: 1,
          width: "90%",
          padding: 5,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onChangeText={(text) => setUserName(text)}
      />
      <TextInput
        placeholder="Password"
        style={{
          borderWidth: 1,
          width: "90%",
          padding: 5,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onChangeText={(text) => setPassword(text)}
      />

      <View style={{ width: "60%", marginBottom: 20, flexDirection: "row" }}>
        <Text>dont have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("./Register");
          }}
        >
          <Text
            style={{
              color: "blue",
              textDecorationLine: "underline",
            }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        title="login"
        onPress={() => {
          handleLogin();
          console.log("Login button pressed");
        }}
        disabled={isPending}
      />
    </View>
  );
}
