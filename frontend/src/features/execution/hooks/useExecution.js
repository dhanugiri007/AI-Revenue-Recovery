import { useContext } from "react";
import { ExecutionContext } from "../execution.context";

export const useExecution = () => {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error("useExecution must be used within an ExecutionProvider");
  }
  return context;
};