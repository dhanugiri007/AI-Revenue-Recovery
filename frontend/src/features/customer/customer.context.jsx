import { createContext, useState, useEffect } from "react";
import {
  createCustomerApi,
  getCustomersApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "./services/customer.api";
import { useCompany } from "../company/hooks/useCompany";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { company } = useCompany();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomersApi();
      setCustomers(data);
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchCustomers();
    } else {
      setLoading(false);
    }
  }, [company]);

  const createCustomer = async (formData) => {
    const data = await createCustomerApi(formData);
    setCustomers((prev) => [data, ...prev]);
    return data;
  };

  const updateCustomer = async (id, formData) => {
    const data = await updateCustomerApi(id, formData);
    setCustomers((prev) => prev.map((c) => (c._id === id ? data : c)));
    return data;
  };

  const deleteCustomer = async (id) => {
    await deleteCustomerApi(id);
    setCustomers((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <CustomerContext.Provider
      value={{ customers, loading, createCustomer, updateCustomer, deleteCustomer, fetchCustomers }}
    >
      {children}
    </CustomerContext.Provider>
  );
};