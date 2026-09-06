const express = require("express");
const { getSummary, getTimeline } = require("../controllers/analytics.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/timeline", protect, getTimeline);

module.exports = router;