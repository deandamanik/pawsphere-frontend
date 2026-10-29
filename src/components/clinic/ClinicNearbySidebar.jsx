// src/components/clinic/ClinicNearbySidebar.jsx
import { useState, useRef, useEffect } from 'react';

const RADIUS_OPTIONS = [
    { label: 'Radius 5 km', value: 5 },
    { label: 'Radius 10 km', value: 10 },
    { label: 'Radius 20 km', value: 20 },
    { label: 'Radius 30 km', value: 30 },
    { label: 'Semua area Bali', value: Infinity },
];

const SERVICE_OPTIONS = [
    { label: 'Semua layanan', value: 'all' },
    { label: 'Rawat inap', value: 'hospitalization' },
    { label: 'Penitipan', value: 'boarding' },
    { label: 'Konsultasi', value: 'consultation' },
    { label: 'Vaksinasi & steril', value: 'vaccination' },
];

export default function ClinicNearbySidebar({
    clinics = [],
    selectedClinicId,
    onSelectClinic,
    onChangeLocation,
    areaLabel = 'Renon, Denpasar',
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRadius, setSelectedRadius] = useState(RADIUS_OPTIONS[4]);
    // Default false agar awalnya terlihat semua klinik (Buka & Tutup), lalu saat diklik menyaring yang Buka saja
    const [onlyOpenNow, setOnlyOpenNow] = useState(false);
    const [selectedService, setSelectedService] = useState(SERVICE_OPTIONS[0]);
    const [openDropdown, setOpenDropdown] = useState(null); // 'radius' | 'service' | null

    const dropdownContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredClinics = clinics.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.area.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRadius = (c.distanceKm ?? 0) <= selectedRadius.value;
        const matchesOpen = onlyOpenNow ? c.isOpenNow === true : true;
        const matchesService =
            selectedService.value === 'all'
                ? true
                : selectedService.value === 'hospitalization'
                    ? !c.hospitalizationFull
                    : c.availableServices?.includes(selectedService.value);

        return matchesSearch && matchesRadius && matchesOpen && matchesService;
    });

    return (
        <div className="w-full bg-white rounded-[24px] p-5 md:p-6 shadow-[0_14px_40px_-8px_rgba(24,59,86,0.16)] border border-slate-100/90 font-sans flex flex-col max-h-[calc(100dvh-140px)]">
            {/* Header: Temukan klinik & Badge jumlah mitra */}
            <div className="flex items-center justify-between mb-2 shrink-0">
                <h2 className="font-display text-xl font-extrabold text-[#1E3A4C]">
                    Temukan klinik
                </h2>
                <span className="bg-[#EBF2F7] text-[#243B53] text-xs font-bold px-3 py-1 rounded-full">
                    {filteredClinics.length} mitra
                </span>
            </div>

            {/* Baris Lokasi Aktif & Tombol Ubah */}
            <div className="flex items-center justify-between text-xs md:text-sm mb-3.5 shrink-0">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <svg className="w-4 h-4 text-[#2C5E7A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{areaLabel}</span>
                </div>
                <button
                    type="button"
                    onClick={onChangeLocation}
                    className="text-xs font-bold text-[#2C5E7A] hover:underline cursor-pointer"
                >
                    Ubah
                </button>
            </div>

            {/* Input Pencarian */}
            <div className="relative mb-3 shrink-0">
                <svg className="w-4 h-4 text-[#2C5E7A] absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama klinik atau area"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition"
                />
            </div>

            {/* Barisan Filter Pills (1 Baris Kesamping) */}
            <div
                ref={dropdownContainerRef}
                className="relative flex items-center gap-1.5 mb-2.5 shrink-0"
            >
                {/* 1. Dropdown Radius */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === 'radius' ? null : 'radius')}
                        className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 whitespace-nowrap transition cursor-pointer ${openDropdown === 'radius'
                            ? 'bg-[#2C5E7A] text-white'
                            : 'bg-[#EBF2F7] text-[#1E3A4C] hover:bg-[#dce7f0]'
                            }`}
                    >
                        <span>{selectedRadius.label}</span>
                        <svg
                            className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'radius' ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {openDropdown === 'radius' && (
                        <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-[0_10px_28px_rgba(24,59,86,0.16)] border border-slate-100 py-1.5 z-30">
                            {RADIUS_OPTIONS.map((option) => {
                                const isSelected = selectedRadius.value === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setSelectedRadius(option);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition cursor-pointer ${isSelected
                                            ? 'bg-[#EBF2F7] text-[#1E3A4C] font-bold'
                                            : 'text-slate-600 hover:bg-slate-50 font-medium'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 text-[#2C5E7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 2. Toggle Pill: Buka sekarang */}
                <button
                    type="button"
                    onClick={() => setOnlyOpenNow(!onlyOpenNow)}
                    className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${onlyOpenNow
                        ? 'bg-[#2C5E7A] text-white shadow-xs'
                        : 'bg-[#EBF2F7] text-[#1E3A4C] hover:bg-[#dce7f0]'
                        }`}
                >
                    <span>Buka sekarang</span>
                </button>

                {/* 3. Dropdown Semua Layanan */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === 'service' ? null : 'service')}
                        className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 whitespace-nowrap transition cursor-pointer ${openDropdown === 'service'
                            ? 'bg-[#2C5E7A] text-white'
                            : 'bg-[#EBF2F7] text-[#1E3A4C] hover:bg-[#dce7f0]'
                            }`}
                    >
                        <span>{selectedService.label}</span>
                        <svg
                            className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'service' ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {openDropdown === 'service' && (
                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-[0_10px_28px_rgba(24,59,86,0.16)] border border-slate-100 py-1.5 z-30">
                            {SERVICE_OPTIONS.map((option) => {
                                const isSelected = selectedService.value === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setSelectedService(option);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition cursor-pointer ${isSelected
                                            ? 'bg-[#EBF2F7] text-[#1E3A4C] font-bold'
                                            : 'text-slate-600 hover:bg-slate-50 font-medium'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 text-[#2C5E7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Daftar Card Klinik */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0">
                {filteredClinics.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-[#1E3A4C] mb-1">
                            Tidak ada klinik dalam filter ini
                        </p>
                        <p className="text-[11px] text-slate-500 mb-3">
                            Coba matikan filter "Buka sekarang" atau perluas radius pencarian.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedRadius(RADIUS_OPTIONS[3]);
                                setSelectedService(SERVICE_OPTIONS[0]);
                                setOnlyOpenNow(false);
                                setSearchQuery('');
                            }}
                            className="text-xs font-bold text-[#2C5E7A] hover:underline cursor-pointer"
                        >
                            Reset semua filter
                        </button>
                    </div>
                ) : (
                    filteredClinics.map((clinic) => {
                        const isSelected = clinic.id === selectedClinicId;
                        return (
                            <div
                                key={clinic.id}
                                onClick={() => onSelectClinic && onSelectClinic(clinic)}
                                className={`rounded-2xl p-3.5 transition-all duration-200 cursor-pointer border ${isSelected
                                    ? 'border-[#2C5E7A] bg-[#F8FBFD] shadow-xs ring-1 ring-[#2C5E7A]/20'
                                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                                    }`}
                            >
                                {/* Baris Atas: Foto + Nama + Badge Status Buka/Tutup */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={clinic.image}
                                            alt={clinic.name}
                                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                                {clinic.number}. {clinic.name}
                                            </h3>
                                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                {clinic.shortArea} · {clinic.distance} · {clinic.openStatus}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Elemen Status Buka / Tutup */}
                                    <span
                                        className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${clinic.isOpenNow
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                            : 'bg-rose-50 text-rose-600 border border-rose-200/70'
                                            }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${clinic.isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'
                                                }`}
                                        />
                                        {clinic.isOpenNow ? 'Buka' : 'Tutup'}
                                    </span>
                                </div>

                                {/* Badge Kapasitas */}
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span
                                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${clinic.hospitalizationFull
                                            ? 'bg-[#EEF3F7] text-slate-600'
                                            : 'bg-[#EBF2F7] text-[#1E3A4C]'
                                            }`}
                                    >
                                        {clinic.hospitalizationBadge}
                                    </span>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBF2F7] text-[#1E3A4C]">
                                        {clinic.boardingBadge}
                                    </span>
                                </div>

                                {/* Harga & Link Lihat Profil */}
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-slate-500">
                                        Konsultasi mulai {clinic.startingPrice}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onSelectClinic) onSelectClinic(clinic);
                                        }}
                                        className="text-[11px] font-bold text-[#2C5E7A] hover:text-[#1E3A4C] transition cursor-pointer"
                                    >
                                        Lihat profil →
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Catatan Kaki Bawah */}
            <p className="text-[11px] text-slate-400 leading-relaxed mt-3.5 pt-2 border-t border-slate-100 shrink-0">
                Belum menemukan yang cocok? Perluas radius atau ubah area. Peta gagal dimuat? Coba lagi.
            </p>
        </div>
    );
}