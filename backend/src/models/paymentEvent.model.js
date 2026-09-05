const mongoose = require("mongoose");

const paymentEventSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    providerEventId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["payment_failed", "payment_succeeded"],
      required: true,
    },
    failureReason: {
      type: String,
      enum: [
        "insufficient_funds",
        "card_expired",
        "bank_declined",
        "suspicious_transaction",
        "invalid_payment_method",
        "network_error",
      ],
      required: function () {
        return this.eventType === "payment_failed";
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["received", "processing", "processed", "failed"],
      default: "received",
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed, // stores whatever the "gateway" sent, for the audit trail later
    },
  },
  { timestamps: true }
);


paymentEventSchema.index({ company: 1, providerEventId: 1 }, { unique: true });

module.exports = mongoose.model("PaymentEvent", paymentEventSchema);