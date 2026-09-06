const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
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
    },
    eventCategory: {
      type: String,
      enum: [
        "policy_retrieved",
        "ai_decision_made",
        "guardrail_blocked",
        "human_reviewed",
        "action_executed",
      ],
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    actor: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);


auditLogSchema.index({ company: 1, paymentEvent: 1, createdAt: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);