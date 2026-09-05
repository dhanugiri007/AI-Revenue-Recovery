const { retrievePolicyContext } = require("./rag.service");
const { getDecisionFromGemini } = require("../config/gemini");

// Builds a natural-language description of the situation, used both as the
// RAG retrieval query and as part of the prompt sent to Gemini.
const buildSituationDescription = (event, customer) => {
  const monthsActive = Math.floor(
    (Date.now() - new Date(customer.activeSince)) / (1000 * 60 * 60 * 24 * 30)
  );

  return `
A payment of ${event.amount} INR failed for a ${customer.customerType} customer.
Failure reason: ${event.failureReason}.
Customer has been active for approximately ${monthsActive} months.
Customer's current outstanding balance: ${customer.outstandingBalance} INR.
Customer has an active support ticket: ${customer.hasActiveSupportTicket ? "yes" : "no"}.
  `.trim();
};

const buildPrompt = (situationDescription, policyChunks) => {
  const policyContext = policyChunks
    .map((chunk, i) => `[Policy excerpt ${i + 1} from "${chunk.originalName}"]\n${chunk.content}`)
    .join("\n\n");

  return `
You are a payment recovery decision engine. You must decide the correct recovery action for the situation below, based STRICTLY on the company's policy excerpts provided. Do not invent rules that aren't in the policy text. If the policy doesn't clearly cover this exact situation, choose "escalate_to_human" and set a lower confidence score.

SITUATION:
${situationDescription}

COMPANY POLICY (retrieved as most relevant to this situation):
${policyContext}

Respond with the recommended action, your confidence (0 to 1), your reasoning, and the exact policy text that justifies your decision.
  `.trim();
};

// The main entry point: event + customer -> a structured decision
const generateDecision = async (event, customer) => {
  const situationDescription = buildSituationDescription(event, customer);

  const policyChunks = await retrievePolicyContext(event.company, situationDescription, 4);

  if (policyChunks.length === 0) {
    // No policies uploaded at all - can't ground a decision, so don't fake one
    throw new Error("No policy documents found for this company. Upload a policy before generating decisions.");
  }

  const prompt = buildPrompt(situationDescription, policyChunks);
  const decisionData = await getDecisionFromGemini(prompt);

  return { decisionData, policyChunks };
};

module.exports = { generateDecision };