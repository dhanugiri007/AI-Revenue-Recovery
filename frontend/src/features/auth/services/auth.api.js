import axiosInstance from "../../../services/axiosInstance";

export const registerApi = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginApi = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const logoutApi = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getMeApi = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};