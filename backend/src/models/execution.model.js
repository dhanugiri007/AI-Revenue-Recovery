const mongoose = require("mongoose");

const executionSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    decision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Decision",
      required: true,
      unique: true, // one execution per decision
    },
    action: {
      type: String,
      required: true, // copied from decision.recommendedAction at execution time
    },
    status: {
      type: String,
      enum: ["pending", "executing", "completed", "failed"],
      default: "pending",
    },
    executedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // whoever triggered execution (manual trigger for now)
    },
    result: {
      type: String, // human-readable outcome, e.g. "Mock email sent to customer@example.com"
    },
    errorMessage: {
      type: String, // populated only if status === "failed"
    },
    executedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Execution", executionSchema);