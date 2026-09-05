import { useState } from "react";
import { usePaymentEvent } from "../hooks/usePaymentEvent";
import { useCustomer } from "../../customer/hooks/useCustomer";
import { useCompany } from "../../company/hooks/useCompany";
import { useDecision } from "../../decision/hooks/useDecision";
import DecisionCard from "../../decision/components/DecisionCard";

const failureReasons = [
  "insufficient_funds",
  "card_expired",
  "bank_declined",
  "suspicious_transaction",
  "invalid_payment_method",
  "network_error",
];

const statusColors = {
  received: "bg-gray-100 text-gray-700",
  processing: "bg-blue-100 text-blue-700",
  processed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

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
    return (
      <p className="text-center mt-10 text-gray-500">
        Set up your company first before simulating payment events.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* Simulate form */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Simulate Payment Failure</h2>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>

          <select
            name="failureReason"
            value={formData.failureReason}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {failureReasons.map((reason) => (
              <option key={reason} value={reason}>
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
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={submitting || customers.length === 0}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Simulating..." : "Simulate Payment Failure"}
          </button>

          {customers.length === 0 && (
            <p className="text-xs text-gray-400 text-center">
              Add a customer first before simulating events.
            </p>
          )}
        </form>
      </div>

      {/* Events timeline */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Payment Events</h2>

        {decisionError && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mb-4">
            {decisionError}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No payment events yet.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => {
              const decision = getDecisionForEvent(event._id);

              return (
                <li key={event._id} className="border rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {event.customer?.name || "Unknown customer"}{" "}
                        <span className="text-gray-400 text-sm">
                          ({event.customer?.email})
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {event.eventType.replace(/_/g, " ")}
                        {event.failureReason &&
                          ` — ${event.failureReason.replace(/_/g, " ")}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{event.amount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[event.status]}`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>

                  {decision ? (
                    <DecisionCard decision={decision} />
                  ) : (
                    <button
                      onClick={() => handleGenerateDecision(event._id)}
                      disabled={generatingId === event._id}
                      className="mt-3 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {generatingId === event._id
                        ? "Generating decision..."
                        : "Generate AI Decision"}
                    </button>
                  )}
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