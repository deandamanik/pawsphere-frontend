import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiUpload, FiMapPin, FiCheckCircle, FiLoader, FiSend, FiRefreshCw } from 'react-icons/fi';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

const AlertForm = ({
  photoPreview,
  fileInputRef,
  jenisHewan,
  setJenisHewan,
  kondisiHewan,
  setKondisiHewan,
  deskripsi,
  setDeskripsi,
  lokasi,
  loadingLokasi,
  handlePhotoChange,
  handleDeteksiLokasi,
  handleSubmit
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-5 md:gap-6"
    >
      <motion.div variants={fadeUpVariants} initial="hidden" animate="visible">
        <label className="block text-xs md:text-sm font-bold text-brand-blue-darker uppercase tracking-wider mb-2.5">
          Foto Hewan <span className="text-red-500">*</span>
        </label>
        
        <div
          onClick={() => fileInputRef.current.click()}
          className="relative border-2 border-dashed border-gray-200 hover:border-red-300 rounded-xl bg-gray-50/50 hover:bg-red-50/20
                    flex flex-col items-center justify-center py-8 px-4 gap-3.5 cursor-pointer
                    transition-all duration-200 group overflow-hidden min-h-40"
        >
          <AnimatePresence mode="wait">
            {photoPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="relative flex flex-col items-center z-10"
              >
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="h-36 md:h-44 w-auto max-w-full rounded-lg object-cover shadow-sm border border-gray-200" 
                />
                <p className="text-[11px] text-brand-blue-normal font-bold mt-2 underline group-hover:text-red-500 transition-colors">
                  Ubah Foto Hewan
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-100/70 transition-colors"
                >
                  <FiCamera className="text-red-500 text-xl" />
                </motion.div>
                <div className="text-center">
                  <p className="font-bold text-brand-blue-darker text-sm">Upload Foto Kondisi Hewan</p>
                  <p className="text-brand-blue-darker/40 text-[11px] mt-0.5">Format JPG, PNG maksimal ukuran 5MB</p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                            text-brand-blue-darker text-xs font-bold rounded-lg shadow-sm group-hover:border-red-200 transition-colors"
                >
                  <FiUpload size={12} className="text-brand-blue-normal" />
                  Pilih Berkas
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
        <label className="block text-xs md:text-sm font-bold text-brand-blue-darker uppercase tracking-wider mb-2">
          Jenis Hewan
        </label>
        <input
          type="text"
          placeholder="Contoh: Kucing domestik, Anjing ras, dll."
          value={jenisHewan}
          onChange={(e) => setJenisHewan(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs md:text-sm
                    text-brand-blue-darker placeholder:text-brand-blue-darker/35 focus:outline-none 
                    focus:border-brand-blue-normal focus:ring-2 focus:ring-brand-blue-light/50 bg-white transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <label className="block text-xs md:text-sm font-bold text-brand-blue-darker uppercase tracking-wider mb-2">
          Kondisi Hewan
        </label>
        <input
          type="text"
          placeholder="Contoh: Kaki patah, Lemas kelaparan, dll."
          value={kondisiHewan}
          onChange={(e) => setKondisiHewan(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs md:text-sm
                    text-brand-blue-darker placeholder:text-brand-blue-darker/35 focus:outline-none 
                    focus:border-brand-blue-normal focus:ring-2 focus:ring-brand-blue-light/50 bg-white transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
        <label className="block text-xs md:text-sm font-bold text-brand-blue-darker uppercase tracking-wider mb-2">
          Deskripsi Singkat <span className="text-red-500">*</span>
        </label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Ceritakan detail kondisi fisik hewan, patokan lokasi spesifik di lapangan, serta situasi darurat yang sedang terjadi..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs md:text-sm
                    text-brand-blue-darker placeholder:text-brand-blue-darker/35
                    focus:outline-none focus:border-brand-blue-normal focus:ring-2 focus:ring-brand-blue-light/50 bg-white resize-none transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <label className="block text-xs md:text-sm font-bold text-brand-blue-darker uppercase tracking-wider mb-2">
          Lokasi Koordinat GPS <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border border-gray-100 bg-gray-50/50 rounded-xl p-3.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {lokasi ? (
                <motion.div 
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-green-50 border-green-100 text-green-500"
                >
                  <FiCheckCircle size={16} />
                </motion.div>
              ) : (
                <motion.div 
                  key="error"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-red-50 border-red-100 text-red-400"
                >
                  <FiMapPin size={16} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.h5 
                  key={lokasi ? 'detected' : 'missing'}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  className="text-xs md:text-sm font-extrabold text-brand-blue-darker truncate"
                >
                  {lokasi ? `${lokasi.lat.toFixed(5)}, ${lokasi.lng.toFixed(5)}` : 'Lokasi Belum Terdeteksi'}
                </motion.h5>
              </AnimatePresence>
              <p className="text-[11px] text-brand-blue-darker/50 truncate mt-0.5 font-medium">
                {lokasi ? 'Titik koordinat berhasil dikunci' : 'Izinkan akses GPS agar tim rescue presisi'}
              </p>
            </div>
          </div>
          
          <motion.button
            type="button"
            whileHover={loadingLokasi ? {} : { scale: 1.01, y: -1 }}
            whileTap={loadingLokasi ? {} : { scale: 0.98 }}
            onClick={handleDeteksiLokasi}
            disabled={loadingLokasi}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 border text-xs font-bold rounded-xl 
                      transition-colors whitespace-nowrap sm:w-auto w-full shadow-sm
                      ${lokasi 
                        ? 'bg-gray-50 border-gray-200 hover:border-red-200 hover:bg-red-50/30 text-gray-700 hover:text-red-600' 
                        : 'bg-white border-gray-200 hover:border-gray-300 text-brand-blue-darker'
                      }`}
          >
            {loadingLokasi ? (
              <FiLoader size={13} className="animate-spin text-brand-blue-normal" />
            ) : lokasi ? (
              <FiRefreshCw size={13} />
            ) : (
              <FiMapPin size={13} className="text-brand-blue-normal" />
            )}
            
            {loadingLokasi 
              ? 'Mengunci Koordinat...' 
              : lokasi 
                ? 'Ubah Lokasi' 
                : 'Deteksi Lokasi Otomatis'
            }
          </motion.button>
        </div>
      </motion.div>

      <motion.button
        type="submit"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.25 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl
                  bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs md:text-sm font-bold 
                  shadow-md shadow-red-500/10 transition-colors duration-200"
      >
        <FiSend size={14} />
        Kirim Laporan Darurat
      </motion.button>
    </form>
  );
};

export default AlertForm;