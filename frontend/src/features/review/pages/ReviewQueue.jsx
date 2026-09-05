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
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {decision.customer?.name}{" "}
          <span className="text-gray-400 text-sm">({decision.customer?.email})</span>
        </p>
        <span className="text-xs text-gray-500">
          Confidence: {Math.round(decision.confidence * 100)}%
        </span>
      </div>

      <p className="text-sm">
        <span className="text-gray-500">Event:</span>{" "}
        {decision.paymentEvent?.eventType?.replace(/_/g, " ")}
        {decision.paymentEvent?.failureReason &&
          ` — ${decision.paymentEvent.failureReason.replace(/_/g, " ")}`}{" "}
        (₹{decision.paymentEvent?.amount})
      </p>

      <p className="text-sm">
        <span className="text-gray-500">AI recommended:</span>{" "}
        <span className="font-medium">{actionLabels[decision.recommendedAction]}</span>
      </p>

      <p className="text-sm text-gray-700">{decision.reasoning}</p>

      <div className="bg-gray-50 border rounded p-2">
        <p className="text-xs text-gray-400 mb-1">Cited policy text:</p>
        <p className="text-xs text-gray-600 italic">"{decision.citedPolicyText}"</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {decision.guardrailFlags.map((flag) => (
          <span
            key={flag}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium"
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
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={submitting}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
        >
          {submitting ? "Saving..." : "Approve"}
        </button>
        <button
          onClick={handleReject}
          disabled={submitting}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
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
    return (
      <p className="text-center mt-10 text-gray-500">
        Set up your company first.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Review Queue</h2>

      {loading ? (
        <p className="text-gray-500">Loading pending reviews...</p>
      ) : pendingReviews.length === 0 ? (
        <p className="text-gray-500">No decisions pending review. All clear.</p>
      ) : (
        <div className="space-y-4">
          {pendingReviews.map((decision) => (
            <ReviewCard
              key={decision._id}
              decision={decision}
              onApprove={approveDecision}
              onReject={rejectDecision}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;