import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getClinicDashboard,
  getClinicReservations,
  updateReservationStatus,
} from "../../services/clinicAdmin.service";

const STATUS_META = {
  pending:   { label: "Menunggu",      badge: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Terkonfirmasi", badge: "bg-emerald-100 text-emerald-700" },
  completed: { label: "Selesai",       badge: "bg-slate-200 text-slate-600" },
  cancelled: { label: "Dibatalkan",    badge: "bg-rose-100 text-rose-700" },
};
const SERVICE_LABEL = { konsultasi: "Konsultasi", rawat_inap: "Rawat inap", penitipan: "Penitipan" };
const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Terkonfirmasi" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];
const fmtRupiah = (n) => "Rp" + (n || 0).toLocaleString("id-ID");

export default function KlinikDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(() => {
    getClinicDashboard().then(setDashboard).catch(() => {});
  }, []);
  const loadReservations = useCallback((status) => {
    setLoading(true);
    getClinicReservations(status)
      .then(setReservations)
      .catch((e) => setError(e.message || "Gagal memuat reservasi"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => { loadReservations(filter); }, [filter, loadReservations]);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    try {
      await updateReservationStatus(id, status);
      loadReservations(filter);
      loadDashboard();
    } catch (e) {
      alert(e.message || "Gagal mengubah status");
    } finally {
      setBusyId(null);
    }
  };
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  const stats = dashboard?.stats || { pending: 0, confirmed: 0, completed: 0, total: 0 };

  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Dashboard Klinik</p>
            <h1 className="text-lg font-bold text-brand-blue-normal truncate">
              {dashboard?.clinic?.name || "Memuat…"}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-slate-500 hidden sm:block">{user?.name}</span>
            <button onClick={handleLogout} className="text-sm font-semibold text-brand-orange hover:underline">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Menunggu", value: stats.pending, color: "text-amber-600" },
            { label: "Terkonfirmasi", value: stats.confirmed, color: "text-emerald-600" },
            { label: "Selesai", value: stats.completed, color: "text-slate-600" },
            { label: "Total", value: stats.total, color: "text-brand-blue-normal" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
          {FILTERS.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full transition ${
                filter === f.value ? "bg-brand-blue-normal text-white" : "bg-white text-brand-blue-normal border border-slate-200 hover:bg-slate-50"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">Memuat reservasi…</div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-rose-500">{error}</div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
            Belum ada reservasi{filter !== "all" ? ` berstatus "${STATUS_META[filter]?.label || filter}"` : ""}.
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((r) => {
              const meta = STATUS_META[r.status] || {};
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-brand-blue-normal">{r.petName}</h3>
                        <span className="text-xs text-slate-400">· {r.petType || "-"}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {SERVICE_LABEL[r.serviceType] || r.serviceType} · {r.careMethod === "rumah" ? "Ke rumah" : "Ke klinik"}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${meta.badge || "bg-slate-100 text-slate-500"}`}>
                      {meta.label || r.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-xs mb-3">
                    {r.scheduleDate && (<div><p className="text-slate-400">Jadwal</p><p className="font-semibold text-slate-700">{r.scheduleDate}{r.scheduleTime ? ` · ${r.scheduleTime}` : ""}</p></div>)}
                    {(r.checkInDate || r.checkOutDate) && (<div><p className="text-slate-400">Menginap</p><p className="font-semibold text-slate-700">{r.checkInDate} – {r.checkOutDate}</p></div>)}
                    <div><p className="text-slate-400">Pemilik</p><p className="font-semibold text-slate-700 truncate">{r.customer?.name || "-"}</p></div>
                    {r.phone && (<div><p className="text-slate-400">Telepon</p><p className="font-semibold text-slate-700">{r.phone}</p></div>)}
                    <div><p className="text-slate-400">Kode</p><p className="font-semibold text-slate-700">{r.bookingCode}</p></div>
                    <div><p className="text-slate-400">Estimasi</p><p className="font-semibold text-slate-700">{fmtRupiah(r.estimatedTotal)}</p></div>
                  </div>

                  {r.complaint && (
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 mb-3">
                      <span className="font-semibold text-slate-600">Keluhan: </span>{r.complaint}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {r.status === "pending" && (
                      <>
                        <button disabled={busyId === r.id} onClick={() => handleStatus(r.id, "confirmed")}
                          className="text-xs font-bold px-4 py-2 rounded-xl bg-brand-blue-normal text-white hover:bg-brand-blue-dark disabled:opacity-50">Konfirmasi</button>
                        <button disabled={busyId === r.id} onClick={() => handleStatus(r.id, "cancelled")}
                          className="text-xs font-bold px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50">Tolak</button>
                      </>
                    )}
                    {r.status === "confirmed" && (
                      <>
                        <button disabled={busyId === r.id} onClick={() => handleStatus(r.id, "completed")}
                          className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">Tandai selesai</button>
                        <button disabled={busyId === r.id} onClick={() => handleStatus(r.id, "cancelled")}
                          className="text-xs font-bold px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50">Batalkan</button>
                      </>
                    )}
                    {(r.status === "completed" || r.status === "cancelled") && (
                      <span className="text-xs text-slate-400">Tidak ada aksi lagi</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}