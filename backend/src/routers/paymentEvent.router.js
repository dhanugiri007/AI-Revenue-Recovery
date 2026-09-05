const express = require("express");
const {
  simulateEvent,
  ingestEvent,
  getEvents,
  getEvent,
} = require("../controllers/paymentEvent.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/simulate", protect, simulateEvent);
router.post("/ingest", protect, ingestEvent);
router.get("/", protect, getEvents);
router.get("/:id", protect, getEvent);

module.exports = router;