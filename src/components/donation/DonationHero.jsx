import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const DonationHero = () => {
  const stats = [
    { value: 'Rp 2.1 Miliar+', label: 'Dana Tersalurkan' },
    { value: '12,400+', label: 'Donatur Aktif' },
    { value: '180+', label: 'Kampanye Selesai' },
    { value: '100%', label: 'Laporan Transparan' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="bg-brand-blue-light pt-8 pb-10 md:pt-12 md:pb-14 text-center px-4"
    >
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-2 bg-brand-blue-normal text-white text-xs md:text-sm font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full mb-4 md:mb-5 max-w-full cursor-default shadow-sm"
      >
        <FiHeart size={14} className="text-white shrink-0" />
        <span className="truncate">Donasi Transparan &amp; Terpercaya</span>
      </motion.div>

      <motion.h1 
        variants={itemVariants}
        className="text-3xl md:text-5xl font-extrabold text-brand-blue-darker mb-3 tracking-tight leading-tight"
      >
        Care Funding
      </motion.h1>

      <motion.p 
        variants={itemVariants}
        className="text-brand-blue-normal text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10 px-2 md:px-4"
      >
        Bantu hewan yang membutuhkan. Setiap donasi dilaporkan secara
        transparan dengan bukti dan pembaruan langsung dari shelter.
      </motion.p>

      <motion.div 
        variants={containerVariants}
        className="max-w-xl mx-auto grid grid-cols-2 gap-y-6 gap-x-4 md:flex md:items-center md:justify-center md:gap-10 md:max-w-none"
      >
        {stats.map(({ value, label }) => (
          <motion.div 
            key={label} 
            variants={itemVariants}
            className="text-center px-2"
          >
            <p className="text-lg md:text-xl font-extrabold text-brand-blue-darker tracking-tight leading-tight">
              {value}
            </p>
            <p className="text-brand-blue-normal text-xs md:text-sm font-medium mt-0.5 leading-snug">
              {label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default DonationHero;