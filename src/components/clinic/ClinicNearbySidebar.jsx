// src/components/clinic/ClinicNearbySidebar.jsx
import React, { useState } from 'react';

export default function ClinicNearbySidebar({
  clinics = [],
  selectedClinicId,
  onSelectClinic,
  onViewProfile,
  areaLabel = 'Di sekitar lokasi Anda',
  userLocationLabel,
  onChangeLocation,
  onRetryMap,
  areaFilter = 'Semua area Bali',
  setAreaFilter,
  openNowOnly = false,
  setOpenNowOnly,
  serviceFilter = 'Semua layanan',
  setServiceFilter,
  searchQuery = '',
  setSearchQuery,
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [localArea, setLocalArea] = useState('Semua area Bali');
  const [localOpenNow, setLocalOpenNow] = useState(false);
  const [localService, setLocalService] = useState('Semua layanan');

  // State tinggi Bottom Sheet di Mobile (bisa diketuk garis abu-abunya untuk naik/turun)
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const activeSearch = setSearchQuery ? searchQuery : localSearch;
  const handleSearchChange = setSearchQuery || setLocalSearch;

  const activeArea = setAreaFilter ? areaFilter : localArea;
  const handleAreaChange = setAreaFilter || setLocalArea;

  const activeOpenNow = setOpenNowOnly ? openNowOnly : localOpenNow;
  const handleOpenNowToggle = () => {
    if (setOpenNowOnly) {
      setOpenNowOnly(!openNowOnly);
    } else {
      setLocalOpenNow(!localOpenNow);
    }
  };

  const activeService = setServiceFilter ? serviceFilter : localService;
  const handleServiceChange = setServiceFilter || setLocalService;

  const displayLocationText = userLocationLabel || areaLabel;

  const filteredClinics = clinics.filter((c) => {
    const matchSearch =
      !activeSearch.trim() ||
      c.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      (c.area || '').toLowerCase().includes(activeSearch.toLowerCase()) ||
      (c.shortArea || '').toLowerCase().includes(activeSearch.toLowerCase());

    const matchArea =
      activeArea === 'Semua area Bali' ||
      (c.area || '').toLowerCase().includes(activeArea.toLowerCase()) ||
      (c.shortArea || '').toLowerCase().includes(activeArea.toLowerCase());

    const matchOpen = !activeOpenNow || c.isOpen;

    const matchService =
      activeService === 'Semua layanan' ||
      (activeService === 'Rawat inap' &&
        !c.inpatientBadge?.includes('penuh')) ||
      (activeService === 'Penitipan' && !c.boardingBadge?.includes('penuh'));

    return matchSearch && matchArea && matchOpen && matchService;
  });

  return (
    <aside
      className={`w-full bg-white rounded-t-[28px] md:rounded-[28px] shadow-[0_-10px_35px_rgba(15,23,42,0.14)] md:shadow-[0_14px_40px_rgba(24,59,86,0.12)] border-t md:border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 font-sans ${
        sheetExpanded ? 'max-h-[82dvh]' : 'max-h-[56dvh]'
      } md:max-h-[calc(100dvh-128px)]`}
    >
      {/* DRAG HANDLE KHUSUS MOBILE (Persis Google Maps Bottom Sheet) */}
      <button
        type="button"
        onClick={() => setSheetExpanded((prev) => !prev)}
        aria-label="Perluas atau kecilkan daftar klinik"
        className="md:hidden w-full pt-3 pb-1.5 flex flex-col items-center justify-center cursor-pointer shrink-0 focus:outline-none"
      >
        <span className="w-11 h-1.5 rounded-full bg-slate-300" />
      </button>

      {/* HEADER, LOKASI, SEARCH, & FILTER HORIZONTAL SCROLL */}
      <div className="px-5 pt-2 md:pt-6 pb-3.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C]">
            Temukan klinik
          </h2>
          <span className="bg-[#EBF2F7] text-[#1E3A4C] text-xs font-bold px-3 py-1 rounded-full shrink-0">
            {filteredClinics.length} mitra
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs mb-3.5">
          <div className="flex items-center gap-1.5 text-slate-600 min-w-0">
            <svg
              className="w-4 h-4 text-[#2C5E7A] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{displayLocationText}</span>
          </div>
          <button
            type="button"
            onClick={onChangeLocation}
            className="font-bold text-[#2C5E7A] hover:underline cursor-pointer shrink-0"
          >
            Ubah
          </button>
        </div>

        <div className="relative mb-3">
          <svg
            className="w-4 h-4 text-[#2C5E7A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35"
            />
          </svg>
          <input
            type="text"
            value={activeSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari nama klinik atau area"
            className="w-full bg-white border border-slate-200/90 rounded-full pl-10 pr-4 py-2.5 text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition"
          />
        </div>

        {/* BARIS FILTER: BISA DI-SWIPE KE KIRI/KANAN DI LAYAR HP TANPA KELUAR CARD */}
        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap -mx-5 px-5 md:mx-0 md:px-0 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative shrink-0">
            <select
              value={activeArea}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="appearance-none bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] text-xs font-bold pl-3.5 pr-8 py-2 rounded-full cursor-pointer focus:outline-none transition"
            >
              <option value="Semua area Bali">Semua area Bali</option>
              <option value="Renon">Renon</option>
              <option value="Sanur">Sanur</option>
              <option value="Ubud">Ubud</option>
            </select>
            <svg
              className="w-3.5 h-3.5 text-[#1E3A4C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={handleOpenNowToggle}
            className={`shrink-0 text-xs font-bold px-3.5 py-2 rounded-full transition cursor-pointer whitespace-nowrap ${
              activeOpenNow
                ? 'bg-[#2C5E7A] text-white shadow-2xs'
                : 'bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C]'
            }`}
          >
            Buka sekarang
          </button>

          <div className="relative shrink-0">
            <select
              value={activeService}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="appearance-none bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] text-xs font-bold pl-3.5 pr-8 py-2 rounded-full cursor-pointer focus:outline-none transition"
            >
              <option value="Semua layanan">Semua layanan</option>
              <option value="Konsultasi">Konsultasi</option>
              <option value="Rawat inap">Rawat inap</option>
              <option value="Penitipan">Penitipan</option>
            </select>
            <svg
              className="w-3.5 h-3.5 text-[#1E3A4C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* DAFTAR KLINIK */}
      <div className="flex-1 overflow-y-auto px-4 md:px-5 py-3.5 space-y-3">
        {filteredClinics.map((clinic) => {
          const isSelected = selectedClinicId === clinic.id;
          return (
            <div
              key={clinic.id}
              onClick={() => onSelectClinic && onSelectClinic(clinic)}
              className={`rounded-2xl p-4 border transition cursor-pointer ${
                isSelected
                  ? 'bg-[#F4F8FB] border-[#2C5E7A] shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="w-12 h-12 rounded-full object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-[#1E3A4C] truncate">
                      {clinic.number}. {clinic.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {clinic.shortArea || clinic.area} · {clinic.distance} ·{' '}
                      {clinic.hours}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    clinic.isOpen
                      ? 'bg-[#E6F7EF] text-[#15803D]'
                      : 'bg-[#FEE2E2] text-[#DC2626]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      clinic.isOpen ? 'bg-[#16A34A]' : 'bg-[#DC2626]'
                    }`}
                  />
                  {clinic.isOpen ? 'Buka' : 'Tutup'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-[#EBF2F7] text-[#1E3A4C] text-[11px] font-bold px-3 py-1 rounded-full">
                  {clinic.inpatientBadge || 'Rawat inap 3/8'}
                </span>
                <span className="bg-[#EBF2F7] text-[#1E3A4C] text-[11px] font-bold px-3 py-1 rounded-full">
                  {clinic.boardingBadge || 'Penitipan 5/12'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <span className="text-slate-500">
                  Konsultasi mulai {clinic.startingPrice || 'Rp150.000'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onViewProfile) {
                      onViewProfile(clinic);
                    } else if (onSelectClinic) {
                      onSelectClinic(clinic);
                    }
                  }}
                  className="font-bold text-[#2C5E7A] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Lihat profil</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed shrink-0">
        Belum menemukan yang cocok? Perluas radius atau ubah area. Peta gagal
        dimuat?{' '}
        <button
          type="button"
          onClick={onRetryMap || onChangeLocation}
          className="font-semibold text-[#2C5E7A] hover:underline cursor-pointer"
        >
          Coba lagi.
        </button>
      </div>
    </aside>
  );
}