import { motion } from 'framer-motion';
import { FiCamera, FiUpload, FiMapPin } from 'react-icons/fi';

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
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6"
    >
      <div>
        <label className="block text-sm font-semibold text-brand-blue-darker mb-3">
          Foto Hewan
        </label>
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-red-300 rounded-xl bg-red-50/40
                    flex flex-col items-center justify-center py-10 gap-3 cursor-pointer
                    hover:bg-red-50 transition-colors"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="h-32 w-auto rounded-xl object-cover" />
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <FiCamera size={26} className="text-red-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-brand-blue-darker text-sm">Upload Foto Hewan</p>
                <p className="text-brand-blue-darker/50 text-xs">JPG, PNG maksimum 5MB</p>
              </div>
            </>
          )}
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600
                      text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <FiUpload size={14} />
            Pilih Foto
          </motion.button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Jenis Hewan</label>
        <input
          type="text"
          value={jenisHewan}
          onChange={(e) => setJenisHewan(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                    text-brand-blue-darker focus:outline-none focus:border-brand-blue-normal bg-white transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Kondisi Hewan</label>
        <input
          type="text"
          value={kondisiHewan}
          onChange={(e) => setKondisiHewan(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                    text-brand-blue-darker focus:outline-none focus:border-brand-blue-normal bg-white transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Deskripsi Singkat</label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Ceritakan kondisi hewan, lokasi spesifik, dan situasinya..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                    text-brand-blue-darker placeholder:text-brand-blue-darker/40
                    focus:outline-none focus:border-brand-blue-normal bg-white resize-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Lokasi GPS</label>
        <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <FiMapPin size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-blue-darker">
                {lokasi ? `${lokasi.lat}, ${lokasi.lng}` : 'Lokasi belum terdeteksi'}
              </p>
              <p className="text-xs text-brand-blue-darker/50">
                {lokasi ? 'Lokasi GPS berhasil dideteksi' : 'Izinkan akses lokasi untuk GPS otomatis'}
              </p>
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDeteksiLokasi}
            disabled={loadingLokasi}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600
                      text-white text-sm font-semibold rounded-lg transition-colors
                      whitespace-nowrap disabled:opacity-60 shrink-0"
          >
            <FiMapPin size={14} />
            {loadingLokasi ? 'Mendeteksi...' : 'Deteksi Lokasi'}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default AlertForm;