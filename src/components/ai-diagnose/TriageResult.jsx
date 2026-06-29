import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PiPawPrintFill } from "react-icons/pi";
import { LuShieldCheck, LuTriangleAlert, LuSiren, LuVideo } from "react-icons/lu";

const URGENCY = {
  green: {
    label: "Aman",
    sub: "Kondisi ringan, bisa dipantau di rumah",
    Icon: LuShieldCheck,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  yellow: {
    label: "Perlu Perhatian",
    sub: "Sebaiknya konsultasi dengan dokter hewan",
    Icon: LuTriangleAlert,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  red: {
    label: "Darurat",
    sub: "Butuh penanganan medis segera",
    Icon: LuSiren,
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

const TriageResult = ({ result }) => {
  const meta = URGENCY[result.urgency_level] || URGENCY.green;
  const { Icon } = meta;
  const needsVet = result.urgency_level !== "green";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 sm:gap-3 w-full"
    >
      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-brand-blue-normal flex items-center justify-center shrink-0 mt-1">
        <PiPawPrintFill className="text-white w-3 h-3 sm:w-4 sm:h-4" />
      </div>

      <div className="flex-1 bg-white border border-slate-100 rounded-2xl rounded-bl-sm shadow-card p-4 sm:p-5 flex flex-col gap-4">
        {/* Urgency badge */}
        <div className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border text-xs font-bold ${meta.badge}`}>
          <Icon className="w-4 h-4" />
          <span>Tingkat Urgensi: {meta.label}</span>
        </div>
        <p className="text-xs text-slate-500 -mt-2">{meta.sub}</p>

        {/* Summary */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Ringkasan</p>
          <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
        </div>

        {/* First aid */}
        {Array.isArray(result.first_aid_advice) && result.first_aid_advice.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
              Pertolongan Pertama (P3H)
            </p>
            <ul className="flex flex-col gap-2">
              {result.first_aid_advice.map((advice, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} mt-1.5 shrink-0`} />
                  <span className="leading-relaxed">{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className="bg-slate-50 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Rekomendasi</p>
          <p className="text-sm text-slate-700 leading-relaxed">{result.recommendation}</p>
        </div>

        {/* Vet CTA for yellow/red */}
        {needsVet && (
          <Link
            to="/vet-connect"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto self-start px-5 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <LuVideo className="w-4 h-4" />
            Hubungi Dokter Hewan
          </Link>
        )}

        {/* Source + disclaimer */}
        <div className="flex flex-col gap-1 pt-1 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            {result.source === "gemini"
              ? "Dianalisis oleh Gemini AI"
              : "Analisis berbasis aturan (AI offline)"}
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed">{result.disclaimer}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TriageResult;