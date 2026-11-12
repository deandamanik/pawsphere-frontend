import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBuilding2, LuLogOut, LuCalendar, LuUser, LuPhone, LuHash,
  LuWallet, LuPawPrint, LuClock, LuCheck, LuX, LuStethoscope,
  LuBedDouble, LuMapPin, LuInbox,
} from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import {
  getClinicDashboard,
  getClinicReservations,
  updateReservationStatus,
} from "../../services/clinicAdmin.service";

const STATUS_META = {
  pending:   { label: "Menunggu",      badge: "bg-amber-50 text-amber-700 border-amber-200",     dot: "bg-amber-400" },
  confirmed: { label: "Terkonfirmasi", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  completed: { label: "Selesai",       badge: "bg-slate-100 text-slate-600 border-slate-200",     dot: "bg-slate-400" },
  cancelled: { label: "Dibatalkan",    badge: "bg-red-50 text-red-600 border-red-200",            dot: "bg-red-400" },
};

const SERVICE_META = {
  konsultasi: { label: "Konsultasi", Icon: LuStethoscope },
  rawat_inap: { label: "Rawat inap", Icon: LuBedDouble },
  penitipan:  { label: "Penitipan",  Icon: LuBedDouble },
};

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

  const stats = dashboard?.stats || { pending: 0, confirmed: 0, completed: 0, cancelled: 0, total: 0 };
  const tabCount = (v) => (v === "all" ? stats.total : stats[v] ?? 0);

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      {/* ---- Topbar ---- */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-brand-blue-light flex items-center justify-center shrink-0 overflow-hidden">
              {dashboard?.clinic?.image ? (
                <img src={dashboard.clinic.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <LuBuilding2 className="w-5 h-5 text-brand-blue-normal" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-blue-normal/60">Dashboard Klinik</p>
              <h1 className="text-base md:text-lg font-bold text-brand-blue-normal truncate leading-tight">
                {dashboard?.clinic?.name || "Memuat…"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-slate-400">Pengelola</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
            >
              <LuLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {/* ---- Stat cards ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard label="Menunggu" value={stats.pending} accent="bg-amber-400" valueCls="text-amber-600" Icon={LuClock} />
          <StatCard label="Terkonfirmasi" value={stats.confirmed} accent="bg-emerald-500" valueCls="text-emerald-600" Icon={LuCheck} />
          <StatCard label="Selesai" value={stats.completed} accent="bg-slate-400" valueCls="text-slate-600" Icon={LuPawPrint} />
          <StatCard label="Total reservasi" value={stats.total} accent="bg-brand-blue-normal" valueCls="text-brand-blue-normal" Icon={LuInbox} />
        </div>

        {/* ---- Filters ---- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`shrink-0 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border transition-colors ${
                  active ? "bg-brand-blue-normal text-white border-brand-blue-normal" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {tabCount(f.value)}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---- List ---- */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-12 text-center text-slate-400">
            Memuat reservasi…
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-12 text-center text-red-500">
            {error}
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <LuInbox className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              Belum ada reservasi{filter !== "all" ? ` berstatus "${STATUS_META[filter]?.label || filter}"` : ""}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => (
              <ReservationCard key={r.id} r={r} busy={busyId === r.id} onStatus={handleStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, accent, valueCls, Icon }) {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-100 shadow-card p-4 overflow-hidden">
      <span className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className={`text-3xl font-extrabold leading-none ${valueCls}`}>{value}</p>
        </div>
        <Icon className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );
}

function Detail({ Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 leading-none mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

function ReservationCard({ r, busy, onStatus }) {
  const st = STATUS_META[r.status] || {};
  const sv = SERVICE_META[r.serviceType] || { label: r.serviceType, Icon: LuPawPrint };
  const SvIcon = sv.Icon;
  const isHome = r.careMethod === "rumah";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 hover:border-slate-200 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue-light flex items-center justify-center shrink-0">
          <LuPawPrint className="w-6 h-6 text-brand-blue-normal" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-800 leading-tight truncate">
                {r.petName} <span className="font-normal text-slate-400 text-sm">· {r.petType || "-"}</span>
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue-normal bg-brand-blue-light px-2 py-0.5 rounded-full">
                  <SvIcon className="w-3.5 h-3.5" /> {sv.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  {isHome ? <LuMapPin className="w-3.5 h-3.5" /> : <LuBuilding2 className="w-3.5 h-3.5" />}
                  {isHome ? "Ke rumah" : "Ke klinik"}
                </span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ${st.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} /> {st.label || r.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
        {r.scheduleDate && <Detail Icon={LuCalendar} label="Jadwal" value={`${r.scheduleDate}${r.scheduleTime ? " · " + r.scheduleTime : ""}`} />}
        {(r.checkInDate || r.checkOutDate) && <Detail Icon={LuBedDouble} label="Menginap" value={`${r.checkInDate || "?"} – ${r.checkOutDate || "?"}`} />}
        <Detail Icon={LuUser} label="Pemilik" value={r.customer?.name} />
        {r.phone && <Detail Icon={LuPhone} label="Telepon" value={r.phone} />}
        <Detail Icon={LuHash} label="Kode" value={r.bookingCode} />
        <Detail Icon={LuWallet} label="Estimasi" value={fmtRupiah(r.estimatedTotal)} />
      </div>

      {(r.complaint || r.notes) && (
        <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 mt-4 leading-relaxed">
          <span className="font-semibold text-slate-700">{r.complaint ? "Keluhan" : "Catatan"}: </span>
          {r.complaint || r.notes}
        </p>
      )}

      {(r.status === "pending" || r.status === "confirmed") && (
        <div className="flex items-center gap-2 flex-wrap mt-4">
          {r.status === "pending" && (
            <button disabled={busy} onClick={() => onStatus(r.id, "confirmed")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-brand-blue-dark text-white hover:bg-brand-blue-normal disabled:opacity-50 transition-colors">
              <LuCheck className="w-4 h-4" /> Konfirmasi
            </button>
          )}
          {r.status === "confirmed" && (
            <button disabled={busy} onClick={() => onStatus(r.id, "completed")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              <LuCheck className="w-4 h-4" /> Tandai selesai
            </button>
          )}
          <button disabled={busy} onClick={() => onStatus(r.id, "cancelled")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors">
            <LuX className="w-4 h-4" /> {r.status === "pending" ? "Tolak" : "Batalkan"}
          </button>
        </div>
      )}
    </div>
  );
}