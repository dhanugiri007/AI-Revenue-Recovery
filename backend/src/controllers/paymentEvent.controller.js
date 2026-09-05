const crypto = require("crypto");
const PaymentEvent = require("../models/paymentEvent.model");
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

// @desc   Simulate an incoming payment event (stand-in for a real gateway webhook)
// @route  POST /api/payment-events/simulate
const simulateEvent = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const { customerId, eventType, failureReason, amount } = req.body;

    if (!customerId || !eventType || !amount) {
      return res.status(400).json({ message: "customerId, eventType, and amount are required" });
    }

    const customer = await Customer.findOne({ _id: customerId, company: company._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // A real gateway sends its own event id. We generate one to simulate it.
    const providerEventId = `evt_${crypto.randomBytes(12).toString("hex")}`;

    const event = await PaymentEvent.create({
      company: company._id,
      customer: customer._id,
      providerEventId,
      eventType,
      failureReason: eventType === "payment_failed" ? failureReason : undefined,
      amount,
      rawPayload: req.body,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Ingest a payment event by an explicit providerEventId (used to prove idempotency)
// @route  POST /api/payment-events/ingest
// This mimics what a REAL webhook handler would look like: the gateway
// sends its own event ID, and if we've seen it before, we don't reprocess it.
const ingestEvent = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const { customerId, providerEventId, eventType, failureReason, amount } = req.body;

    if (!customerId || !providerEventId || !eventType || !amount) {
      return res.status(400).json({
        message: "customerId, providerEventId, eventType, and amount are required",
      });
    }

    // Check first, so we can respond clearly that this was a duplicate
    // (rather than relying only on the DB throwing an error)
    const existingEvent = await PaymentEvent.findOne({ company: company._id, providerEventId });
    if (existingEvent) {
      return res.status(200).json({
        message: "Event already processed (duplicate ignored)",
        event: existingEvent,
        duplicate: true,
      });
    }

    const customer = await Customer.findOne({ _id: customerId, company: company._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const event = await PaymentEvent.create({
      company: company._id,
      customer: customer._id,
      providerEventId,
      eventType,
      failureReason: eventType === "payment_failed" ? failureReason : undefined,
      amount,
      rawPayload: req.body,
    });

    res.status(201).json({ message: "Event ingested", event, duplicate: false });
  } catch (error) {
    // Safety net: if two requests race each other and both pass the findOne
    // check before either finishes creating, MongoDB's unique index catches
    // the duplicate here and throws code 11000.
    if (error.code === 11000) {
      const existingEvent = await PaymentEvent.findOne({
        company: req.user.company,
        providerEventId: req.body.providerEventId,
      });
      return res.status(200).json({
        message: "Event already processed (duplicate ignored)",
        event: existingEvent,
        duplicate: true,
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all payment events for logged-in user's company
// @route  GET /api/payment-events
const getEvents = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

    const events = await PaymentEvent.find({ company: company._id })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single payment event
// @route  GET /api/payment-events/:id
const getEvent = async (req, res) => {
  try {
    const company = await getCompanyOrFail(req.user._id, res);
    if (!company) return;

   const event = await PaymentEvent.create({
  company: company._id,
  customer: customer._id,
  providerEventId,
  eventType,
  failureReason: eventType === "payment_failed" ? failureReason : undefined,
  amount,
  rawPayload: req.body,
});

const populatedEvent = await event.populate("customer", "name email");

res.status(201).json(populatedEvent);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { simulateEvent, ingestEvent, getEvents, getEvent };