import { useState } from "react";
import { useExecution } from "../../execution/hooks/useExecution";

const actionLabels = {
  retry_payment: "Retry Payment",
  retry_payment_after_delay: "Retry Payment (After Delay)",
  send_email_update_payment_method: "Send Email: Update Payment Method",
  send_outreach_email_with_discount: "Send Outreach Email (With Discount)",
  send_outreach_email_no_discount: "Send Outreach Email (No Discount)",
  escalate_to_human: "Escalate to Human",
};

const actionColors = {
  retry_payment: "bg-blue-100 text-blue-700",
  retry_payment_after_delay: "bg-blue-100 text-blue-700",
  send_email_update_payment_method: "bg-purple-100 text-purple-700",
  send_outreach_email_with_discount: "bg-green-100 text-green-700",
  send_outreach_email_no_discount: "bg-green-100 text-green-700",
  escalate_to_human: "bg-red-100 text-red-700",
};

const executionStatusColors = {
  pending: "bg-gray-100 text-gray-700",
  executing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const isSafeToExecute = (decision) => {
  return decision.guardrailStatus === "approved" || decision.reviewStatus === "approved_by_human";
};

const DecisionCard = ({ decision }) => {
  const { runExecution, getExecutionForDecision } = useExecution();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const execution = getExecutionForDecision(decision._id);
  const canExecute = isSafeToExecute(decision);

  const handleExecute = async () => {
    setError("");
    setRunning(true);
    try {
      await runExecution(decision._id);
    } catch (err) {
      setError(err.response?.data?.message || "Execution failed to run");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mt-3 border-t pt-3 space-y-2 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${actionColors[decision.recommendedAction]}`}
        >
          {actionLabels[decision.recommendedAction]}
        </span>
        <span className="text-xs text-gray-500">
          Confidence: {Math.round(decision.confidence * 100)}%
        </span>
      </div>

      <p className="text-sm text-gray-700">{decision.reasoning}</p>

      <div className="bg-white border rounded p-2">
        <p className="text-xs text-gray-400 mb-1">Cited policy text:</p>
        <p className="text-xs text-gray-600 italic">"{decision.citedPolicyText}"</p>
      </div>

      {!canExecute && !execution && (
        <p className="text-xs text-orange-600 bg-orange-50 rounded p-2">
          This decision is pending human review and cannot be executed yet.
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {execution ? (
        <div className="flex items-center justify-between bg-white border rounded p-2">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${executionStatusColors[execution.status]}`}
          >
            {execution.status}
          </span>
          <p className="text-xs text-gray-500 text-right">
            {execution.result || execution.errorMessage}
          </p>
        </div>
      ) : (
        canExecute && (
          <button
            onClick={handleExecute}
            disabled={running}
            className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {running ? "Executing..." : "Execute Action"}
          </button>
        )
      )}
    </div>
  );
};

export default DecisionCard;