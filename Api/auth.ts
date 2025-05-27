import instance from ".";
import UserType from "../types/usertype";
import { storeToken } from "./Storage";

const login = async (user: UserType) => {
  const { data } = await instance.post("/auth/login", user);
  if (data.token) {
    storeToken(data.token);
  }
  return data;
};
const register = async (username: string, password: string, image: string) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", {
    name: "profile.jpg",
    uri: image,
    type: "image/jpeg",
  } as any);
  const { data } = await instance.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const me = async () => {
  const { data } = await instance.get("/auth/me");
  return data;
};
const getAllUsers = async () => {
  const { data } = await instance.get("/auth/users");
  return data;
};

export { login, register, me, getAllUsers };
