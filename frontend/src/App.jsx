import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./features/auth/auth.context";
import { CompanyProvider } from "./features/company/company.context";
import { PolicyProvider } from "./features/policy/policy.context";
import { CustomerProvider } from "./features/customer/customer.context";
import { PaymentEventProvider } from "./features/paymentEvent/paymentEvent.context";
import { DecisionProvider } from "./features/decision/decision.context";
import { ExecutionProvider } from "./features/execution/execution.context";
import { ReviewProvider } from "./features/review/review.context";
import { AuditLogProvider } from "./features/auditLog/auditLog.context";
import { AnalyticsProvider } from "./features/analytics/analytics.context";

function App() {
  return (
<AuthProvider>
  <CompanyProvider>
    <PolicyProvider>
      <CustomerProvider>
        <PaymentEventProvider>
          <DecisionProvider>
            <ReviewProvider>
              <ExecutionProvider>
                <AuditLogProvider>
                  <AnalyticsProvider>
                    <RouterProvider router={router} />
                  </AnalyticsProvider>
                </AuditLogProvider>
              </ExecutionProvider>
            </ReviewProvider>
          </DecisionProvider>
        </PaymentEventProvider>
      </CustomerProvider>
    </PolicyProvider>
  </CompanyProvider>
</AuthProvider>
  );
}

export default App;