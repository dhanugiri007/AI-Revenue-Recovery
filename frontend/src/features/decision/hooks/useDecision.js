import { useContext } from "react";
import { DecisionContext } from "../decision.context";

export const useDecision = () => {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error("useDecision must be used within a DecisionProvider");
  }
  return context;
};