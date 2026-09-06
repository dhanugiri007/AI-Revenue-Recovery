const PaymentEvent = require("../models/paymentEvent.model");
const Decision = require("../models/decision.model");
const Execution = require("../models/execution.model");
const Company = require("../models/company.model");

const getCompanyOrFail = async (userId, res) => {
  const company = await Company.findOne({ owner: userId });
  if (!company) {
    res.status(400).json({ message: "Create a company profile first" });
    return null;
  }
  return company;
};

// @desc   Get summary stats for the dashboard
// @route  GET /api/analytics/summary
const getSummary = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const [
      totalEvents,
      totalDecisions,
      blockedDecisions,
      pendingReviews,
      decisionsByAction,
      executionsByStatus,
    ] = await Promise.all([
      PaymentEvent.countDocuments({ company: company._id }),
      Decision.countDocuments({ company: company._id }),
      Decision.countDocuments({ company: company._id, guardrailStatus: "blocked_needs_review" }),
      Decision.countDocuments({ company: company._id, reviewStatus: "pending_review" }),

      // Group decisions by recommendedAction - powers a bar/pie chart
      Decision.aggregate([
        { $match: { company: company._id } },
        { $group: { _id: "$recommendedAction", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Group executions by status - powers a success/failure breakdown
      Execution.aggregate([
        { $match: { company: company._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const guardrailBlockRate = totalDecisions > 0 ? blockedDecisions / totalDecisions : 0;

    res.status(200).json({
      totalEvents,
      totalDecisions,
      blockedDecisions,
      pendingReviews,
      guardrailBlockRate,
      decisionsByAction, // [{ _id: "retry_payment", count: 5 }, ...]
      executionsByStatus, // [{ _id: "completed", count: 8 }, { _id: "failed", count: 2 }]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get event volume over time (for a trend chart)
// @route  GET /api/analytics/timeline
const getTimeline = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    // Group payment events by calendar day - shows volume trend over time
    const timeline = await PaymentEvent.aggregate([
      { $match: { company: company._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(timeline); // [{ _id: "2026-09-05", count: 4 }, ...]
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary, getTimeline };