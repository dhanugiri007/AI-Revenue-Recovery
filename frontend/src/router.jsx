import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import CompanySetup from "./features/company/pages/CompanySetup";
import PolicyList from "./features/policy/pages/PolicyList";
import CustomerList from "./features/customer/pages/CustomerList";
import CustomerForm from "./features/customer/pages/CustomerForm";
import EventList from "./features/paymentEvent/pages/EventList";
import ReviewQueue from "./features/review/pages/ReviewQueue";
import Dashboard from "./features/analytics/pages/Dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
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
  {
    path: "/events",
    element: (
      <ProtectedRoute>
        <EventList />
      </ProtectedRoute>
    ),
  },
   {
    path: "/reviews",
    element: (
      <ProtectedRoute>
        <ReviewQueue />
      </ProtectedRoute>
    ),
  },

]);