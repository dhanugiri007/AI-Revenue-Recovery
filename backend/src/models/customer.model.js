const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
    },
    customerType: {
      type: String,
      enum: ["individual", "business"],
      default: "individual",
    },
    activeSince: {
      type: Date,
      required: [true, "Active since date is required"], // used for "new customer" / "6+ months" policy rules
    },
    outstandingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    hasActiveSupportTicket: {
      type: Boolean,
      default: false, // used for the "active support ticket" escalation rule
    },
  },
  { timestamps: true }
);

customerSchema.index({ company: 1, email: 1 }, { unique: true }); // no duplicate customer email within same company

module.exports = mongoose.model("Customer", customerSchema);