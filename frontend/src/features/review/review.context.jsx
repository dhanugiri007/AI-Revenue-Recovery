import { createContext, useState, useEffect } from "react";
import {
  getPendingReviewsApi,
  approveDecisionApi,
  rejectDecisionApi,
} from "./services/review.api";
import { useCompany } from "../company/hooks/useCompany";
import { socket } from "../../services/socket";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const { company } = useCompany();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingReviews = async () => {
    try {
      const data = await getPendingReviewsApi();
      setPendingReviews(data);
    } catch (error) {
      setPendingReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchPendingReviews();
    } else {
      setLoading(false);
    }
  }, [company]);

    useEffect(() => {
    const handleDecisionReviewed = (decision) => {
      // A decision was just reviewed elsewhere - remove it from the pending queue if present
      setPendingReviews((prev) => prev.filter((d) => d._id !== decision._id));
    };

    socket.on("decision:reviewed", handleDecisionReviewed);

    return () => {
      socket.off("decision:reviewed", handleDecisionReviewed);
    };
  }, []);

  const approveDecision = async (id, notes) => {
    const data = await approveDecisionApi(id, notes);
    setPendingReviews((prev) => prev.filter((d) => d._id !== id));
    return data;
  };

  const rejectDecision = async (id, notes) => {
    const data = await rejectDecisionApi(id, notes);
    setPendingReviews((prev) => prev.filter((d) => d._id !== id));
    return data;
  };

  return (
    <ReviewContext.Provider
      value={{ pendingReviews, loading, approveDecision, rejectDecision, fetchPendingReviews }}
    >
      {children}
    </ReviewContext.Provider>
  );
};