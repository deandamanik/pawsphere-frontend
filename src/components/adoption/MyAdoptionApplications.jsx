import { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { getMyApplications } from "../../services/adoption.service";

const STATUS = {
  submitted: { label: "Masuk", desc: "Permohonan terkirim, menunggu ditinjau shelter.", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  review: { label: "Ditinjau", desc: "Shelter sedang meninjau permohonan Anda.", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  contacted: { label: "Dihubungi", desc: "Shelter sudah/akan menghubungi Anda.", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  survey: { label: "Survei", desc: "Tahap survei calon adopter.", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  done: { label: "Selesai", desc: "Adopsi disetujui. Selamat!", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Ditolak", desc: "Mohon maaf, permohonan tidak dapat dilanjutkan.", cls: "bg-red-50 text-red-600 border-red-200" },
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function MyAdoptionApplications({ refreshKey }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyApplications()
      .then(setApps)
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading || apps.length === 0) return null;

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-card border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <LuClipboardList className="w-5 h-5 text-brand-blue-normal" />
        <h2 className="font-bold text-slate-800">Status Permohonan Adopsi Saya</h2>
      </div>
      <div className="space-y-3">
        {apps.map((a) => {
          const st = STATUS[a.status] || { label: a.status, desc: "", cls: "bg-slate-100 text-slate-600 border-slate-200" };
          return (
            <div key={a.id} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                {a.animal?.image ? (
                  <img src={a.animal.image} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {a.animal?.name}{" "}
                  <span className="text-xs text-slate-400 font-normal">({a.animal?.type})</span>
                </p>
                <p className="text-xs text-slate-500">{st.desc}</p>
                <p className="text-[11px] text-slate-400">Diajukan {fmtDate(a.created_at)}</p>
              </div>
              <span className={"text-[11px] px-2.5 py-1 rounded-full border shrink-0 " + st.cls}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}