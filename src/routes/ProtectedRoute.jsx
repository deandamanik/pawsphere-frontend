import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homeForRole } from "../config/roles";
import Mascot from "../components/ui/Mascot";

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue-light">
      <div className="flex flex-col items-center gap-3">
        <Mascot state="loading" size={120} />
        <p className="text-brand-blue-normal text-sm font-semibold">Memuat…</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ allow }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to={homeForRole(role)} replace />;
  }

  return <Outlet />;
}