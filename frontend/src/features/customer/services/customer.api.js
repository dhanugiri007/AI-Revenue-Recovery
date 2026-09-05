import axiosInstance from "../../../services/axiosInstance";

export const createCustomerApi = async (data) => {
  const res = await axiosInstance.post("/customers", data);
  return res.data;
};

export const getCustomersApi = async () => {
  const res = await axiosInstance.get("/customers");
  return res.data;
};

export const getCustomerApi = async (id) => {
  const res = await axiosInstance.get(`/customers/${id}`);
  return res.data;
};

export const updateCustomerApi = async (id, data) => {
  const res = await axiosInstance.put(`/customers/${id}`, data);
  return res.data;
};

export const deleteCustomerApi = async (id) => {
  const res = await axiosInstance.delete(`/customers/${id}`);
  return res.data;
};