// src/components/dashboard/DashboardShell.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuGlobe,
  LuUser,
  LuLogOut,
  LuBell,
  LuSearch,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo-Pawsphere.svg";
import ConfirmModal from "../ui/ConfirmModal";

const ROLE_LABEL = {
  vet: "Dokter Hewan",
  shelter: "Pengelola Shelter",
  klinik: "Pengelola Klinik",
  admin: "Administrator",
  user: "Pengguna",
};

/**
 * Konfigurasi menu sidebar per-role.
 * Satu-satunya tempat untuk menamb/ubah menu — sesuaikan `to` dengan AppRouter-mu.
 */
const NAV_BY_ROLE = {
  klinik: [
    {
      title: "Operasional",
      items: [
        { label: "Dashboard", to: "/dashboard/klinik", icon: LuLayoutDashboard, end: true },
      ],
    },
  ],
  vet: [
    {
      title: "Operasional",
      items: [
        { label: "Dashboard", to: "/dashboard/vet", icon: LuLayoutDashboard, end: true },
      ],
    },
  ],
  shelter: [
    {
      title: "Ekosistem",
      items: [
        { label: "Dashboard", to: "/dashboard/shelter", icon: LuLayoutDashboard, end: true },
      ],
    },
  ],
  admin: [
    {
      title: "Administrasi",
      items: [
        { label: "Dashboard", to: "/dashboard/admin", icon: LuLayoutDashboard, end: true },
        { label: "Manajemen Pengguna", to: "/dashboard/admin/users", icon: LuUsers },
      ],
    },
  ],
};

const BOTTOM_NAV = [
  { label: "Beranda Website", to: "/", icon: LuGlobe },
  { label: "Profil Saya", to: "/profile", icon: LuUser },
];

export default function DashboardShell({ title, subtitle, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [askLogout, setAskLogout] = useState(false);

  const role = user?.role || "user";
  const sections = NAV_BY_ROLE[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkCls = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
      isActive
        ? "bg-white/15 text-white"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`;

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="PawSphere" className="h-8 w-auto" />
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-white/70 hover:text-white"
          aria-label="Tutup menu"
        >
          <LuX className="w-5 h-5" />
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6 pb-4">
        {sections.map((sec) => (
          <div key={sec.title}>
            <p className="px-3.5 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
              {sec.title}
            </p>
            <div className="space-y-1">
              {sec.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={navLinkCls}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom nav + logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            onClick={() => setMobileOpen(false)}
            className={navLinkCls}
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={() => {
            setMobileOpen(false);
            setAskLogout(true);
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:text-white hover:bg-red-500/20 transition-colors"
        >
          <LuLogOut className="w-[18px] h-[18px] shrink-0" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      {/* ===== Sidebar desktop ===== */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-brand-blue-dark text-white flex-col z-30">
        {SidebarContent}
      </aside>

      {/* ===== Sidebar mobile (drawer) ===== */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-brand-blue-dark text-white flex flex-col">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* ===== Area kanan ===== */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1"
              aria-label="Buka menu"
            >
              <LuMenu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-md hidden sm:block">
              <LuSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari…"
                className="w-full bg-slate-100 border border-transparent focus:border-brand-blue-normal focus:bg-white rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
                <LuBell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <span className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-brand-blue-light shrink-0">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-brand-blue-normal font-bold text-sm">
                      {(user?.name || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <div className="text-right leading-tight hidden sm:block">
                  <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {ROLE_LABEL[role] || role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl md:text-[28px] font-bold text-brand-blue-darker tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Pop-up konfirmasi logout */}
      <ConfirmModal
        open={askLogout}
        tone="danger"
        title="Keluar dari akun?"
        message="Kamu perlu login lagi untuk masuk kembali ke dashboard."
        confirmText="Ya, keluar"
        onConfirm={() => {
          setAskLogout(false);
          handleLogout();
        }}
        onClose={() => setAskLogout(false)}
      />
    </div>
  );
}