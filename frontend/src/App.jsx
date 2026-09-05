import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./features/auth/auth.context";
import { CompanyProvider } from "./features/company/company.context";
import { PolicyProvider } from "./features/policy/policy.context";
import { CustomerProvider } from "./features/customer/customer.context";

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <PolicyProvider>
          <CustomerProvider>
            <RouterProvider router={router} />
          </CustomerProvider>
        </PolicyProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;