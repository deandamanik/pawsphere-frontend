// src/pages/dashboard/AdminUsers.jsx
import { useEffect, useState, useCallback } from "react";
import { LuShieldCheck } from "react-icons/lu";
import DashboardShell from "../../components/dashboard/DashboardShell";
import ErrorModal from "../../components/ui/ErrorModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { useDashboardSearch } from "../../context/DashboardSearchContext";
import { getUsers, updateUserRole } from "../../services/admin.service";

const ROLES = [
  { value: "user", label: "Pengguna" },
  { value: "vet", label: "Dokter Hewan" },
  { value: "shelter", label: "Pengelola Shelter" },
  { value: "klinik", label: "Pengelola Klinik" },
  { value: "admin", label: "Administrator" },
];

const ROLE_BADGE = {
  user: "bg-slate-100 text-slate-600 border-slate-200",
  vet: "bg-sky-50 text-sky-700 border-sky-200",
  shelter: "bg-emerald-50 text-emerald-700 border-emerald-200",
  klinik: "bg-amber-50 text-amber-700 border-amber-200",
  admin: "bg-brand-blue-light text-brand-blue-dark border-brand-blue-normal/30",
};
const roleLabel = (v) => ROLES.find((r) => r.value === v)?.label || v;

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { query } = useDashboardSearch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch((e) => setErrorMsg(e.message || "Gagal memuat pengguna"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const doChangeRole = async (id, role) => {
    setBusyId(id);
    try {
      await updateUserRole(id, role);
      load();
    } catch (e) {
      setErrorMsg(e.message || "Gagal mengubah role");
    } finally {
      setBusyId(null);
    }
  };

  const askChangeRole = (u, role) => {
    if (role === u.role) return;
    setConfirm({
      title: `Ubah role ${u.name}?`,
      message: `Role akan diganti dari "${roleLabel(u.role)}" menjadi "${roleLabel(
        role
      )}". Akses pengguna akan menyesuaikan setelah login ulang.`,
      confirmText: "Ya, ubah role",
      tone: role === "admin" ? "danger" : "default",
      onConfirm: () => doChangeRole(u.id, role),
    });
  };

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell
      title="Manajemen Pengguna"
      subtitle="Atur peran (role) setiap pengguna. Hanya administrator yang dapat mengubah akses."
    >
      <ErrorModal isOpen={!!errorMsg} message={errorMsg} onClose={() => setErrorMsg("")} />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat pengguna…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            {query.trim()
              ? `Tidak ada pengguna yang cocok dengan "${query}".`
              : "Tidak ada pengguna."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Email</th>
                  <th className="px-5 py-3">Role saat ini</th>
                  <th className="px-5 py-3">Ubah role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isSelf = me?.id === u.id;
                  return (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue-normal font-bold text-sm shrink-0">
                            {(u.name || "?").charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 text-[10px] font-bold text-brand-blue-normal">
                                  (Anda)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 truncate sm:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-slate-500">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            ROLE_BADGE[u.role] || ROLE_BADGE.user
                          }`}
                        >
                          {u.role === "admin" && <LuShieldCheck className="w-3 h-3" />}
                          {roleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {isSelf ? (
                          <span className="text-xs text-slate-400 italic">
                            Tidak bisa ubah role sendiri
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={busyId === u.id}
                            onChange={(e) => askChangeRole(u, e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-brand-blue-normal cursor-pointer disabled:opacity-50"
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmText={confirm?.confirmText}
        tone={confirm?.tone}
        onConfirm={() => {
          const fn = confirm?.onConfirm;
          setConfirm(null);
          fn?.();
        }}
        onClose={() => setConfirm(null)}
      />
    </DashboardShell>
  );
}