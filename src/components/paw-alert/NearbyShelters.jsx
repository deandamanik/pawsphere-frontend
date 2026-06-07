import { motion, AnimatePresence } from 'framer-motion';
import { FiNavigation, FiRefreshCw } from 'react-icons/fi';
import ShelterCard from './ShelterCard';

const textVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 22 } },
  exit: { opacity: 0, x: 15, transition: { duration: 0.15 } }
};

const NearbyShelters = ({
  locationDetected,
  loadingLokasi,
  locationError,
  sortedShelters,
  handleDeteksiLokasi,
  handleResetLokasi,
  onContact
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-brand-blue-darker text-sm">Shelter Terdekat</h3>
        <AnimatePresence>
          {locationDetected && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[10px] text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full"
            >
              <FiNavigation size={9} />
              Diurutkan
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative min-h-19 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!locationDetected ? (
            <motion.div
              key="cta-state"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <p className="text-brand-blue-darker/50 text-[11px] mb-3 leading-snug">
                Aktifkan GPS untuk menampilkan shelter paling dekat dengan lokasimu.
              </p>

              <motion.button
                whileHover={loadingLokasi ? {} : { scale: 1.01 }}
                whileTap={loadingLokasi ? {} : { scale: 0.98 }}
                onClick={handleDeteksiLokasi}
                disabled={loadingLokasi}
                className="w-full flex items-center justify-center gap-2 py-2 mb-2 rounded-lg
                          bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white
                          text-xs font-semibold transition-colors disabled:opacity-60 shadow-sm"
              >
                <FiNavigation size={12} className={loadingLokasi ? 'animate-spin' : ''} />
                {loadingLokasi ? 'Mendeteksi lokasi...' : 'Deteksi Lokasi Saya'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="detected-state"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pb-2.5"
            >
              <p className="text-green-600 font-bold text-[11px] leading-snug">
                Berhasil mengunci titik GPS!
              </p>
              <p className="text-brand-blue-darker/50 text-[11px] leading-snug mt-0.5">
                Menampilkan 3 shelter terdekat dari lokasi kamu saat ini.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {locationError && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-[11px] mb-3 bg-red-50 rounded-lg px-3 py-2 font-medium overflow-hidden"
          >
            {locationError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Daftar Card Shelter */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {sortedShelters.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              layout
            >
              <ShelterCard
                shelter={s}
                rank={i}
                onContact={onContact} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {locationDetected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={handleResetLokasi}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 border border-gray-100 hover:border-gray-200 rounded-lg text-[11px] text-brand-blue-normal hover:text-brand-blue-darker font-bold transition-colors bg-gray-50/50"
            >
              <FiRefreshCw size={10} />
              Ubah Lokasi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NearbyShelters;