import { motion } from 'framer-motion';
import { FiMapPin, FiPhone } from 'react-icons/fi';

const formatDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

const ShelterCard = ({ shelter, rank, onContact }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: rank * 0.06 }}
    className="flex flex-col gap-3 bg-brand-blue-light rounded-xl p-3"
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-blue-light-active flex items-center justify-center shrink-0 mt-0.5 font-bold text-brand-blue-normal text-xs">
        #{rank + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="font-bold text-brand-blue-darker text-xs truncate">{shelter.name}</p>
          {shelter.distance !== undefined && (
            <span className="text-brand-blue-normal text-[10px] font-bold flex items-center gap-0.5 shrink-0">
              <FiMapPin size={9} />
              {formatDist(shelter.distance)}
            </span>
          )}
        </div>
        <p className="text-brand-blue-darker/60 text-[11px] mb-1.5 leading-snug">{shelter.address}</p>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
            shelter.status === 'Buka'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {shelter.status}
          </span>
          <span className="text-brand-blue-darker/50 text-[10px]">{shelter.hours}</span>
        </div>
      </div>
    </div>

    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onContact(shelter)}
      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
    >
      <FiPhone size={12} />
      Hubungi Shelter
    </motion.button>
  </motion.div>
);

export default ShelterCard;