const AuditLog = require("../models/auditLog.model");
const Company = require("../models/company.model");

const getCompanyOrFail = async (userId, res) => {
  const company = await Company.findOne({ owner: userId });
  if (!company) {
    res.status(400).json({ message: "Create a company profile first" });
    return null;
  }
  return company;
};

// @desc   Get the full audit trail for a specific payment event, chronologically
// @route  GET /api/audit-logs/event/:eventId
const getAuditLogForEvent = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const logs = await AuditLog.find({
      company: company._id,
      paymentEvent: req.params.eventId,
    }).sort({ createdAt: 1 }); // chronological order - the story unfolds in sequence

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get recent audit logs across the whole company (for a general activity feed)
// @route  GET /api/audit-logs
const getRecentAuditLogs = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const logs = await AuditLog.find({ company: company._id })
      .populate("paymentEvent", "eventType failureReason amount")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAuditLogForEvent, getRecentAuditLogs };