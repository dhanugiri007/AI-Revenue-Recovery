const express = require("express");
const {
  getPendingReviews,
  approveDecision,
  rejectDecision,
} = require("../controllers/review.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/pending", protect, getPendingReviews);
router.put("/:id/approve", protect, approveDecision);
router.put("/:id/reject", protect, rejectDecision);

module.exports = router;