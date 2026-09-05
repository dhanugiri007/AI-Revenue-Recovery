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
      reviewStatus: {
      type: String,
      enum: ["not_required", "pending_review", "approved_by_human", "rejected_by_human"],
      default: function () {
        return this.guardrailStatus === "blocked_needs_review" ? "pending_review" : "not_required";
      },
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewNotes: {
      type: String, // human's note on why they approved/rejected
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Decision", decisionSchema);