import { deleteToken } from "@/Api/store";
import AuthContext from "@/context/AuthContext";
import { Entypo } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const logout = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "you are about to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Ok",
          style: "destructive",
          onPress: async () => {
            await deleteToken();
            setIsAuthenticated(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          borderWidth: 1,
          width: "50%",
          borderRadius: 15,
          padding: 10,
          margin: 3,
          borderColor: "black",
        }}
        onPress={() => {
          handleLogout();
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 20,
            width: "99%",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Logout
        </Text>
        <Entypo name="log-out" size={18} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default logout;

const styles = StyleSheet.create({
  containar: {},
});
