import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking your session....</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PublicRoute;