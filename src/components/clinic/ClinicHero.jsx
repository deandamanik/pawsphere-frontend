import React from 'react';

export default function ClinicHero({ onExploreClick }) {
  return (
    <section className="bg-[#EEF4F8] border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A4C] leading-[1.2] tracking-tight mb-5">
            Perawatan terbaik, di
            <br />
            klinik pilihanmu.
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 font-normal">
            Temukan klinik mitra untuk Pet Hospitalization dan Pet Boarding. Pilih lokasi,
            cek kapasitas sesuai tanggal, lalu ajukan reservasi dalam satu tempat.
          </p>
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2.5 bg-[#2C5E7A] hover:bg-[#234B61] text-white text-sm md:text-base font-semibold px-6 py-3.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            <span>Temukan klinik mitra</span>
            <span className="text-sm">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}