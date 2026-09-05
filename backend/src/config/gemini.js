const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

const decisionResponseSchema = {
  type: "OBJECT",
  properties: {
    recommendedAction: {
      type: "STRING",
      enum: [
        "retry_payment",
        "retry_payment_after_delay",
        "send_email_update_payment_method",
        "send_outreach_email_with_discount",
        "send_outreach_email_no_discount",
        "escalate_to_human",
      ],
    },
    confidence: {
      type: "NUMBER",
      description: "A value between 0 and 1 representing how confident the model is in this decision.",
    },
    reasoning: {
      type: "STRING",
      description: "A clear explanation of why this action was chosen, referencing the specific situation.",
    },
    citedPolicyText: {
      type: "STRING",
      description: "The exact excerpt from the provided policy context that justifies this decision.",
    },
  },
  required: ["recommendedAction", "confidence", "reasoning", "citedPolicyText"],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDecisionFromGemini = async (prompt, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: decisionResponseSchema,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      return JSON.parse(rawText);
    }

    if (response.status === 503 && attempt < retries) {
      const waitTime = attempt * 2000; // 2s, then 4s, then 6s
      console.log(`Gemini 503, retrying in ${waitTime}ms (attempt ${attempt}/${retries})`);
      await sleep(waitTime);
      continue;
    }

    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }
};

module.exports = { getDecisionFromGemini };