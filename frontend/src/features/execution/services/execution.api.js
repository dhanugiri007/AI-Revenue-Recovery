import axiosInstance from "../../../services/axiosInstance";

export const runExecutionApi = async (decisionId) => {
  const res = await axiosInstance.post(`/executions/run/${decisionId}`);
  return res.data;
};

export const getExecutionsApi = async () => {
  const res = await axiosInstance.get("/executions");
  return res.data;
};