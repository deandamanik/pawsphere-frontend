import DashboardShell from "../../components/dashboard/DashboardShell";
import { useAuth } from "../../context/AuthContext";

export default function ShelterDashboard() {
  const { user } = useAuth();
  return (
    <DashboardShell
      title={`Panel Shelter — ${user?.name || ""}`}
      subtitle="Kelola laporan Paw Alert, katalog adopsi, dan kampanye donasi."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Laporan SOS Masuk" value="0" hint="Paw Alert terdekat" />
        <Card title="Hewan Siap Adopsi" value="0" hint="Di katalog" />
        <Card title="Kampanye Donasi Aktif" value="0" hint="Care Funding" />
      </div>
      <p className="mt-6 text-sm text-brand-blue-normal/80">
        Ini halaman khusus role <b>shelter</b>.
      </p>
    </DashboardShell>
  );
}

function Card({ title, value, hint }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 border border-brand-blue-light-active/50">
      <p className="text-brand-blue-normal text-sm font-semibold">{title}</p>
      <p className="text-3xl font-bold text-brand-blue-darker mt-2">{value}</p>
      <p className="text-xs text-brand-blue-normal/60 mt-1">{hint}</p>
    </div>
  );
}