const express = require("express");
const { createCompany, getMyCompany, updateMyCompany } = require("../controllers/company.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, createCompany);
router.get("/me", protect, getMyCompany);
router.put("/me", protect, updateMyCompany);

module.exports = router;