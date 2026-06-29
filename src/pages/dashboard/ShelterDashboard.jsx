import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LuMapPin, LuPhone, LuSiren, LuHandHelping, LuCircleCheck, LuPawPrint, LuHeartHandshake } from "react-icons/lu";
import DashboardShell from "../../components/dashboard/DashboardShell";
import ShelterAdoptionPanel from "../../components/dashboard/ShelterAdoptionPanel";
import ShelterDonationPanel from "../../components/dashboard/ShelterDonationPanel";
import { getActiveReports, updateReportStatus } from "../../services/pawAlert.service";

const STATUS_META = {
  open: { label: "Baru", cls: "bg-red-50 text-red-600 border-red-200" },
  responding: { label: "Ditangani", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  resolved: { label: "Selesai", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

function PawAlertPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const rows = await getActiveReports();
      setReports(rows);
    } catch {
      setReports([]);
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
      await updateReportStatus(id, status);
      await load();
    } catch (err) {
      alert(err.message || "Gagal mengubah status.");
    }
  };

  const counts = {
    open: reports.filter((r) => r.status === "open").length,
    responding: reports.filter((r) => r.status === "responding").length,
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Stat title="Laporan Baru" value={counts.open} hint="Belum ditangani" />
        <Stat title="Sedang Ditangani" value={counts.responding} hint="Dalam proses" />
        <Stat title="Total Aktif" value={reports.length} hint="Open + responding" />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-500">
          Memuat laporan...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-500">
          Belum ada laporan darurat aktif.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((r) => {
            const mapsUrl =
              r.latitude && r.longitude
                ? "https://www.google.com/maps?q=" + r.latitude + "," + r.longitude
                : null;
            return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden flex flex-col"
            >
              {r.photo_url ? (
                <img src={r.photo_url} alt="" className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 w-full bg-red-50 flex items-center justify-center">
                  <LuSiren className="w-10 h-10 text-red-300" />
                </div>
              )}

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-800">{r.animal_type}</p>
                    <p className="text-sm text-red-600 font-semibold">{r.condition}</p>
                  </div>
                  <span className={"text-[11px] px-2 py-0.5 rounded-full border shrink-0 " + (STATUS_META[r.status]?.cls || "")}>
                    {STATUS_META[r.status]?.label || r.status}
                  </span>
                </div>

                {r.description && (
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{r.description}</p>
                )}

                <div className="text-xs text-slate-500 space-y-1">
                  {r.reporter && (
                    <p className="flex items-center gap-1.5">
                      <LuPhone className="w-3.5 h-3.5" />
                      {r.reporter.name}
                      {r.reporter.phone ? " - " + r.reporter.phone : ""}
                    </p>
                  )}
                  {r.latitude && r.longitude ? (
                    <button
                      type="button"
                      onClick={() => window.open(mapsUrl, "_blank")}
                      className="flex items-center gap-1.5 text-brand-blue-normal hover:underline"
                    >
                      <LuMapPin className="w-3.5 h-3.5" />
                      Lihat lokasi di peta
                    </button>
                  ) : (
                    <p className="flex items-center gap-1.5 text-slate-400">
                      <LuMapPin className="w-3.5 h-3.5" />
                      Lokasi tidak tersedia
                    </p>
                  )}
                  <p className="text-slate-400">{fmtDateTime(r.created_at)}</p>
                </div>

                <div className="flex gap-2 mt-auto pt-2">
                  {r.status === "open" && (
                    <button
                      onClick={() => setStatus(r.id, "responding")}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-blue-dark hover:bg-brand-blue-normal text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                    >
                      <LuHandHelping className="w-4 h-4" />
                      Tanggapi
                    </button>
                  )}
                  {r.status === "responding" && (
                    <button
                      onClick={() => setStatus(r.id, "resolved")}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                    >
                      <LuCircleCheck className="w-4 h-4" />
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ShelterDashboard() {
  const [tab, setTab] = useState("alert");

  return (
    <DashboardShell
      title="Dashboard Shelter"
      subtitle="Kelola laporan darurat Paw Alert dan program adopsi hewan."
    >
      <div className="flex gap-2 mb-6">
        <TabBtn active={tab === "alert"} onClick={() => setTab("alert")} icon={LuSiren} label="Paw Alert" />
        <TabBtn active={tab === "adopt"} onClick={() => setTab("adopt")} icon={LuPawPrint} label="Adopsi" />
        <TabBtn active={tab === "donate"} onClick={() => setTab("donate")} icon={LuHeartHandshake} label="Donasi" />
      </div>

      {tab === "alert" && <PawAlertPanel />}
      {tab === "adopt" && <ShelterAdoptionPanel />}
      {tab === "donate" && <ShelterDonationPanel />}
    </DashboardShell>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={"inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors " + (active ? "bg-brand-blue-dark text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
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