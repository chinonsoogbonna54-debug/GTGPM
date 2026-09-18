import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any admin-only page with this. If there's no valid token in
// AuthContext, the visitor is bounced to the login page instead.
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  return children;
}
