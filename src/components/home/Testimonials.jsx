import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Testimonials = () => {
  const reviews = [
    {
      name: "Anisa Putri",
      role: "Pemilik Kucing",
      initials: "AP",
      text: "“PawSphere menyelamatkan kucing saya! Diagnosis AI mendeteksi kondisi darurat dan langsung menghubungkan ke dokter hewan malam hari.”",
      color: "bg-brand-blue-normal"
    },
    {
      name: "drh. Budi Santoso",
      role: "Dokter Hewan",
      initials: "BS",
      text: "“Platform yang luar biasa. Saya bisa melayani pasien lebih banyak secara online dan resep digital sangat memudahkan.”",
      color: "bg-brand-blue-light text-brand-blue-normal"
    },
    {
      name: "Shelter Harapan Hewan",
      role: "Shelter Partner",
      initials: "SH",
      text: "“Dashboard shelter sangat membantu manajemen SOS dan kampanye donasi kami. Transparansi yang kami butuhkan.”",
      color: "bg-brand-blue-normal"
    }
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: (index) => {
      const isPC = typeof window !== 'undefined' && window.innerWidth >= 768;
      if (!isPC) return { opacity: 0, y: 30, x: 0 };
      
      if (index === 0) return { opacity: 0, x: -50, y: 0 };
      if (index === 1) return { opacity: 0, y: 50, x: 0 };
      return { opacity: 0, x: 50, y: 0 };
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 15 }
    }
  };

  return (
    <section className="bg-white py-16 md:py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          ref={containerRef}
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 md:mb-20 space-y-3"
        >
          <h2 className="text-brand-blue-normal text-4xl md:text-6xl font-black tracking-tight">
            Kata Mereka
          </h2>
          <p className="text-brand-blue-normal/80 text-base md:text-2xl font-medium max-w-2xl mx-auto px-2 leading-relaxed">
            Dipercaya oleh ribuan pengguna di seluruh Indonesia
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        >
          {reviews.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                y: -6,
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)"
              }}
              className={`bg-white border border-slate-100 p-6 md:p-8 rounded-4xl md:rounded-4xl shadow-md flex flex-col justify-between transition-all duration-300
                ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
            >
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6 md:mb-8 font-medium">
                  {item.text}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                <div className={`w-11 h-11 md:w-12 md:h-12 ${item.color} rounded-full flex items-center justify-center font-black text-sm md:text-base shadow-sm shrink-0`}>
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-brand-blue-normal font-black text-sm md:text-base truncate">
                    {item.name}
                  </h4>
                  <p className="text-brand-blue-normal/60 text-xs md:text-sm font-semibold truncate">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;