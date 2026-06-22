import { motion, AnimatePresence } from "framer-motion";
import {
  LuX,
  LuStar,
  LuMapPin,
  LuGraduationCap,
  LuLanguages,
} from "react-icons/lu";

const DoctorDetailModal = ({ doctor, isOpen, onClose, onBook }) => {
  if (!doctor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-brand-blue-normal px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-full border-2 border-white"
                  />
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {doctor.name}
                    </h3>
                    <p className="text-white/90 text-sm">{doctor.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Rating & Status */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <LuStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-800">
                      {doctor.rating}
                    </span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-600">
                    {doctor.experience} Tahun
                  </span>
                  {doctor.isOnline && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        ONLINE
                      </span>
                    </>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <LuMapPin className="w-5 h-5 text-brand-blue-normal shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Lokasi
                    </h4>
                    <p className="text-sm text-slate-600">{doctor.location}</p>
                  </div>
                </div>

                {/* About */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <LuGraduationCap className="w-5 h-5 text-brand-blue-normal shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Tentang
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                      {doctor.about ||
                        "Spesialis kesehatan hewan kecil dengan fokus pada perawatan preventif dan pengobatan penyakit kronis."}
                    </p>
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <LuGraduationCap className="w-5 h-5 text-brand-blue-normal shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">
                      Pendidikan
                    </h4>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      <li>• Dokter Hewan - IPB University</li>
                      <li>• Sertifikasi Spesialis Hewan Kecil</li>
                    </ul>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <LuLanguages className="w-5 h-5 text-brand-blue-normal shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">
                      Bahasa
                    </h4>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white border border-brand-blue-light text-brand-blue-dark text-xs font-semibold rounded-full">
                        Bahasa Indonesia
                      </span>
                      <span className="px-3 py-1 bg-white border border-brand-blue-light text-brand-blue-dark text-xs font-semibold rounded-full">
                        English
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-brand-blue-normal text-brand-blue-normal font-bold rounded-xl hover:bg-brand-blue-light transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    onBook();
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 bg-brand-blue-normal hover:bg-brand-blue-normal-hover text-white font-bold rounded-xl transition-colors"
                >
                  Book Sekarang
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DoctorDetailModal;
