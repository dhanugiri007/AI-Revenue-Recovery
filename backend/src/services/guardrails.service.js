const FORBIDDEN_ACTIONS_BY_FAILURE_REASON = {
  suspicious_transaction: ["retry_payment", "retry_payment_after_delay"],
  invalid_payment_method: ["retry_payment", "retry_payment_after_delay"],
  card_expired: ["retry_payment", "retry_payment_after_delay"],
};

const MIN_CONFIDENCE_THRESHOLD = 0.6;

const normalizeWhitespace = (text) => text.replace(/\s+/g, " ").trim();

const checkCitationGrounded = (decisionData, retrievedChunks) => {
  const citation = normalizeWhitespace(decisionData.citedPolicyText);
  const isGrounded = retrievedChunks.some((chunk) =>
    normalizeWhitespace(chunk.content).includes(citation)
  );
  return isGrounded ? null : "citation_not_found_in_retrieved_policy";
};


const checkConfidenceThreshold = (decisionData) => {
  return decisionData.confidence >= MIN_CONFIDENCE_THRESHOLD ? null : "low_confidence";
};


const checkForbiddenActionForFailureReason = (decisionData, event) => {
  const forbidden = FORBIDDEN_ACTIONS_BY_FAILURE_REASON[event.failureReason] || [];
  return forbidden.includes(decisionData.recommendedAction)
    ? "forbidden_action_for_failure_reason"
    : null;
};


const HIGH_VALUE_THRESHOLD = 100000;
const checkHighValueMustEscalate = (decisionData, event) => {
  if (event.amount > HIGH_VALUE_THRESHOLD && decisionData.recommendedAction !== "escalate_to_human") {
    return "high_value_transaction_not_escalated";
  }
  return null;
};


const checkOutreachRateLimit = async (decisionData, event, Decision) => {
  const outreachActions = [
    "send_email_update_payment_method",
    "send_outreach_email_with_discount",
    "send_outreach_email_no_discount",
  ];

  if (!outreachActions.includes(decisionData.recommendedAction)) {
    return null; // not an outreach action, rule doesn't apply
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentOutreach = await Decision.findOne({
    customer: event.customer,
    recommendedAction: { $in: outreachActions },
    guardrailStatus: "approved",
    createdAt: { $gte: twentyFourHoursAgo },
  });

  return recentOutreach ? "outreach_rate_limit_exceeded" : null;
};


const runGuardrails = async (decisionData, event, retrievedChunks, Decision) => {
  const flags = [];

  const citationFlag = checkCitationGrounded(decisionData, retrievedChunks);
  if (citationFlag) flags.push(citationFlag);

  const confidenceFlag = checkConfidenceThreshold(decisionData);
  if (confidenceFlag) flags.push(confidenceFlag);

  const forbiddenFlag = checkForbiddenActionForFailureReason(decisionData, event);
  if (forbiddenFlag) flags.push(forbiddenFlag);

  const highValueFlag = checkHighValueMustEscalate(decisionData, event);
  if (highValueFlag) flags.push(highValueFlag);

  const rateLimitFlag = await checkOutreachRateLimit(decisionData, event, Decision);
  if (rateLimitFlag) flags.push(rateLimitFlag);

  const guardrailStatus = flags.length === 0 ? "approved" : "blocked_needs_review";

  const notesMap = {
    citation_not_found_in_retrieved_policy:
      "The cited policy text could not be verified against the retrieved policy chunks.",
    low_confidence: `Confidence (${decisionData.confidence}) is below the required threshold (${MIN_CONFIDENCE_THRESHOLD}).`,
    forbidden_action_for_failure_reason: `Auto-retry is not permitted for failure reason "${event.failureReason}" - policy requires escalation.`,
    high_value_transaction_not_escalated: `Transactions above ${HIGH_VALUE_THRESHOLD} INR must always be escalated to a human.`,
    outreach_rate_limit_exceeded: "This customer has already received an outreach email in the last 24 hours.",
  };

  const guardrailNotes = flags.map((flag) => notesMap[flag]).join(" ");

  return { guardrailStatus, guardrailFlags: flags, guardrailNotes };
};

module.exports = { runGuardrails };