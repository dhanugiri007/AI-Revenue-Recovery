const express = require("express");
const { uploadPolicy, getPolicies, deletePolicy,testRetrieve } = require("../controllers/policy.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadPolicy);
router.get("/", protect, getPolicies);
router.delete("/:id", protect, deletePolicy);
router.post("/test-retrieve", protect, testRetrieve);


module.exports = router;