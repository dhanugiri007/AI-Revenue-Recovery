import axiosInstance from "../../../services/axiosInstance";

export const getPendingReviewsApi = async () => {
  const res = await axiosInstance.get("/reviews/pending");
  return res.data;
};

export const approveDecisionApi = async (id, notes) => {
  const res = await axiosInstance.put(`/reviews/${id}/approve`, { notes });
  return res.data;
};

export const rejectDecisionApi = async (id, notes) => {
  const res = await axiosInstance.put(`/reviews/${id}/reject`, { notes });
  return res.data;
};