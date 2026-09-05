const Decision = require("../models/decision.model");
const Company = require("../models/company.model");
const { emitToCompany } = require("../config/socket");

const getCompanyOrFail = async (userId, res) => {
  const company = await Company.findOne({ owner: userId });
  if (!company) {
    res.status(400).json({ message: "Create a company profile first" });
    return null;
  }
  return company;
};

// @desc   Get all decisions pending human review
// @route  GET /api/reviews/pending
const getPendingReviews = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const decisions = await Decision.find({
      company: company._id,
      reviewStatus: "pending_review",
    })
      .populate("customer", "name email")
      .populate("paymentEvent", "eventType failureReason amount")
      .sort({ createdAt: -1 });

    res.status(200).json(decisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Approve a blocked decision (human confirms the recommended action is actually fine)
// @route  PUT /api/reviews/:id/approve
const approveDecision = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const { notes } = req.body;

    const decision = await Decision.findOne({ _id: req.params.id, company: company._id });
    if (!decision) {
      return res.status(404).json({ message: "Decision not found" });
    }

    if (decision.reviewStatus !== "pending_review") {
      return res.status(400).json({ message: "This decision is not pending review" });
    }

    decision.reviewStatus = "approved_by_human";
    decision.reviewedBy = req.user._id;
    decision.reviewNotes = notes || "";
    decision.reviewedAt = new Date();
    await decision.save();

    res.status(200).json({ message: "Decision approved", decision });
    emitToCompany(company._id.toString(), "decision:reviewed", decision);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Reject a blocked decision (human confirms the AI got it wrong)
// @route  PUT /api/reviews/:id/reject
const rejectDecision = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const { notes } = req.body;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({ message: "Notes are required when rejecting a decision" });
    }

    const decision = await Decision.findOne({ _id: req.params.id, company: company._id });
    if (!decision) {
      return res.status(404).json({ message: "Decision not found" });
    }

    if (decision.reviewStatus !== "pending_review") {
      return res.status(400).json({ message: "This decision is not pending review" });
    }

    decision.reviewStatus = "rejected_by_human";
    decision.reviewedBy = req.user._id;
    decision.reviewNotes = notes;
    decision.reviewedAt = new Date();
    await decision.save();

    res.status(200).json({ message: "Decision rejected", decision });
  emitToCompany(company._id.toString(), "decision:reviewed", decision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPendingReviews, approveDecision, rejectDecision };