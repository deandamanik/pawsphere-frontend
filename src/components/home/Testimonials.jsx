import { motion } from 'framer-motion';

const Testimonials = () => {
  const reviews = [
    {
      name: "Anisa Putri",
      role: "Pemilik Kucing",
      initials: "AP",
      text: "“PawSphere menyelamatkan kucing saya! Diagnosis AI mendeteksi kondisi darurat dan langsung menghubungkan ke dokter hewan malam hari.”",
      color: "bg-teal-600"
    },
    {
      name: "drh. Budi Santoso",
      role: "Dokter Hewan",
      initials: "BS",
      text: "“Platform yang luar biasa. Saya bisa melayani pasien lebih banyak secara online dan resep digital sangat memudahkan.”",
      color: "bg-teal-600"
    },
    {
      name: "Shelter Harapan Hewan",
      role: "Shelter Partner",
      initials: "SH",
      text: "“Dashboard shelter sangat membantu manajemen SOS dan kampanye donasi kami. Transparansi yang kami butuhkan.”",
      color: "bg-teal-600"
    }
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-brand-blue-normal text-5xl md:text-6xl font-black mb-4">
            Kata Mereka
          </h2>
          <p className="text-brand-blue-normal text-xl md:text-2xl font-medium">
            Dipercaya oleh ribuan pengguna di seluruh Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-100 p-8 rounded-4xl shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-md leading-relaxed mb-8 italic">
                  {item.text}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-black font-bold">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;