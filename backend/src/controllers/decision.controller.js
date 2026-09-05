const Decision = require("../models/decision.model");
const PaymentEvent = require("../models/paymentEvent.model");
const Customer = require("../models/customer.model");
const Company = require("../models/company.model");
const { generateDecision } = require("../services/decisionEngine.service");

const getCompanyOrFail = async (userId, res) => {
  const company = await Company.findOne({ owner: userId });
  if (!company) {
    res.status(400).json({ message: "Create a company profile first" });
    return null;
  }
  return company;
};

// @desc   Generate (or fetch existing) AI decision for a payment event
// @route  POST /api/decisions/generate/:eventId
const generateDecisionForEvent = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const event = await PaymentEvent.findOne({ _id: req.params.eventId, company: company._id });
    if (!event) {
      return res.status(404).json({ message: "Payment event not found" });
    }

    // Idempotent-style guard: don't waste API quota re-generating an existing decision
    const existingDecision = await Decision.findOne({ paymentEvent: event._id });
    if (existingDecision) {
      return res.status(200).json({ message: "Decision already exists", decision: existingDecision });
    }

    const customer = await Customer.findById(event.customer);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found for this event" });
    }

    event.status = "processing";
    await event.save();

    let decisionData, policyChunks;
    try {
      const result = await generateDecision(event, customer);
      decisionData = result.decisionData;
      policyChunks = result.policyChunks;
    } catch (genError) {
      event.status = "failed";
      await event.save();
      return res.status(500).json({ message: genError.message });
    }

    const decision = await Decision.create({
      company: company._id,
      paymentEvent: event._id,
      customer: customer._id,
      recommendedAction: decisionData.recommendedAction,
      confidence: decisionData.confidence,
      reasoning: decisionData.reasoning,
      citedPolicyText: decisionData.citedPolicyText,
      retrievedChunks: policyChunks,
    });

    event.status = "processed";
    await event.save();

    res.status(201).json({ message: "Decision generated", decision });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all decisions for logged-in user's company
// @route  GET /api/decisions
const getDecisions = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const decisions = await Decision.find({ company: company._id })
      .populate("customer", "name email")
      .populate("paymentEvent", "eventType failureReason amount")
      .sort({ createdAt: -1 });

    res.status(200).json(decisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single decision by payment event id
// @route  GET /api/decisions/event/:eventId
const getDecisionByEvent = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const decision = await Decision.findOne({
      paymentEvent: req.params.eventId,
      company: company._id,
    }).populate("customer", "name email");

    if (!decision) {
      return res.status(404).json({ message: "No decision found for this event" });
    }

    res.status(200).json(decision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateDecisionForEvent, getDecisions, getDecisionByEvent };