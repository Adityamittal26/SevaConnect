import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // not logged in
  if (!token) {
    return <Navigate to="/" />;
  }

  // wrong role → redirect to correct dashboard
  if (role && userRole !== role) {
    if (userRole === "VOLUNTEER") {
      return <Navigate to="/volunteer" />;
    }

    if (userRole === "ORGANIZATION") {
      return <Navigate to="/organization" />;
    }
  }

  return children;
}