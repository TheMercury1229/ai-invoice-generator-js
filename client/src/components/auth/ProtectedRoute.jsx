import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  //  If loading
  if (loading) {
    return <div>Loading...</div>;
  }
  // If not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>;
}
