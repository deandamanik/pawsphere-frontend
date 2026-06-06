import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Features = () => {
  const featureList = [
    {
      title: "AI Chat Diagnosa",
      desc: "Smart AI triage untuk menganalisis gejala hewan peliharaanmu, panduan pertolongan pertama, dan status urgensi: Hijau, Kuning, atau Merah.",
    },
    {
      title: "Vet Connect",
      desc: "Konsultasi real-time via chat atau video call bersama dokter hewan terverifikasi kapanpun kamu butuhkan.",
    },
    {
      title: "Pet Care Marketplace",
      desc: "Apotek digital untuk obat, vitamin, dan produk perawatan hewan peliharaan dengan pengiriman ke seluruh Indonesia.",
    },
    {
      title: "Paw Alert",
      desc: "Laporkan hewan terluka atau terlantar dengan foto, deskripsi, dan lokasi GPS otomatis untuk notifikasi shelter terdekat.",
    },
    {
      title: "Shelter Dashboard",
      desc: "Dashboard lengkap bagi shelter untuk mengelola laporan SOS, kapasitas, katalog adopsi, dan kampanye donasi.",
    },
    {
      title: "Care Funding",
      desc: "Crowdfunding transparan dengan progres donasi, pembaruan laporan shelter, dan timeline penyelamatan hewan.",
    }
  ];

  const containerRef = useRef(null);
  
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren", 
        staggerChildren: 0.06
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      ref={containerRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative bg-white overflow-hidden"
    >
      <div className="bg-brand-blue-normal rounded-t-[40px] md:rounded-t-[120px] pt-20 pb-24 md:pt-28 md:pb-32 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14 md:mb-20 space-y-4 md:space-y-6">
            <h2 className="text-white text-3xl md:text-6xl font-black leading-tight tracking-tight">
              Fitur Lengkap Untuk <br className="hidden sm:inline" /> 
              Kesehatan & Kesejahteraan Hewan
            </h2>
            <p className="text-white/90 text-sm md:text-xl max-w-4xl mx-auto font-medium leading-relaxed px-2">
              Dari diagnosis AI hingga adopsi, dari darurat hingga donasi semua tersedia dalam satu platform yang mudah digunakan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featureList.map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -6, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
                }}
                className="relative group cursor-pointer p-6 md:p-8 rounded-3xl border-2 md:border-3 border-white/80 shadow-xl flex flex-col justify-between min-h-45 md:min-h-60 overflow-hidden transition-shadow duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%)',
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-brand-blue-normal text-xl md:text-2xl font-black mb-3 md:mb-4 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-brand-blue-normal/90 text-xs sm:text-sm md:text-[15px] leading-relaxed font-bold">
                    {item.desc}
                  </p>
                </div>

                <div className="relative z-10 flex justify-end mt-4 md:mt-0 md:absolute md:right-6 md:bottom-6">
                  <div className="w-8 h-8 rounded-full bg-brand-blue-normal/10 flex items-center justify-center group-hover:bg-brand-blue-normal transition-colors duration-300">
                    <svg 
                      width="18" height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-brand-blue-normal group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </motion.section>
  );
};

export default Features;