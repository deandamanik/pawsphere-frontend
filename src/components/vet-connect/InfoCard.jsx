import { motion } from "framer-motion";
import { LuCheck } from "react-icons/lu";

const InfoCard = () => {
  const benefits = [
    "Dokter hewan bersertifikat dan berpengalaman",
    "Konsultasi online chat",
    "Riwayat konsultasi tersimpan",
    "Harga transparan dan terjangkau",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-blue-light border border-brand-blue-light-active rounded-2xl shadow-card p-6"
    >
      <h3 className="text-brand-blue-darker font-bold text-lg mb-4">
        Mengapa Memilih Kami?
      </h3>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-slate-700"
          >
            <div className="w-5 h-5 bg-brand-blue-normal rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <LuCheck className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="leading-relaxed">{benefit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default InfoCard;
