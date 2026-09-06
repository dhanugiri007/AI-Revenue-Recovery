import { createContext, useState, useEffect } from "react";
import { getSummaryApi, getTimelineApi } from "./services/analytics.api";
import { useCompany } from "../company/hooks/useCompany";

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const { company } = useCompany();
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const [summaryData, timelineData] = await Promise.all([getSummaryApi(), getTimelineApi()]);
      setSummary(summaryData);
      setTimeline(timelineData);
    } catch (error) {
      setSummary(null);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [company]);

  return (
    <AnalyticsContext.Provider value={{ summary, timeline, loading, fetchAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
};