const express = require("express");
const {
  generateDecisionForEvent,
  getDecisions,
  getDecisionByEvent,
} = require("../controllers/decision.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/generate/:eventId", protect, generateDecisionForEvent);
router.get("/", protect, getDecisions);
router.get("/event/:eventId", protect, getDecisionByEvent);

module.exports = router;