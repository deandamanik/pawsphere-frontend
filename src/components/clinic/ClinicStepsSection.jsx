import React from 'react';

const STEPS = [
  {
    title: 'Pilih klinik mitra',
    description: 'Kenali profil, dokter, layanan, dan produk milik setiap klinik.',
    icon: (
      <svg className="w-6 h-6 text-[#2C5E7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Tentukan tanggal',
    description: 'Cek tempat yang tersedia untuk rawat inap atau penitipan hewanmu.',
    icon: (
      <svg className="w-6 h-6 text-[#2C5E7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" strokeWidth="2" />
        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Tunggu konfirmasi klinik',
    description: 'Klinik meninjau kebutuhan hewan dan mengonfirmasi pengajuanmu.',
    icon: (
      <svg className="w-6 h-6 text-[#2C5E7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function ClinicStepsSection() {
  return (
    <section className="bg-[#2C5E7A] rounded-t-[40px] pt-14 pb-16 px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Satu platform. Banyak pilihan perawatan.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, index) => (
            <div
              key={index}
              className="bg-[#EEF4F8] text-[#1E3A4C] rounded-2xl p-6 shadow-sm"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}