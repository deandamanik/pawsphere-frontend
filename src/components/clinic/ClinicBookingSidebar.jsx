import React, { useState } from 'react';

export default function ClinicBookingSidebar({ clinic }) {
  const [selectedServiceKey, setSelectedServiceKey] = useState('hospitalization');
  const [checkIn] = useState('19 Oktober 2026');
  const [checkOut] = useState('22 Oktober 2026');
  const nights = 3;

  const activeService = clinic.services[selectedServiceKey];
  const estimatedTotal = activeService.price * nights;

  return (
    <aside className="space-y-6">
      {/* Card Rencanakan Perawatan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
        <h3 className="text-xl md:text-2xl font-bold text-[#1E3A4C] mb-1">
          Rencanakan perawatan
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Reservasi ke {clinic.name}
        </p>

        <div className="space-y-4 mb-6">
          {/* Pilihan Layanan */}
          <div>
            <label className="block text-sm font-semibold text-[#1E3A4C] mb-2">
              Layanan
            </label>
            <div className="relative">
              <select
                value={selectedServiceKey}
                onChange={(e) => setSelectedServiceKey(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm md:text-base font-medium text-slate-700 bg-white focus:outline-none"
              >
                <option value="hospitalization">Pet Hospitalization</option>
                <option value="boarding">Pet Boarding</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                ▾
              </span>
            </div>
          </div>

          {/* Tanggal Masuk */}
          <div>
            <label className="block text-sm font-semibold text-[#1E3A4C] mb-2">
              Tanggal masuk
            </label>
            <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
              </svg>
              <span>{checkIn}</span>
            </div>
          </div>

          {/* Tanggal Keluar */}
          <div>
            <label className="block text-sm font-semibold text-[#1E3A4C] mb-2">
              Tanggal keluar
            </label>
            <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
              </svg>
              <span>{checkOut}</span>
            </div>
          </div>

          {/* Pill ketersediaan */}
          <div className="pt-1">
            <span className="inline-block bg-[#EEF4F8] text-[#1E3A4C] text-xs md:text-sm font-semibold px-3.5 py-1.5 rounded-full">
              {activeService.available} dari {activeService.total} tempat tersedia
            </span>
          </div>

          {/* Ringkasan Harga */}
          <div className="pt-2">
            <p className="text-sm text-slate-400 mb-1">
              {nights} malam • {activeService.priceFormatted}
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#1E3A4C]">
              Estimasi Rp{estimatedTotal.toLocaleString('id-ID')}
            </p>
            <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed">
              Belum termasuk biaya platform, obat, dan tindakan medis.
            </p>
          </div>
        </div>

        <button className="w-full bg-[#FF6B1A] hover:bg-[#e85d10] text-white font-semibold py-3.5 rounded-xl text-sm md:text-base transition shadow-sm mb-3.5 cursor-pointer">
          Ajukan reservasi
        </button>

        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
          Belum ada pembayaran. Klinik akan meninjau pengajuan terlebih dahulu.
        </p>
      </div>

      {/* Card Kontak Klinik */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
        <h3 className="text-xl font-bold text-[#1E3A4C] mb-2.5">
          Kontak klinik
        </h3>
        <p className="text-base font-semibold text-slate-700 mb-1">
          {clinic.phone}
        </p>
        <p className="text-sm text-slate-400 mb-5">
          {clinic.hours} • Setiap hari
        </p>

        <button className="w-full bg-[#E6EFF5] hover:bg-[#d8e6ef] text-sm md:text-base text-[#1E3A4C] font-semibold py-3.5 rounded-xl transition cursor-pointer">
          Hubungi klinik
        </button>
      </div>
    </aside>
  );
}