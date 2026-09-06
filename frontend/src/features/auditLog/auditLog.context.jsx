import { createContext, useState } from "react";
import { getAuditLogForEventApi } from "./services/auditLog.api";

export const AuditLogContext = createContext();

export const AuditLogProvider = ({ children }) => {
  const [logsByEvent, setLogsByEvent] = useState({}); // eventId -> logs[]
  const [loadingEventId, setLoadingEventId] = useState(null);

  const fetchAuditLogForEvent = async (eventId) => {
    setLoadingEventId(eventId);
    try {
      const data = await getAuditLogForEventApi(eventId);
      setLogsByEvent((prev) => ({ ...prev, [eventId]: data }));
    } finally {
      setLoadingEventId(null);
    }
  };

  return (
    <AuditLogContext.Provider value={{ logsByEvent, loadingEventId, fetchAuditLogForEvent }}>
      {children}
    </AuditLogContext.Provider>
  );
};