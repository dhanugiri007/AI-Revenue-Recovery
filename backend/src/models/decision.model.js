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
      unique: true, // one decision per event - re-generating returns the existing one instead
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
      type: Number, // 0 to 1
      required: true,
      min: 0,
      max: 1,
    },
    reasoning: {
      type: String, // Gemini's explanation, in its own words
      required: true,
    },
    citedPolicyText: {
      type: String, // the exact policy excerpt Gemini used to justify the action
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
      default: "gemini-3.7-flash",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Decision", decisionSchema);