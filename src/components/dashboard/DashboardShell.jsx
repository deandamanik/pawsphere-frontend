import { Link, useNavigate } from "react-router-dom";
import { LuHouse } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo-Pawsphere.svg";

const ROLE_LABEL = {
  vet: "Dokter Hewan",
  shelter: "Pengelola Shelter",
  admin: "Administrator",
  user: "Pengguna",
};

export default function DashboardShell({ title, subtitle, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins flex flex-col">
      <header className="bg-brand-blue-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="PawSphere" className="h-9 w-auto" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white border border-white/20 font-semibold rounded-full text-sm hover:bg-white/20 transition-all"
            >
              <LuHouse className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <span className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center bg-white/10 shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {(user?.name || "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="text-right leading-tight">
                <span className="block font-semibold text-sm">{user?.name}</span>
                <span className="block text-white/70 text-xs">
                  {ROLE_LABEL[user?.role] || user?.role}
                </span>
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-white text-brand-orange border border-brand-orange font-bold rounded-full text-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-blue-darker">
            {title}
          </h1>
          {subtitle && (
            <p className="text-brand-blue-normal/90 mt-1 text-sm">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}