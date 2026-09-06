import { useState } from "react";
import { useReview } from "../hooks/useReview";
import { useCompany } from "../../company/hooks/useCompany";

const actionLabels = {
  retry_payment: "Retry Payment",
  retry_payment_after_delay: "Retry Payment (After Delay)",
  send_email_update_payment_method: "Send Email: Update Payment Method",
  send_outreach_email_with_discount: "Send Outreach Email (With Discount)",
  send_outreach_email_no_discount: "Send Outreach Email (No Discount)",
  escalate_to_human: "Escalate to Human",
};

const flagLabels = {
  citation_not_found_in_retrieved_policy: "Citation could not be verified",
  low_confidence: "Low confidence",
  forbidden_action_for_failure_reason: "Forbidden action for this failure type",
  high_value_transaction_not_escalated: "High-value transaction not escalated",
  outreach_rate_limit_exceeded: "Outreach rate limit exceeded",
};

const ReviewCard = ({ decision, onApprove, onReject }) => {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    setError("");
    setSubmitting(true);
    try {
      await onApprove(decision._id, notes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      setError("Notes are required when rejecting a decision");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onReject(decision._id, notes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">
          {decision.customer?.name}{" "}
          <span className="text-zinc-600 text-xs">({decision.customer?.email})</span>
        </p>
        <span className="text-xs text-zinc-600">
          Confidence: {Math.round(decision.confidence * 100)}%
        </span>
      </div>

      <p className="text-xs text-zinc-500">
        Event: {decision.paymentEvent?.eventType?.replace(/_/g, " ")}
        {decision.paymentEvent?.failureReason && ` — ${decision.paymentEvent.failureReason.replace(/_/g, " ")}`}{" "}
        (₹{decision.paymentEvent?.amount})
      </p>

      <p className="text-xs text-zinc-500">
        AI recommended:{" "}
        <span className="text-white font-medium">{actionLabels[decision.recommendedAction]}</span>
      </p>

      <p className="text-sm text-zinc-400 leading-relaxed">{decision.reasoning}</p>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
        <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Cited policy text</p>
        <p className="text-xs text-zinc-500 italic">"{decision.citedPolicyText}"</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {decision.guardrailFlags.map((flag) => (
          <span
            key={flag}
            className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-full font-medium"
          >
            {flagLabels[flag] || flag}
          </span>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add a note (required for rejection)..."
        rows={2}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={submitting}
          className="flex-1 rounded-full bg-white text-black py-2 text-xs font-medium hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Approve"}
        </button>
        <button
          onClick={handleReject}
          disabled={submitting}
          className="flex-1 rounded-full border border-red-500/30 text-red-400 py-2 text-xs font-medium hover:bg-red-500/10 transition disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Reject"}
        </button>
      </div>
    </div>
  );
};

const ReviewQueue = () => {
  const { company } = useCompany();
  const { pendingReviews, loading, approveDecision, rejectDecision } = useReview();

  if (!company) {
    return <p className="text-zinc-500 mt-10">Set up your company first.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-600">Human Review</p>
        <h1 className="text-2xl font-semibold text-white mt-1">Review Queue</h1>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading pending reviews...</p>
      ) : pendingReviews.length === 0 ? (
        <p className="text-zinc-600 text-sm">No decisions pending review. All clear.</p>
      ) : (
        <div className="space-y-4">
          {pendingReviews.map((decision) => (
            <ReviewCard key={decision._id} decision={decision} onApprove={approveDecision} onReject={rejectDecision} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;