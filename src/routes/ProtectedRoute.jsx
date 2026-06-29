// ============================================================
// Route guard used in two ways:
//
//   <Route element={<ProtectedRoute />}>            // any logged-in user
//   <Route element={<ProtectedRoute allow={["vet"]} />}>  // role-restricted
//
// Behaviour:
//   - still restoring session  -> show a small loader (no flicker)
//   - not logged in            -> redirect to /login (remember target)
//   - logged in, wrong role    -> redirect to that role's own home
//   - allowed                  -> render the nested <Outlet />
// ============================================================

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homeForRole } from "../config/roles";

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue-light">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-brand-blue-normal/30 border-t-brand-blue-normal animate-spin" />
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
    // Logged in but not permitted here -> send to where they belong.
    return <Navigate to={homeForRole(role)} replace />;
  }

  return <Outlet />;
}