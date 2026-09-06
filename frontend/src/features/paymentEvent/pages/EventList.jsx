import { useState } from "react";
import { usePaymentEvent } from "../hooks/usePaymentEvent";
import { useCustomer } from "../../customer/hooks/useCustomer";
import { useCompany } from "../../company/hooks/useCompany";
import { useDecision } from "../../decision/hooks/useDecision";
import DecisionCard from "../../decision/components/DecisionCard";
import AuditTrail from "../../auditLog/components/AuditTrail";

const failureReasons = [
  "insufficient_funds",
  "card_expired",
  "bank_declined",
  "suspicious_transaction",
  "invalid_payment_method",
  "network_error",
];

const statusColors = {
  received: "bg-white/5 text-zinc-400 border-white/10",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  processed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30";

const EventList = () => {
  const { company } = useCompany();
  const { customers } = useCustomer();
  const { events, loading, simulateEvent } = usePaymentEvent();
  const { generateDecision, getDecisionForEvent } = useDecision();

  const [formData, setFormData] = useState({
    customerId: "",
    eventType: "payment_failed",
    failureReason: "insufficient_funds",
    amount: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [generatingId, setGeneratingId] = useState(null);
  const [decisionError, setDecisionError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await simulateEvent(formData);
      setFormData({ ...formData, customerId: "", amount: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to simulate event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateDecision = async (eventId) => {
    setDecisionError("");
    setGeneratingId(eventId);
    try {
      await generateDecision(eventId);
    } catch (err) {
      setDecisionError(err.response?.data?.message || "Failed to generate decision");
    } finally {
      setGeneratingId(null);
    }
  };

  if (!company) {
    return <p className="text-zinc-500 mt-10">Set up your company first before simulating payment events.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-600">Recovery Cases</p>
        <h1 className="text-2xl font-semibold text-white mt-1">Payment Events</h1>
      </div>

      {/* Simulate form */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-medium text-white mb-4">Simulate Payment Failure</h2>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <select name="customerId" value={formData.customerId} onChange={handleChange} className={inputClass} required>
            <option value="" className="bg-zinc-900">Select a customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id} className="bg-zinc-900">
                {c.name} ({c.email})
              </option>
            ))}
          </select>

          <select name="failureReason" value={formData.failureReason} onChange={handleChange} className={inputClass}>
            {failureReasons.map((reason) => (
              <option key={reason} value={reason} className="bg-zinc-900">
                {reason.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount (INR)"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={submitting || customers.length === 0}
            className="w-full rounded-full bg-white text-black py-2.5 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {submitting ? "Simulating..." : "Simulate Payment Failure"}
          </button>

          {customers.length === 0 && (
            <p className="text-xs text-zinc-600 text-center">Add a customer first before simulating events.</p>
          )}
        </form>
      </div>

      {/* Events timeline */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-medium text-white mb-4">Events</h2>

        {decisionError && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg mb-4">
            {decisionError}
          </p>
        )}

        {loading ? (
          <p className="text-zinc-500 text-sm">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-zinc-600 text-sm">No payment events yet.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => {
              const decision = getDecisionForEvent(event._id);

              return (
                <li key={event._id} className="rounded-lg border border-white/10 bg-black/20 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {event.customer?.name || "Unknown customer"}{" "}
                        <span className="text-zinc-600 text-xs">({event.customer?.email})</span>
                      </p>
                      <p className="text-xs text-zinc-500 capitalize mt-0.5">
                        {event.eventType.replace(/_/g, " ")}
                        {event.failureReason && ` — ${event.failureReason.replace(/_/g, " ")}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">₹{event.amount}</p>
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full border font-medium ${statusColors[event.status]}`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-2">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>

                  {decision ? (
                    <DecisionCard decision={decision} />
                  ) : (
                    <button
                      onClick={() => handleGenerateDecision(event._id)}
                      disabled={generatingId === event._id}
                      className="mt-3 rounded-full border border-white/15 bg-white/[0.03] text-white px-4 py-2 text-xs font-medium hover:bg-white/[0.08] transition disabled:opacity-50"
                    >
                      {generatingId === event._id ? "Generating decision..." : "Generate AI Decision"}
                    </button>
                  )}

                  <AuditTrail eventId={event._id} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventList;