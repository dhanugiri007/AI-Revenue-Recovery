import { createContext, useState, useEffect } from "react";
import { simulateEventApi, getEventsApi } from "./services/paymentEvent.api";
import { useCompany } from "../company/hooks/useCompany";

export const PaymentEventContext = createContext();

export const PaymentEventProvider = ({ children }) => {
  const { company } = useCompany();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const data = await getEventsApi();
      setEvents(data);
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [company]);

  const simulateEvent = async (formData) => {
    const data = await simulateEventApi(formData);
    setEvents((prev) => [data, ...prev]);
    return data;
  };

  return (
    <PaymentEventContext.Provider value={{ events, loading, simulateEvent, fetchEvents }}>
      {children}
    </PaymentEventContext.Provider>
  );
};