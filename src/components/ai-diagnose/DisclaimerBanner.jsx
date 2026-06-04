import { motion } from "framer-motion";
import { PiWarningCircleFill } from "react-icons/pi";

const DisclaimerBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-3 md:mt-4 flex items-start gap-2 sm:gap-3 bg-amber-50 border border-amber-200 rounded-xl md:rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3.5"
    >
      <PiWarningCircleFill className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
        <span className="font-bold text-amber-600">Perhatian: </span>
        Diagnosis AI ini hanya merupakan triase awal dan tidak menggantikan
        validasi dokter hewan profesional. Selalu konsultasikan dengan
        dokter hewan untuk penanganan yang tepat.
      </p>
    </motion.div>
  );
};

export default DisclaimerBanner;