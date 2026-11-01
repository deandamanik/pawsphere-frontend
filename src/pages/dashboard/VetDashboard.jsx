import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LuArrowLeft, LuMessageCircle, LuCheck, LuCircleCheck } from "react-icons/lu";
import DashboardShell from "../../components/dashboard/DashboardShell";
import ConsultationChat from "../../components/vet-connect/ConsultationChat";
import {
  getVetConsultations,
  updateConsultationStatus,
} from "../../services/vetConnect.service";

const STATUS_META = {
  pending: { label: "Menunggu", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  active: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Selesai", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  cancelled: { label: "Dibatalkan", cls: "bg-red-50 text-red-600 border-red-200" },
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function VetDashboard() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const rows = await getVetConsultations();
      setConsultations(rows);
      setSelected((cur) => (cur ? rows.find((r) => r.id === cur.id) || cur : cur));
    } catch {
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const setStatus = async (id, status) => {
    try {
      await updateConsultationStatus(id, status);
      await load();
    } catch (err) {
      alert(err.message || "Gagal mengubah status.");
    }
  };

  const counts = {
    pending: consultations.filter((c) => c.status === "pending").length,
    active: consultations.filter((c) => c.status === "active").length,
    done: consultations.filter((c) => c.status === "completed").length,
  };

  // ----- Chat panel for one consultation -----
  if (selected) {
    return (
      <DashboardShell title="Konsultasi" subtitle={`Pasien: ${selected.patient.name}`}>
        <button
          onClick={() => {
            setSelected(null);
            load();
          }}
          className="inline-flex items-center gap-2 text-sm text-brand-blue-normal font-semibold hover:underline mb-4"
        >
          <LuArrowLeft className="w-4 h-4" />
          Kembali ke daftar
        </button>

        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          {/* Patient / booking info */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <img src={selected.patient.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold text-slate-800">{selected.patient.name}</p>
                <span
                  className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full border ${
                    STATUS_META[selected.status]?.cls || ""
                  }`}
                >
                  {STATUS_META[selected.status]?.label || selected.status}
                </span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Detail Booking</p>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">
              {selected.notes || "Tidak ada catatan."}
            </p>

            <div className="flex flex-col gap-2 mt-5">
              {selected.status === "pending" && (
                <button
                  onClick={() => setStatus(selected.id, "active")}
                  className="flex items-center justify-center gap-2 bg-brand-blue-dark hover:bg-brand-blue-normal text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <LuCheck className="w-4 h-4" />
                  Terima Konsultasi
                </button>
              )}
              {selected.status === "active" && (
                <button
                  onClick={() => setStatus(selected.id, "completed")}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <LuCircleCheck className="w-4 h-4" />
                  Selesaikan Konsultasi
                </button>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <ConsultationChat
              consultationId={selected.id}
              title={selected.patient.name}
              subtitle="Pasien"
              avatar={selected.patient.avatar}
              status={selected.status}
            />
          </div>
        </div>
      </DashboardShell>
    );
  }

  // ----- Inbox list -----
  return (
    <DashboardShell
      title="Konsultasi Masuk"
      subtitle="Terima permintaan konsultasi dan balas chat dari pemilik hewan."
    >
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Stat title="Menunggu" value={counts.pending} hint="Permintaan baru" />
        <Stat title="Aktif" value={counts.active} hint="Sedang berjalan" />
        <Stat title="Selesai" value={counts.done} hint="Total" />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-500">
          Memuat konsultasi…
        </div>
      ) : consultations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-500">
          Belum ada konsultasi masuk.
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 flex items-center gap-4"
            >
              <img src={c.patient.avatar} alt="" className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-800 truncate">{c.patient.name}</p>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      STATUS_META[c.status]?.cls || ""
                    }`}
                  >
                    {STATUS_META[c.status]?.label || c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {(c.notes || "").split("\n")[0] || "Tanpa catatan"} · {fmtDate(c.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelected(c)}
                className="shrink-0 inline-flex items-center gap-2 bg-brand-blue-normal hover:bg-brand-blue-normal-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <LuMessageCircle className="w-4 h-4" />
                Buka Chat
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function Stat({ title, value, hint }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 border border-brand-blue-light-active/50">
      <p className="text-brand-blue-normal text-sm font-semibold">{title}</p>
      <p className="text-3xl font-bold text-brand-blue-darker mt-2">{value}</p>
      <p className="text-xs text-brand-blue-normal/60 mt-1">{hint}</p>
    </div>
  );
}