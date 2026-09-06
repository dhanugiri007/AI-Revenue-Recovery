const express = require("express");
const { getAuditLogForEvent, getRecentAuditLogs } = require("../controllers/auditLog.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/event/:eventId", protect, getAuditLogForEvent);
router.get("/", protect, getRecentAuditLogs);

module.exports = router;