import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LogOut from "./LogOut"; // Assuming LogOut is a component that handles logout functionality

const ProfileCard = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 15,
        padding: 30,
        width: "90%",
        backgroundColor: "#gray",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 3,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Image
            source={require("@/assets/images/default-avatar.jpg")}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          ></Image>
          <LogOut />
        </View>

        <Text>welcome username</Text>
        <Text>your account available balance : 2025 </Text>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({});
