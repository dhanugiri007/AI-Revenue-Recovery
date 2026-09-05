import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import CompanySetup from "./features/company/pages/CompanySetup";
import PolicyList from "./features/policy/pages/PolicyList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <div className="text-3xl font-bold text-center mt-10">
          Dashboard (Protected)
        </div>
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
]);