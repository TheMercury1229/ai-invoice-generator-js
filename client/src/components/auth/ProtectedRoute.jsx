import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
export function ProtectedRoute({ children }) {
  const isAuthenticated = true;
  const loading = false;

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
