

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateOutcome = async (successMessage) => {
  await sleep(800); // pretend this is a real network call to a gateway/email service

  const isSuccess = Math.random() > 0.15; // ~85% success rate, so failures are testable
  if (!isSuccess) {
    throw new Error("Mock provider returned a temporary failure. Try again.");
  }
  return successMessage;
};

const executeRetryPayment = async (customer, event) => {
  return simulateOutcome(
    `[MOCKED] Payment retry attempted for ${customer.name} - amount ${event.amount} INR.`
  );
};

const executeRetryPaymentAfterDelay = async (customer, event) => {
  return simulateOutcome(
    `[MOCKED] Payment retry scheduled for ${customer.name} after 24h delay - amount ${event.amount} INR.`
  );
};

const executeSendEmailUpdatePaymentMethod = async (customer) => {
  return simulateOutcome(
    `[MOCKED] Email sent to ${customer.email} asking them to update their payment method.`
  );
};

const executeSendOutreachEmailWithDiscount = async (customer) => {
  return simulateOutcome(
    `[MOCKED] Outreach email with 10% discount sent to ${customer.email}.`
  );
};

const executeSendOutreachEmailNoDiscount = async (customer) => {
  return simulateOutcome(
    `[MOCKED] Standard outreach email (no discount) sent to ${customer.email}.`
  );
};

const executeEscalateToHuman = async (customer) => {
  return simulateOutcome(
    `[MOCKED] Case escalated - a task was created for the account manager regarding ${customer.name}.`
  );
};

const actionExecutors = {
  retry_payment: executeRetryPayment,
  retry_payment_after_delay: executeRetryPaymentAfterDelay,
  send_email_update_payment_method: executeSendEmailUpdatePaymentMethod,
  send_outreach_email_with_discount: executeSendOutreachEmailWithDiscount,
  send_outreach_email_no_discount: executeSendOutreachEmailNoDiscount,
  escalate_to_human: executeEscalateToHuman,
};

// Single entry point - looks up the right mock executor for the action and runs it
const executeAction = async (action, customer, event) => {
  const executor = actionExecutors[action];
  if (!executor) {
    throw new Error(`No executor defined for action: ${action}`);
  }
  return executor(customer, event);
};

module.exports = { executeAction };