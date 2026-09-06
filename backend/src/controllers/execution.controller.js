const Execution = require("../models/execution.model");
const Decision = require("../models/decision.model");
const PaymentEvent = require("../models/paymentEvent.model");
const Customer = require("../models/customer.model");
const Company = require("../models/company.model");
const { executeAction } = require("../services/executor.service");
const { emitToCompany } = require("../config/socket");
const { logAuditEvent } = require("../services/auditLog.service");


const getCompanyOrFail = async (userId, res) => {
  const company = await Company.findOne({ owner: userId });
  if (!company) {
    res.status(400).json({ message: "Create a company profile first" });
    return null;
  }
  return company;
};

// A decision is only safe to execute if it was never blocked, OR if a human
// explicitly approved it after review.
const isSafeToExecute = (decision) => {
  if (decision.guardrailStatus === "approved") return true;
  if (decision.reviewStatus === "approved_by_human") return true;
  return false;
};

// @desc   Execute the recommended action for a decision
// @route  POST /api/executions/run/:decisionId
const runExecution = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const decision = await Decision.findOne({ _id: req.params.decisionId, company: company._id });
    if (!decision) {
      return res.status(404).json({ message: "Decision not found" });
    }

    if (!isSafeToExecute(decision)) {
      return res.status(400).json({
        message: "This decision is blocked and has not been approved by a human yet. It cannot be executed.",
      });
    }

    // Idempotent-style guard: don't re-execute the same decision twice
    const existingExecution = await Execution.findOne({ decision: decision._id });
    if (existingExecution) {
      return res.status(200).json({ message: "Already executed", execution: existingExecution });
    }

    const customer = await Customer.findById(decision.customer);
    const event = await PaymentEvent.findById(decision.paymentEvent);

    if (!customer || !event) {
      return res.status(404).json({ message: "Related customer or event not found" });
    }

    const execution = await Execution.create({
      company: company._id,
      decision: decision._id,
      action: decision.recommendedAction,
      status: "executing",
      executedBy: req.user._id,
    });

    try {
      const result = await executeAction(decision.recommendedAction, customer, event);
      execution.status = "completed";
      execution.result = result;
      execution.executedAt = new Date();
      await execution.save();

      emitToCompany(company._id.toString(), "execution:updated", execution);

      await logAuditEvent({
        company: company._id,
        paymentEvent: event._id,
        eventCategory: "action_executed",
        summary: `Action "${decision.recommendedAction}" executed successfully. ${result}`,
        metadata: { status: "completed", result },
        actor: req.user._id.toString(),
      });

      res.status(200).json({ message: "Execution completed", execution });
    } catch (execError) {
      execution.status = "failed";
      execution.errorMessage = execError.message;
      execution.executedAt = new Date();
      await execution.save();

      emitToCompany(company._id.toString(), "execution:updated", execution);

      await logAuditEvent({
        company: company._id,
        paymentEvent: event._id,
        eventCategory: "action_executed",
        summary: `Action "${decision.recommendedAction}" execution failed: ${execError.message}`,
        metadata: { status: "failed", errorMessage: execError.message },
        actor: req.user._id.toString(),
      });

      res.status(200).json({ message: "Execution failed", execution });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc   Get all executions for logged-in user's company
// @route  GET /api/executions
const getExecutions = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const executions = await Execution.find({ company: company._id })
      .populate({
        path: "decision",
        populate: { path: "customer", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(executions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { runExecution, getExecutions };