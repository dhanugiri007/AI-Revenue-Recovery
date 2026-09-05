import axiosInstance from "../../../services/axiosInstance";

export const uploadPolicyApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post("/policies", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getPoliciesApi = async () => {
  const res = await axiosInstance.get("/policies");
  return res.data;
};

export const deletePolicyApi = async (id) => {
  const res = await axiosInstance.delete(`/policies/${id}`);
  return res.data;
};