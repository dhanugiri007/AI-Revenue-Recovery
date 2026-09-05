const Customer = require("../models/customer.model");
const Company = require("../models/company.model");

const getCompanyOrFail = async (userId, res) => {
  const company = await Company.findOne({ owner: userId });
  if (!company) {
    res.status(400).json({ message: "Create a company profile first" });
    return null;
  }
  return company;
};

// @desc   Create a customer
// @route  POST /api/customers
const createCustomer = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const { name, email, customerType, activeSince, outstandingBalance, hasActiveSupportTicket } = req.body;

    if (!name || !email || !activeSince) {
      return res.status(400).json({ message: "Name, email, and activeSince are required" });
    }

    const customer = await Customer.create({
      company: company._id,
      name,
      email,
      customerType,
      activeSince,
      outstandingBalance,
      hasActiveSupportTicket,
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Customer with this email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all customers for logged-in user's company
// @route  GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const customers = await Customer.find({ company: company._id }).sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single customer
// @route  GET /api/customers/:id
const getCustomer = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const customer = await Customer.findOne({ _id: req.params.id, company: company._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update a customer
// @route  PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, company: company._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a customer
// @route  DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const customer = await Customer.findOneAndDelete({ _id: req.params.id, company: company._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer };