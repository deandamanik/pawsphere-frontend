import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
};

const EmergencyTips = () => {
  const tips = [
    'Jangan pindahkan hewan kecuali dalam bahaya langsung',
    'Hindari kontak langsung dengan mulut hewan luka',
    'Foto dari jarak aman terlebih dahulu',
    'Tetap di lokasi hingga tim shelter tiba',
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center text-brand-orange shrink-0">
          <FiAlertTriangle size={14} className="stroke-[2.5]" />
        </div>
        <h3 className="font-bold text-brand-orange text-sm">Tips Darurat</h3>
      </div>

      <ul className="flex flex-col gap-2.5">
        {tips.map((tip, i) => (
          <motion.li
            key={i}
            variants={itemVariants}
            className="flex items-start gap-2.5 text-gray-600 text-xs leading-snug group"
          >
            <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0 mt-0.5 group-hover:bg-red-100 transition-colors">
              <FiCheckCircle size={11} className="stroke-[2.5]" />
            </div>
            <span className="font-medium text-brand-blue-darker/80">{tip}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default EmergencyTips;