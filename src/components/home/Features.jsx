import { motion } from 'framer-motion';

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

  return (
    <section className="relative">
      <div className="bg-brand-blue-normal rounded-t-[80px] md:rounded-t-[120px] pt-28 pb-32 px-6 mt-2 relative z-20">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20 space-y-6">
            <h2 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Fitur Lengkap Untuk <br /> 
              Kesehatan & Kesejahteraan Hewan
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-4xl mx-auto font-medium leading-relaxed">
              Dari diagnosis AI hingga adopsi, dari darurat hingga donasi semua tersedia dalam satu platform yang mudah digunakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureList.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="relative group cursor-pointer p-8 rounded-3xl border-3 border-white shadow-2xl flex flex-col justify-center h-full min-h-65 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.4) 100%)',
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/60 to-brand-blue-dark/40 pointer-events-none"></div>

                <div className="relative z-10 pr-8">
                  <h3 className="text-brand-blue-normal text-2xl font-black mb-4 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-brand-blue-normal text-[15px] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
                  <svg 
                    width="28" height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="text-white drop-shadow-md group-hover:translate-x-2 transition-transform duration-300"
                    stroke="currentColor" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;