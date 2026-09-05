import { createContext, useState, useEffect } from "react";
import { runExecutionApi, getExecutionsApi } from "./services/execution.api";
import { useCompany } from "../company/hooks/useCompany";
import { socket } from "../../services/socket";

export const ExecutionContext = createContext();

export const ExecutionProvider = ({ children }) => {
  const { company } = useCompany();
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExecutions = async () => {
    try {
      const data = await getExecutionsApi();
      setExecutions(data);
    } catch (error) {
      setExecutions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchExecutions();
    } else {
      setLoading(false);
    }
  }, [company]);

    useEffect(() => {
    const handleExecutionUpdated = (execution) => {
      setExecutions((prev) => {
        const exists = prev.some((e) => e._id === execution._id);
        if (exists) return prev.map((e) => (e._id === execution._id ? execution : e));
        return [execution, ...prev];
      });
    };

    socket.on("execution:updated", handleExecutionUpdated);

    return () => {
      socket.off("execution:updated", handleExecutionUpdated);
    };
  }, []);

  const runExecution = async (decisionId) => {
    const data = await runExecutionApi(decisionId);
    setExecutions((prev) => {
      const exists = prev.some((e) => e._id === data.execution._id);
      if (exists) {
        return prev.map((e) => (e._id === data.execution._id ? data.execution : e));
      }
      return [data.execution, ...prev];
    });
    return data;
  };

  // Look up an execution for a given decision from local state, without a network call
  const getExecutionForDecision = (decisionId) => {
    return executions.find(
      (e) => e.decision?._id === decisionId || e.decision === decisionId
    );
  };

  return (
    <ExecutionContext.Provider
      value={{ executions, loading, runExecution, getExecutionForDecision, fetchExecutions }}
    >
      {children}
    </ExecutionContext.Provider>
  );
};