import { createContext, useState, useEffect } from "react";
import {
  uploadPolicyApi,
  getPoliciesApi,
  deletePolicyApi,
} from "./services/policy.api";
import { useCompany } from "../company/hooks/useCompany";

export const PolicyContext = createContext();

export const PolicyProvider = ({ children }) => {
  const { company } = useCompany();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      const data = await getPoliciesApi();
      setPolicies(data);
    } catch (error) {
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchPolicies();
    } else {
      setLoading(false);
    }
  }, [company]);

  const uploadPolicy = async (file) => {
    const data = await uploadPolicyApi(file);
    setPolicies((prev) => [data, ...prev]);
    return data;
  };

  const deletePolicy = async (id) => {
    await deletePolicyApi(id);
    setPolicies((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <PolicyContext.Provider
      value={{ policies, loading, uploadPolicy, deletePolicy, fetchPolicies }}
    >
      {children}
    </PolicyContext.Provider>
  );
};