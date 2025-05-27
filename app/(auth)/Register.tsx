import { register } from "@/Api/auth";
import AuthContext from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const { setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: () =>
      register(name, password, image || "@assets/images/default-avatar.jpg"),

    onError: (error) => {
      console.error("Registration failed:", error);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      router.replace("/");
    },
  });

  const handleRegister = () => {
    if (!name || !password) {
      alert("Please fill all fields");
      return;
    }

    mutate();
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={pickImage}>
        <View
          style={{
            backgroundColor: "gray",
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 24,
          }}
        >
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
      <TextInput
        placeholder="Username"
        style={{
          borderWidth: 1,
          width: "90%",
          padding: 5,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onChangeText={(text) => setName(text)}
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
        <Text>do you have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("./Login");
          }}
        >
          <Text
            style={{
              color: "blue",
              textDecorationLine: "underline",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
      <Button title="Register" onPress={handleRegister} disabled={isPending} />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({});
