// src/pages/dashboard/ShelterDashboard.jsx
import DashboardShell from "../../components/dashboard/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import ShelterAdoptionPanel from "../../components/shelter/ShelterAdoptionPanel";
import ShelterDonationPanel from "../../components/shelter/ShelterDonationPanel";

export default function ShelterDashboard() {
  const { user } = useAuth();
  return (
    <DashboardShell
      title={`Panel Shelter${user?.name ? ` — ${user.name}` : ""}`}
      subtitle="Kelola katalog adopsi dan kampanye donasi shelter. Gunakan kolom cari di atas untuk menyaring data."
    >
      <div className="space-y-10">
        <ShelterAdoptionPanel />
        <ShelterDonationPanel />
      </div>
    </DashboardShell>
  );
}