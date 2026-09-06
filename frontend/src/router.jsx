import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Dashboard from "./features/analytics/pages/Dashboard";
import CompanySetup from "./features/company/pages/CompanySetup";
import PolicyList from "./features/policy/pages/PolicyList";
import CustomerList from "./features/customer/pages/CustomerList";
import CustomerForm from "./features/customer/pages/CustomerForm";
import EventList from "./features/paymentEvent/pages/EventList";
import ReviewQueue from "./features/review/pages/ReviewQueue";
import LandingPage from './LandingPage';
import HowItWorks from "./How";
export const router = createBrowserRouter([
  
  { path: "/", element: <LandingPage/> },
  {path: "/how-it-works", element: <HowItWorks/>},
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/company", element: <CompanySetup /> },
      { path: "/policies", element: <PolicyList /> },
      { path: "/customers", element: <CustomerList /> },
      { path: "/customers/new", element: <CustomerForm /> },
      { path: "/customers/:id/edit", element: <CustomerForm /> },
      { path: "/events", element: <EventList /> },
      { path: "/reviews", element: <ReviewQueue /> },
    ],
  },
]);