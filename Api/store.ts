// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from "expo-secure-store";
// import { Platform } from "react-native";
// const storeToken = async (token: string) => {
//   if (Platform.OS === "web") {
//     await AsyncStorage.setItem("token", token);
//   } else {
//     await SecureStore.setItemAsync("token", token);
//   }
// };
// const getToken = async () => {
//   if (Platform.OS === "web") {
//     return await AsyncStorage.getItem("token");
//   } else {
//     return await SecureStore.getItemAsync("token");
//   }
// };
// const deleteToken = async () => {
//   if (Platform.OS === "web") {
//     await AsyncStorage.removeItem("token");
//   } else {
//     await SecureStore.deleteItemAsync("token");
//   }
// };
// export { deleteToken, getToken, storeToken };

import * as SecureStore from "expo-secure-store";

const storeToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("token", token);
  } catch (error) {
    console.error("Error while storing token:", error);
  }
};
const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    return token;
  } catch (error) {
    console.error("Error while retrieving token:", error);
    return null; // Return null if there's an error
  }
};

const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync("token");
  } catch (error) {
    console.error("Error while deleting token:", error);
  }
};

export { deleteToken, getToken, storeToken };
