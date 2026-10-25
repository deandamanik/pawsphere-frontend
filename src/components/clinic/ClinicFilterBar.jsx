import React from 'react';

export default function ClinicFilterBar({ filters, onChange, onSearch }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Lokasi */}
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-[#1E3A4C] mb-2">
            Lokasi
          </label>
          <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm md:text-base text-slate-700">
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => onChange('location', e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-700 font-medium text-sm md:text-base"
            />
          </div>
        </div>

        {/* Layanan */}
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-[#1E3A4C] mb-2">
            Layanan
          </label>
          <div className="relative">
            <select
              value={filters.service}
              onChange={(e) => onChange('service', e.target.value)}
              className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm md:text-base text-slate-700 font-medium focus:outline-none"
            >
              <option value="Semua layanan">Semua layanan</option>
              <option value="Pet Hospitalization">Pet Hospitalization</option>
              <option value="Pet Boarding">Pet Boarding</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              ▾
            </span>
          </div>
        </div>

        {/* Tanggal Masuk */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#1E3A4C] mb-2">
            Tanggal masuk
          </label>
          <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm md:text-base text-slate-700 font-medium">
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
            </svg>
            <span className="truncate">{filters.checkIn}</span>
          </div>
        </div>

        {/* Tanggal Keluar */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#1E3A4C] mb-2">
            Tanggal keluar
          </label>
          <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm md:text-base text-slate-700 font-medium">
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
            </svg>
            <span className="truncate">{filters.checkOut}</span>
          </div>
        </div>

        {/* Tombol Cari */}
        <div className="md:col-span-2">
          <button
            onClick={onSearch}
            className="w-full bg-[#2C5E7A] hover:bg-[#234B61] text-white text-sm md:text-base font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
            </svg>
            <span>Cari klinik</span>
          </button>
        </div>
      </div>
    </div>
  );
}