const express = require("express");
const { runExecution, getExecutions } = require("../controllers/execution.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/run/:decisionId", protect, runExecution);
router.get("/", protect, getExecutions);

module.exports = router;