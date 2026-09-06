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

const executionStatusColors = {
  pending: "bg-white/5 text-zinc-400 border-white/10",
  executing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
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
    <div className="mt-3 border-t border-white/10 pt-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 uppercase tracking-wider">
          {actionLabels[decision.recommendedAction]}
        </span>
        <span className="text-xs text-zinc-600">
          Confidence: {Math.round(decision.confidence * 100)}%
        </span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">{decision.reasoning}</p>

      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Cited policy text</p>
        <p className="text-xs text-zinc-500 italic">"{decision.citedPolicyText}"</p>
      </div>

      {!canExecute && !execution && (
        <p className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
          This decision is pending human review and cannot be executed yet.
        </p>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {execution ? (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-3">
          <span
            className={`text-[10px] px-2 py-1 rounded-full border font-medium ${executionStatusColors[execution.status]}`}
          >
            {execution.status}
          </span>
          <p className="text-xs text-zinc-500 text-right">
            {execution.result || execution.errorMessage}
          </p>
        </div>
      ) : (
        canExecute && (
          <button
            onClick={handleExecute}
            disabled={running}
            className="rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {running ? "Executing..." : "Execute Action"}
          </button>
        )
      )}
    </div>
  );
};

export default DecisionCard;

