const fs = require("fs");
const pdfParse = require("pdf-parse");
const Policy = require("../models/policy.model");
const Company = require("../models/company.model");

// @desc   Upload a policy document
// @route  POST /api/policies
const uploadPolicy = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(400).json({ message: "Create a company profile first" });
    }

    let extractedText = "";
    let fileType = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(dataBuffer);
      extractedText = parsed.text;
      fileType = "pdf";
    } else if (req.file.mimetype === "text/plain") {
      extractedText = fs.readFileSync(req.file.path, "utf-8");
      fileType = "text";
    }

    if (!extractedText || extractedText.trim().length === 0) {
      // cleanup the file if we couldn't get any usable text
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Could not extract text from file" });
    }

    const policy = await Policy.create({
      company: company._id,
      originalName: req.file.originalname,
      storedFileName: req.file.filename,
      fileType,
      extractedText,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      _id: policy._id,
      originalName: policy.originalName,
      fileType: policy.fileType,
      embeddingStatus: policy.embeddingStatus,
      createdAt: policy.createdAt,
      // not sending back extractedText here - keep the response light
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all policies for logged-in user's company
// @route  GET /api/policies
const getPolicies = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(400).json({ message: "Create a company profile first" });
    }

    const policies = await Policy.find({ company: company._id })
      .select("-extractedText") // don't send full text in list view
      .sort({ createdAt: -1 });

    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a policy document
// @route  DELETE /api/policies/:id
const deletePolicy = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(400).json({ message: "Create a company profile first" });
    }

    const policy = await Policy.findOne({ _id: req.params.id, company: company._id });
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    // delete the physical file too
    const filePath = require("path").join(
      __dirname,
      "../../uploads/policies",
      policy.storedFileName
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await policy.deleteOne();

    res.status(200).json({ message: "Policy deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadPolicy, getPolicies, deletePolicy };