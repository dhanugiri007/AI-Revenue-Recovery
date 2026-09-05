const mongoose = require("mongoose");

const decisionSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    paymentEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentEvent",
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    recommendedAction: {
      type: String,
      enum: [
        "retry_payment",
        "retry_payment_after_delay",
        "send_email_update_payment_method",
        "send_outreach_email_with_discount",
        "send_outreach_email_no_discount",
        "escalate_to_human",
      ],
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    reasoning: {
      type: String,
      required: true,
    },
    citedPolicyText: {
      type: String,
      required: true,
    },
    retrievedChunks: [
      {
        policyId: String,
        originalName: String,
        content: String,
      },
    ],
    modelUsed: {
      type: String,
      default: "gemini-2.5-flash",
    },

    // ---- Guardrails (new) ----
    guardrailStatus: {
      type: String,
      enum: ["approved", "blocked_needs_review"],
      required: true,
    },
    guardrailFlags: [
      {
        type: String,
      },
    ],
    guardrailNotes: {
      type: String, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Decision", decisionSchema);