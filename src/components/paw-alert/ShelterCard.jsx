import { motion } from 'framer-motion';
import { FiMapPin, FiInfo } from 'react-icons/fi';

const formatDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

const ShelterCard = ({ shelter, rank, onContact }) => {
  const isBuka = shelter.status === 'Buka';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: rank * 0.05 
      }}
      whileHover={{ y: -2 }}
      className="flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200/80 transition-shadow duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-xl bg-brand-blue-light flex items-center justify-center shrink-0 font-bold text-brand-blue-normal text-[11px] border border-brand-blue-light-active">
          {rank + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-extrabold text-brand-blue-darker text-sm tracking-tight truncate">
              {shelter.name}
            </h4>

            {shelter.distance !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-blue-light text-brand-blue-normal text-[10px] font-bold shrink-0">
                <FiMapPin size={10} className="stroke-[2.5]" />
                {formatDist(shelter.distance)}
              </span>
            )}
          </div>

          <p className="text-brand-blue-darker/60 text-xs mb-3 leading-relaxed font-medium truncate">
            {shelter.address}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${isBuka ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className={`text-[11px] font-bold ${isBuka ? 'text-green-600' : 'text-gray-500'}`}>
                {shelter.status}
              </span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-brand-blue-darker/50 text-[11px] font-medium">
              {shelter.hours}
            </span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01, backgroundColor: '#f1f5f9' }} 
        whileTap={{ scale: 0.98 }}
        onClick={() => onContact(shelter)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                  bg-gray-50 border border-gray-200/80 text-brand-blue-darker hover:text-brand-blue-darker text-xs font-bold 
                  transition-all duration-200"
      >
        <FiInfo size={13} className="stroke-[2.5] text-brand-blue-normal" />
        Lihat Detail
      </motion.button>
    </motion.div>
  );
};

export default ShelterCard;