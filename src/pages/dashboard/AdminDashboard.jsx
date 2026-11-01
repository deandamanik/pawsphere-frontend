import DashboardShell from "../../components/dashboard/DashboardShell";

export default function AdminDashboard() {
  return (
    <DashboardShell
      title="Konsol Administrator"
      subtitle="Verifikasi dokter & shelter, kelola data master, pantau transaksi."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Verifikasi Vet" value="0" hint="Menunggu (SIP)" />
        <Card title="Verifikasi Shelter" value="0" hint="Menunggu" />
        <Card title="Total Pengguna" value="0" hint="Semua role" />
        <Card title="Transaksi" value="0" hint="Hari ini" />
      </div>
      <p className="mt-6 text-sm text-brand-blue-normal/80">
        Ini halaman khusus role <b>admin</b>. Akun admin hanya bisa dibuat lewat
        seed/admin lain, tidak lewat halaman Register publik.
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