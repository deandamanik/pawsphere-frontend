// src/pages/dashboard/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuUsers,
  LuStethoscope,
  LuBuilding2,
  LuHouse,
  LuShieldCheck,
  LuArrowRight,
} from "react-icons/lu";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { getUsers } from "../../services/admin.service";

const ROLE_CARDS = [
  { key: "vet", label: "Dokter Hewan", Icon: LuStethoscope, accent: "bg-sky-500", valueCls: "text-sky-600" },
  { key: "shelter", label: "Shelter", Icon: LuHouse, accent: "bg-emerald-500", valueCls: "text-emerald-600" },
  { key: "klinik", label: "Klinik", Icon: LuBuilding2, accent: "bg-amber-500", valueCls: "text-amber-600" },
  { key: "user", label: "Pengguna", Icon: LuUsers, accent: "bg-slate-400", valueCls: "text-slate-600" },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c = { total: users.length, user: 0, vet: 0, shelter: 0, klinik: 0, admin: 0 };
    users.forEach((u) => {
      if (c[u.role] != null) c[u.role] += 1;
    });
    return c;
  }, [users]);

  return (
    <DashboardShell
      title="Konsol Administrator"
      subtitle="Ringkasan pengguna PawSphere dan pengaturan peran akses."
    >
      {/* Total + CTA */}
      <div className="bg-brand-blue-dark text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <LuUsers className="w-6 h-6" />
          </span>
          <div>
            <p className="text-sm text-white/60">Total Pengguna</p>
            <p className="text-3xl font-extrabold leading-none">
              {loading ? "…" : counts.total}
            </p>
          </div>
        </div>
        <Link
          to="/dashboard/admin/users"
          className="inline-flex items-center justify-center gap-2 bg-white text-brand-blue-dark font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Kelola Pengguna & Role
          <LuArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Per-role */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {ROLE_CARDS.map(({ key, label, Icon, accent, valueCls }) => (
          <div
            key={key}
            className="relative bg-white rounded-2xl border border-slate-100 shadow-card p-4 overflow-hidden"
          >
            <span className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className={`text-3xl font-extrabold leading-none ${valueCls}`}>
                  {loading ? "…" : counts[key]}
                </p>
              </div>
              <Icon className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Admin note */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-brand-blue-light flex items-center justify-center text-brand-blue-normal shrink-0">
          <LuShieldCheck className="w-5 h-5" />
        </span>
        <div className="text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-0.5">
            {loading ? "…" : counts.admin} Administrator aktif
          </p>
          Akun admin hanya dibuat lewat seed atau oleh admin lain — tidak melalui
          halaman Register publik. Ubah peran pengguna di{" "}
          <Link to="/dashboard/admin/users" className="font-semibold text-brand-blue-normal hover:underline">
            Manajemen Pengguna
          </Link>
          .
        </div>
      </div>
    </DashboardShell>
  );
}