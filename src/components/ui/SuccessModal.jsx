import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Berhasil!", 
  message = "Aksi Anda telah berhasil diproses." 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-blue-darker/40 backdrop-blur-sm z-0"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center z-10 border border-gray-100 flex flex-col items-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100
                        flex items-center justify-center border border-gray-100 transition-colors"
            >
              <FiX size={14} className="text-brand-blue-darker/60" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-500 mb-4"
            >
              <FiCheck size={28} className="stroke-[2.5]" />
            </motion.div>

            <h3 className="font-black text-brand-blue-darker text-lg tracking-tight mb-1.5">
              {title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed max-w-60 mb-5">
              {message}
            </p>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-brand-blue-darker hover:bg-brand-blue-dark-hover 
                        text-white font-bold text-xs shadow-sm transition-colors"
            >
              Selesai
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;