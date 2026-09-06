const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/auth.router");
const companyRouter = require("./routers/company.router");
const policyRouter = require("./routers/policy.router");
const customerRouter = require("./routers/customer.router");
const paymentEventRouter = require("./routers/paymentEvent.router");
const decisionRouter = require("./routers/decision.router");
const reviewRouter = require("./routers/review.router");
const executionRouter = require("./routers/execution.router");
const auditLogRouter = require("./routers/auditLog.router");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/policies", policyRouter);
app.use("/api/customers", customerRouter);
app.use("/api/payment-events", paymentEventRouter);
app.use("/api/decisions", decisionRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/executions", executionRouter);
app.use("/api/audit-logs", auditLogRouter);

module.exports = app;