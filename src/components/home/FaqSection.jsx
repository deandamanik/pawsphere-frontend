// src/components/home/FaqSection.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown, LuMessageCircleQuestion } from "react-icons/lu";

const FAQS = [
  {
    q: "Apa itu PawSphere?",
    a: "PawSphere adalah platform kesehatan hewan terintegrasi: diagnosa awal dengan AI, konsultasi dokter hewan, cari klinik & buat janji, lapor hewan darurat (Paw Alert), adopsi, dan donasi shelter — semua dalam satu aplikasi.",
  },
  {
    q: "Apakah diagnosa AI menggantikan dokter hewan?",
    a: "Tidak. Diagnosa AI hanya memberi triase awal dan pertolongan pertama, bukan diagnosis medis. Untuk penanganan yang tepat, selalu konsultasikan dengan dokter hewan — PawSphere membantu menghubungkanmu ke dokter dan klinik terdekat.",
  },
  {
    q: "Apakah harus login untuk memakai diagnosa AI?",
    a: "Tidak. Pengunjung bisa mencoba diagnosa AI gratis hingga 5 kali dalam 24 jam. Dengan membuat akun dan login, kamu bisa memakainya tanpa batas dan menyimpan riwayat.",
  },
  {
    q: "Bagaimana cara membuat janji ke klinik?",
    a: "Buka menu Clinic, izinkan lokasi untuk melihat klinik terdekat, pilih klinik, lalu pilih layanan (konsultasi, rawat inap, atau penitipan) dan jadwal. Kamu akan mendapat kode booking dan nomor antrean.",
  },
  {
    q: "Apa itu Paw Alert?",
    a: "Paw Alert adalah fitur lapor darurat untuk hewan terlantar atau terluka. Kamu cukup unggah foto (atau buka kamera), isi kondisi dan lokasi, lalu laporan diteruskan ke shelter terdekat untuk ditindaklanjuti.",
  },
  {
    q: "Bagaimana cara mengadopsi hewan?",
    a: "Buka menu Adoption, pilih hewan yang ingin diadopsi, lalu ajukan permohonan dengan mengisi data diri. Pihak shelter akan meninjau dan menghubungimu untuk proses selanjutnya.",
  },
  {
    q: "Apakah data pribadi saya aman?",
    a: "Data pribadimu hanya digunakan untuk keperluan layanan (misalnya menghubungkan dengan klinik atau dokter). Alamat dan nomor telepon hanya dibagikan kepada pihak yang kamu tuju saat memesan layanan.",
  },
  {
    q: "Apakah PawSphere gratis?",
    a: "Menjelajah, diagnosa AI dasar, Paw Alert, dan info adopsi dapat diakses gratis. Biaya hanya muncul untuk layanan tertentu seperti konsultasi/rawat inap di klinik, atau saat kamu berdonasi.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-white py-16 sm:py-20 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue-normal bg-brand-blue-light px-3 py-1.5 rounded-full">
            <LuMessageCircleQuestion className="w-4 h-4" />
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="font-display text-2xl sm:text-3xl font-extrabold text-brand-blue-normal mt-4"
          >
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="text-sm text-brand-blue-normal/80 mt-2">
            Belum menemukan jawaban? Hubungi kami lewat halaman Bantuan Teknis.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-brand-blue-light-active/60 rounded-2xl bg-white overflow-hidden"
              >
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer hover:bg-brand-blue-light/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-normal focus-visible:ring-inset"
                >
                  <span className="font-semibold text-brand-blue-normal text-sm sm:text-base">
                    {item.q}
                  </span>
                  <LuChevronDown
                    className={`w-5 h-5 text-brand-blue-normal shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-brand-blue-normal/80 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}