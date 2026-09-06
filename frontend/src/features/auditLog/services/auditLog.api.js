import axiosInstance from "../../../services/axiosInstance";

export const getAuditLogForEventApi = async (eventId) => {
  const res = await axiosInstance.get(`/audit-logs/event/${eventId}`);
  return res.data;
};

export const getRecentAuditLogsApi = async () => {
  const res = await axiosInstance.get("/audit-logs");
  return res.data;
};