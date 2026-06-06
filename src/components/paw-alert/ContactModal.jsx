import { motion } from 'framer-motion';
import { FiX, FiAlertTriangle, FiMapPin, FiMessageCircle, FiPhone } from 'react-icons/fi';

const formatDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

const ContactModal = ({ shelter, onClose }) => {
  const waMessage = encodeURIComponent(
    `Halo ${shelter.name}, saya menemukan hewan yang membutuhkan pertolongan darurat. Mohon bantuan segera!`
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200
                    flex items-center justify-center transition-colors"
        >
          <FiX size={15} className="text-gray-500" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="font-bold text-brand-blue-darker text-base">{shelter.name}</p>
            <p className="text-brand-blue-darker/55 text-xs">{shelter.address}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-brand-blue-light rounded-xl px-4 py-3 mb-5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${shelter.status === 'Buka' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className={`text-xs font-semibold ${shelter.status === 'Buka' ? 'text-green-700' : 'text-gray-500'}`}>
              {shelter.status}
            </span>
            <span className="text-brand-blue-darker/50 text-xs">· {shelter.hours}</span>
          </div>
          {shelter.distance !== undefined && (
            <span className="text-xs text-brand-blue-normal font-semibold flex items-center gap-1">
              <FiMapPin size={11} />
              {formatDist(shelter.distance)}
            </span>
          )}
        </div>

        <p className="text-xs text-brand-blue-darker/50 font-medium text-center mb-4">
          Pilih cara menghubungi
        </p>

        <div className="flex flex-col gap-3">
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/${shelter.phone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl
                      bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
          >
            <FiMessageCircle size={17} />
            Chat via WhatsApp
          </motion.a>

          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:+${shelter.phone}`}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl
                      bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white font-semibold text-sm transition-colors"
          >
            <FiPhone size={17} />
            Telepon Langsung
          </motion.a>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-200 text-brand-blue-darker/60
                      hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;