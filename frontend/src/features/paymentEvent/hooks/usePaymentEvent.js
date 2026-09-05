import { useContext } from "react";
import { PaymentEventContext } from "../paymentEvent.context";

export const usePaymentEvent = () => {
  const context = useContext(PaymentEventContext);
  if (!context) {
    throw new Error("usePaymentEvent must be used within a PaymentEventProvider");
  }
  return context;
};