import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const AdoptionModal = ({ isOpen, onClose, pet, children, currentStage }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen && pet) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, pet]);

  const smoothSpring = {
    type: "spring",
    stiffness: 260,
    damping: 28,
  };

  return (
    <AnimatePresence>
      {isOpen && pet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <motion.div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
          />

          <motion.div 
            layout
            className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh] text-sm font-poppins"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={smoothSpring}
          >
            
            <div className="relative h-52 w-full bg-gray-100 shrink-0 overflow-hidden">
              <motion.img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-full object-cover"
                initial={{ scale: 1.03 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 hover:scale-105"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            <motion.div 
              layout="position"
              animate={{ height: "auto" }}
              transition={smoothSpring}
              className="overflow-hidden flex-1 flex flex-col"
            >
              <div 
                className={`p-6 md:p-7 max-h-[calc(92vh-13rem)] custom-scrollbar relative flex-1 ${
                  isAnimating ? 'overflow-y-hidden' : 'overflow-y-auto'
                }`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={currentStage}
                    initial={{ opacity: 0, x: 24, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -24, filter: "blur(4px)" }}
                    onAnimationStart={() => setIsAnimating(true)}
                    onAnimationComplete={() => setIsAnimating(false)}
                    transition={{ 
                      type: "spring",
                      stiffness: 280,
                      damping: 30
                    }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdoptionModal;