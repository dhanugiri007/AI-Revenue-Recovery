import { createContext, useState, useEffect } from "react";
import {
  createCompanyApi,
  getMyCompanyApi,
  updateMyCompanyApi,
} from "./services/company.api";
import { useAuth } from "../auth/hooks/useAuth";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMyCompanyApi();
        setCompany(data);
      } catch (error) {
        setCompany(null); // 404 means no company yet - that's fine
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [user]);

  const createCompany = async (formData) => {
    const data = await createCompanyApi(formData);
    setCompany(data);
    return data;
  };

  const updateCompany = async (formData) => {
    const data = await updateMyCompanyApi(formData);
    setCompany(data);
    return data;
  };

  return (
    <CompanyContext.Provider
      value={{ company, loading, createCompany, updateCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
};