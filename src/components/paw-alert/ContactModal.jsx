import { motion } from 'framer-motion';
import { FiX, FiMapPin, FiMessageCircle, FiClock, FiInfo } from 'react-icons/fi';

const formatDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

const ContactModal = ({ shelter, onClose }) => {
  const isBuka = shelter.status === 'Buka';
  
  const waMessage = encodeURIComponent(
    `Halo ${shelter.name}, saya menemukan hewan yang membutuhkan pertolongan darurat di sekitar koordinat saya. Mohon bantuan rescue segera!`
  );

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${shelter.name} ${shelter.address}`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0}} 
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-brand-blue-darker/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 border border-gray-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100
                    flex items-center justify-center border border-gray-100 transition-colors"
        >
          <FiX size={16} className="text-brand-blue-darker/60" />
        </button>

        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isBuka ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isBuka ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              Shelter {shelter.status}
            </span>

            {shelter.distance !== undefined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue-normal text-[10px] font-bold border border-brand-blue-light-active">
                <FiMapPin size={10} />
                Jarak {formatDist(shelter.distance)}
              </span>
            )}
          </div>
          <h3 className="font-black text-brand-blue-darker text-xl tracking-tight leading-snug">
            {shelter.name}
          </h3>
        </div>

        <div className="flex flex-col gap-3.5 bg-gray-50/70 border border-gray-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-brand-blue-light flex items-center justify-center text-brand-blue-normal shrink-0 mt-0.5">
              <FiClock size={12} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-brand-blue-darker/50 uppercase tracking-wider leading-none mb-1">Jam Operasional</p>
              <p className="text-xs font-semibold text-brand-blue-darker">{shelter.hours} WITA</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-brand-blue-light flex items-center justify-center text-brand-blue-normal shrink-0 mt-0.5">
              <FiMapPin size={12} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-brand-blue-darker/50 uppercase tracking-wider leading-none mb-1">Alamat Lengkap</p>
              <p className="text-xs font-medium text-brand-blue-darker/80 leading-relaxed">{shelter.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-gray-200/60">
            <div className="w-5 h-5 text-red-500 shrink-0 mt-0.5 flex items-center justify-center">
              <FiInfo size={13} />
            </div>
            <p className="text-[11px] text-brand-blue-darker/60 font-medium leading-relaxed">
              Hubungi pihak shelter secara bijak. Berikan deskripsi kondisi hewan dan lokasi sejelas-jelasnya setelah terhubung.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <motion.a
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            href={`https://wa.me/${shelter.phone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                    bg-green-500 hover:bg-green-600 text-white font-bold text-xs shadow-sm shadow-green-500/10 transition-colors"
          >
            <FiMessageCircle size={15} className="stroke-[2.5]" />
            Hubungi WhatsApp
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                    bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white font-bold text-xs shadow-sm transition-colors"
          >
            <FiMapPin size={14} className="stroke-[2.5]" />
            Lihat di Google Maps
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;