import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const HeroHeader = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-12 text-center px-4 max-w-4xl mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-linear-to-b from-red-50 to-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shadow-md shadow-red-500/10 border border-red-400/20 shrink-0">
            <FiAlertTriangle className="text-white text-xl md:text-2xl animate-pulse" />
          </div>
          <div className="text-center sm:text-left flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue-darker tracking-tight leading-tight">
              Paw <span className="text-red-500">Alert</span>
            </h1>
            <p className="text-red-500 font-bold text-xs md:text-sm tracking-wide mt-0.5">
              Sistem Pelaporan Darurat Hewan
            </p>
          </div>
        </motion.div>
        <motion.p 
          variants={itemVariants}
          className="text-brand-blue-darker/70 text-xs md:text-sm lg:text-base max-w-xl md:max-w-2xl mx-auto leading-relaxed font-medium tracking-normal"
        >
          Laporkan hewan terluka atau terlantar di sekitarmu. Sistem kami akan segera 
          mendeteksi lokasi dan menghubungi shelter terdekat untuk respons penyelamatan secepatnya.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroHeader;