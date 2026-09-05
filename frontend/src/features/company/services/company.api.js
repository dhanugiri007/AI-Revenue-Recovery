import axiosInstance from "../../../services/axiosInstance";

export const createCompanyApi = async (data) => {
  const res = await axiosInstance.post("/companies", data);
  return res.data;
};

export const getMyCompanyApi = async () => {
  const res = await axiosInstance.get("/companies/me");
  return res.data;
};

export const updateMyCompanyApi = async (data) => {
  const res = await axiosInstance.put("/companies/me", data);
  return res.data;
};