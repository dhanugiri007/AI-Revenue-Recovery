import { createContext, useState, useEffect } from "react";
import {
  createCompanyApi,
  getMyCompanyApi,
  updateMyCompanyApi,
} from "./services/company.api";
import { useAuth } from "../auth/hooks/useAuth";
import { socket } from "../../services/socket";

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

   useEffect(() => {
  if (company) {
    console.log("Attempting socket join for company:", company._id);
    if (!socket.connected) socket.connect();
    socket.emit("join_company", company._id);
  }
}, [company]);

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