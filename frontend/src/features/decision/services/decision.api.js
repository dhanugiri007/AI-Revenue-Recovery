import axiosInstance from "../../../services/axiosInstance";

export const generateDecisionApi = async (eventId) => {
  const res = await axiosInstance.post(`/decisions/generate/${eventId}`);
  return res.data;
};

export const getDecisionsApi = async () => {
  const res = await axiosInstance.get("/decisions");
  return res.data;
};

export const getDecisionByEventApi = async (eventId) => {
  const res = await axiosInstance.get(`/decisions/event/${eventId}`);
  return res.data;
};