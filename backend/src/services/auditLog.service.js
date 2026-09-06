const AuditLog = require("../models/auditLog.model");

const logAuditEvent = async ({ company, paymentEvent, eventCategory, summary, metadata, actor }) => {
  try {
    await AuditLog.create({ company, paymentEvent, eventCategory, summary, metadata, actor });
  } catch (error) {
    
    console.error("Failed to write audit log:", error.message);
  }
};

module.exports = { logAuditEvent };