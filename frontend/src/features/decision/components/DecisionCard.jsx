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

const DecisionCard = ({ decision }) => {
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
    </div>
  );
};

export default DecisionCard;