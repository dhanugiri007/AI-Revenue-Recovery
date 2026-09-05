import axiosInstance from "../../../services/axiosInstance";

export const simulateEventApi = async (data) => {
  const res = await axiosInstance.post("/payment-events/simulate", data);
  return res.data;
};

export const getEventsApi = async () => {
  const res = await axiosInstance.get("/payment-events");
  return res.data;
};

export const getEventApi = async (id) => {
  const res = await axiosInstance.get(`/payment-events/${id}`);
  return res.data;
};