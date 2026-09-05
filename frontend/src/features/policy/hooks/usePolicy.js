import { useContext } from "react";
import { PolicyContext } from "../policy.context";

export const usePolicy = () => {
  const context = useContext(PolicyContext);
  if (!context) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
};