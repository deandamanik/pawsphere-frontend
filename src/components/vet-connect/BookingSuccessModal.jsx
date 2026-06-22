import { motion, AnimatePresence } from "framer-motion";
import { LuCheck } from "react-icons/lu";

const BookingSuccessModal = ({ isOpen, onClose, doctor, bookingDetails }) => {
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Success Header */}
              <div className="bg-green-500 px-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <LuCheck
                    className="w-12 h-12 text-green-500"
                    strokeWidth={3}
                  />
                </motion.div>
                <h3 className="text-white font-bold text-2xl mb-2">
                  Booking Berhasil!
                </h3>
                <p className="text-white/90 text-sm">
                  Konsultasi Anda telah dikonfirmasi
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Doctor Info */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{doctor.name}</h4>
                    <p className="text-xs text-slate-500">{doctor.specialty}</p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pasien:</span>
                    <span className="font-semibold text-slate-800">
                      {bookingDetails?.patientName || "adwasdwa"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Jenis Konsultasi:</span>
                    <span className="font-semibold text-slate-800">
                      {bookingDetails?.consultationType || "Chat Consultation"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Durasi:</span>
                    <span className="font-semibold text-slate-800">
                      {bookingDetails?.duration || "30 min"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Biaya:</span>
                    <span className="font-semibold text-brand-blue-normal">
                      Rp{" "}
                      {bookingDetails?.price?.toLocaleString("id-ID") ||
                        "150.000"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Setelah pembayaran, Anda dapat langsung chat dengan dokter
                    melalui dashboard Anda.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={onClose}
                  className="w-full bg-brand-blue-normal hover:bg-brand-blue-normal-hover text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Tutup Notifikasi
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">
                  Anda dapat mengakses chat kapan saja dari dashboard Anda
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingSuccessModal;
