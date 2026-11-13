import { useEffect, useState, useCallback } from "react";
import Mascot from "../../components/ui/Mascot";
import {
  LuBuilding2,
  LuCalendar,
  LuUser,
  LuPhone,
  LuHash,
  LuWallet,
  LuPawPrint,
  LuClock,
  LuCheck,
  LuX,
  LuStethoscope,
  LuBedDouble,
  LuMapPin,
  LuInbox,
} from "react-icons/lu";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { useDashboardSearch } from "../../context/DashboardSearchContext";
import ErrorModal from "../../components/ui/ErrorModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  getClinicDashboard,
  getClinicReservations,
  updateReservationStatus,
} from "../../services/clinicAdmin.service";

const STATUS_META = {
  pending: {
    label: "Menunggu",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: "Terkonfirmasi",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Selesai",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
  },
};

const SERVICE_META = {
  konsultasi: { label: "Konsultasi", Icon: LuStethoscope },
  rawat_inap: { label: "Rawat inap", Icon: LuBedDouble },
  penitipan: { label: "Penitipan", Icon: LuBedDouble },
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
  const { query } = useDashboardSearch();
  const [dashboard, setDashboard] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirm, setConfirm] = useState(null);

  const loadDashboard = useCallback(() => {
    getClinicDashboard()
      .then(setDashboard)
      .catch(() => {});
  }, []);
  const loadReservations = useCallback((status) => {
    setLoading(true);
    getClinicReservations(status)
      .then(setReservations)
      .catch((e) => setError(e.message || "Gagal memuat reservasi"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);
  useEffect(() => {
    loadReservations(filter);
  }, [filter, loadReservations]);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    try {
      await updateReservationStatus(id, status);
      loadReservations(filter);
      loadDashboard();
    } catch (e) {
      setErrorMsg(e.message || "Gagal mengubah status");
    } finally {
      setBusyId(null);
    }
  };

  // Minta konfirmasi dulu sebelum mengubah status reservasi
  const STATUS_CONFIRM = {
    confirmed: {
      title: "Konfirmasi reservasi ini?",
      message: "Reservasi akan ditandai sebagai terkonfirmasi.",
      confirmText: "Ya, konfirmasi",
      tone: "default",
    },
    completed: {
      title: "Tandai reservasi selesai?",
      message: "Reservasi akan dipindahkan ke daftar selesai.",
      confirmText: "Ya, selesai",
      tone: "default",
    },
    cancelled: {
      title: "Batalkan reservasi ini?",
      message: "Tindakan ini menolak/membatalkan reservasi dan tidak bisa dibatalkan.",
      confirmText: "Ya, batalkan",
      tone: "danger",
    },
  };
  const askStatus = (id, status) => {
    const cfg = STATUS_CONFIRM[status] || {};
    setConfirm({ ...cfg, onConfirm: () => handleStatus(id, status) });
  };

  const stats = dashboard?.stats || {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  };
  const tabCount = (v) => (v === "all" ? stats.total : (stats[v] ?? 0));

  // Filter dari search bar topbar (nama hewan, jenis, kode booking, pemilik, telepon)
  const q = query.trim().toLowerCase();
  const visibleReservations = !q
    ? reservations
    : reservations.filter((r) =>
        [r.petName, r.petType, r.bookingCode, r.customer?.name, r.phone]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );

  return (
    <DashboardShell
      title="Dashboard Klinik"
      subtitle={
        dashboard?.clinic?.name
          ? `Kelola reservasi ${dashboard.clinic.name}`
          : "Kelola reservasi klinikmu"
      }
    >
      <div>
        {/* ---- Stat cards ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard
            label="Menunggu"
            value={stats.pending}
            accent="bg-amber-400"
            valueCls="text-amber-600"
            Icon={LuClock}
          />
          <StatCard
            label="Terkonfirmasi"
            value={stats.confirmed}
            accent="bg-emerald-500"
            valueCls="text-emerald-600"
            Icon={LuCheck}
          />
          <StatCard
            label="Selesai"
            value={stats.completed}
            accent="bg-slate-400"
            valueCls="text-slate-600"
            Icon={LuPawPrint}
          />
          <StatCard
            label="Total reservasi"
            value={stats.total}
            accent="bg-brand-blue-normal"
            valueCls="text-brand-blue-normal"
            Icon={LuInbox}
          />
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
                  active
                    ? "bg-brand-blue-normal text-white border-brand-blue-normal"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {tabCount(f.value)}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---- List ---- */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-12 flex flex-col items-center gap-2 text-slate-400">
            <Mascot state="loading" size={96} />
            <span>Memuat reservasi…</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-12 text-center text-red-500">
            {error}
          </div>
        ) : visibleReservations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <LuInbox className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              {q
                ? `Tidak ada reservasi yang cocok dengan "${query}".`
                : `Belum ada reservasi${
                    filter !== "all"
                      ? ` berstatus "${STATUS_META[filter]?.label || filter}"`
                      : ""
                  }.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleReservations.map((r) => (
              <ReservationCard
                key={r.id}
                r={r}
                busy={busyId === r.id}
                onStatus={askStatus}
              />
            ))}
          </div>
        )}
      </div>
      <ErrorModal
        isOpen={!!errorMsg}
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />
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

function StatCard({ label, value, accent, valueCls, Icon }) {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-100 shadow-card p-4 overflow-hidden">
      <span className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className={`text-3xl font-extrabold leading-none ${valueCls}`}>
            {value}
          </p>
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
  const sv = SERVICE_META[r.serviceType] || {
    label: r.serviceType,
    Icon: LuPawPrint,
  };
  const SvIcon = sv.Icon;
  const isHome = r.careMethod === "rumah";
  const canClinicConfirm = ["paid", "cash_due"].includes(r.paymentStatus);

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
                {r.petName}{" "}
                <span className="font-normal text-slate-400 text-sm">
                  · {r.petType || "-"}
                </span>
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue-normal bg-brand-blue-light px-2 py-0.5 rounded-full">
                  <SvIcon className="w-3.5 h-3.5" /> {sv.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  {isHome ? (
                    <LuMapPin className="w-3.5 h-3.5" />
                  ) : (
                    <LuBuilding2 className="w-3.5 h-3.5" />
                  )}
                  {isHome ? "Ke rumah" : "Ke klinik"}
                </span>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ${st.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{" "}
              {st.label || r.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
        {r.scheduleDate && (
          <Detail
            Icon={LuCalendar}
            label="Jadwal"
            value={`${r.scheduleDate}${r.scheduleTime ? " · " + r.scheduleTime : ""}`}
          />
        )}
        {(r.checkInDate || r.checkOutDate) && (
          <Detail
            Icon={LuBedDouble}
            label="Menginap"
            value={`${r.checkInDate || "?"} – ${r.checkOutDate || "?"}`}
          />
        )}
        <Detail Icon={LuUser} label="Pemilik" value={r.customer?.name} />
        {r.phone && <Detail Icon={LuPhone} label="Telepon" value={r.phone} />}
        <Detail Icon={LuHash} label="Kode" value={r.bookingCode} />
        <Detail
          Icon={LuWallet}
          label="Estimasi"
          value={fmtRupiah(r.estimatedTotal)}
        />
        <Detail
          Icon={LuWallet}
          label="Pembayaran"
          value={`${r.paymentMethod === "qris" ? "QRIS" : "Tunai"} · ${
            {
              cash_due: "Bayar di klinik",
              pending: "Menunggu pembayaran",
              paid: "Lunas",
              partially_refunded: "Dikembalikan sebagian",
              failed: "Gagal",
              expired: "Kedaluwarsa",
              cancelled: "Dibatalkan",
              refunded: "Dikembalikan",
            }[r.paymentStatus] || r.paymentStatus
          }`}
        />
      </div>

      {(r.complaint || r.notes) && (
        <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 mt-4 leading-relaxed">
          <span className="font-semibold text-slate-700">
            {r.complaint ? "Keluhan" : "Catatan"}:{" "}
          </span>
          {r.complaint || r.notes}
        </p>
      )}

      {(r.status === "pending" || r.status === "confirmed") && (
        <div className="flex items-center gap-2 flex-wrap mt-4">
          {r.status === "pending" && (
            <button
              disabled={busy || !canClinicConfirm}
              onClick={() => onStatus(r.id, "confirmed")}
              title={!canClinicConfirm ? "Menunggu pembayaran QRIS" : undefined}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-brand-blue-dark text-white hover:bg-brand-blue-normal disabled:opacity-50 transition-colors"
            >
              <LuCheck className="w-4 h-4" />{" "}
              {canClinicConfirm ? "Konfirmasi" : "Menunggu pembayaran"}
            </button>
          )}
          {r.status === "confirmed" && (
            <button
              disabled={busy || !canClinicConfirm}
              onClick={() => onStatus(r.id, "completed")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <LuCheck className="w-4 h-4" /> Tandai selesai
            </button>
          )}
          <button
            disabled={busy}
            onClick={() => onStatus(r.id, "cancelled")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            <LuX className="w-4 h-4" />{" "}
            {r.status === "pending" ? "Tolak" : "Batalkan"}
          </button>
        </div>
      )}
    </div>
  );
}