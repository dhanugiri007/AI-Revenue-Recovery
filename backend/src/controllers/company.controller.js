const Company = require("../models/company.model");

// @desc   Create company profile (one per user)
// @route  POST /api/companies
const createCompany = async (req, res) => {
  try {
    const { name, industry } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const existing = await Company.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Company already exists for this user" });
    }

    const company = await Company.create({
      name,
      industry,
      owner: req.user._id,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in user's company
// @route  GET /api/companies/me
const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(404).json({ message: "No company found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update company profile
// @route  PUT /api/companies/me
const updateMyCompany = async (req, res) => {
  try {
    const { name, industry } = req.body;

    const company = await Company.findOneAndUpdate(
      { owner: req.user._id },
      { name, industry },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: "No company found" });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCompany, getMyCompany, updateMyCompany };