import axiosInstance from "../../../services/axiosInstance";

export const getSummaryApi = async () => {
  const res = await axiosInstance.get("/analytics/summary");
  return res.data;
};

export const getTimelineApi = async () => {
  const res = await axiosInstance.get("/analytics/timeline");
  return res.data;
};