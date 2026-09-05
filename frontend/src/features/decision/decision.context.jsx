import { createContext, useState, useEffect } from "react";
import { generateDecisionApi, getDecisionsApi } from "./services/decision.api";
import { useCompany } from "../company/hooks/useCompany";
import { socket } from "../../services/socket";

export const DecisionContext = createContext();

export const DecisionProvider = ({ children }) => {
  const { company } = useCompany();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDecisions = async () => {
    try {
      const data = await getDecisionsApi();
      setDecisions(data);
    } catch (error) {
      setDecisions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchDecisions();
    } else {
      setLoading(false);
    }
  }, [company]);

    useEffect(() => {
    const handleDecisionGenerated = (decision) => {
      setDecisions((prev) => {
        const exists = prev.some((d) => d._id === decision._id);
        if (exists) return prev.map((d) => (d._id === decision._id ? decision : d));
        return [decision, ...prev];
      });
    };

    const handleDecisionReviewed = (decision) => {
      setDecisions((prev) => prev.map((d) => (d._id === decision._id ? decision : d)));
    };

    socket.on("decision:generated", handleDecisionGenerated);
    socket.on("decision:reviewed", handleDecisionReviewed);

    return () => {
      socket.off("decision:generated", handleDecisionGenerated);
      socket.off("decision:reviewed", handleDecisionReviewed);
    };
  }, []);

  

  // Returns the decision (existing or newly generated) and upserts it into local state
  const generateDecision = async (eventId) => {
    const data = await generateDecisionApi(eventId);
    setDecisions((prev) => {
      const exists = prev.some((d) => d._id === data.decision._id);
      if (exists) {
        return prev.map((d) => (d._id === data.decision._id ? data.decision : d));
      }
      return [data.decision, ...prev];
    });
    return data;
  };

  // Look up a decision for a given event from local state, without a network call
  const getDecisionForEvent = (eventId) => {
    return decisions.find((d) => d.paymentEvent?._id === eventId || d.paymentEvent === eventId);
  };

  return (
    <DecisionContext.Provider
      value={{ decisions, loading, generateDecision, getDecisionForEvent, fetchDecisions }}
    >
      {children}
    </DecisionContext.Provider>
  );
};