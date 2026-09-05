import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import CompanySetup from "./features/company/pages/CompanySetup";
import PolicyList from "./features/policy/pages/PolicyList";
import CustomerList from "./features/customer/pages/CustomerList";
import CustomerForm from "./features/customer/pages/CustomerForm";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <div className="text-3xl font-bold text-center mt-10">Dashboard (Protected)</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/company",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/policies",
    element: (
      <ProtectedRoute>
        <PolicyList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute>
        <CustomerList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers/new",
    element: (
      <ProtectedRoute>
        <CustomerForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers/:id/edit",
    element: (
      <ProtectedRoute>
        <CustomerForm />
      </ProtectedRoute>
    ),
  },
]);