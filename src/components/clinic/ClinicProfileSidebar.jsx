// src/components/clinic/ClinicProfileSidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClinicProfileSidebar({
    clinic,
    onBack,
    onContinueSchedule,
}) {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [serviceTab, setServiceTab] = useState('konsultasi'); // 'konsultasi' | 'rawat_inap'
    const [careMethod, setCareMethod] = useState('klinik'); // 'klinik' | 'rumah'

    const photos = clinic?.images?.length ? clinic.images : [clinic?.image];

    // Reset slide ke foto pertama saat berganti klinik
    useEffect(() => {
        setCurrentSlide(0);
    }, [clinic?.id]);

    if (!clinic) return null;

    const prevSlide = (e) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const nextSlide = (e) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    // Handler untuk swipe layar sentuh / mouse drag
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (deltaX > 40) prevSlide();
        if (deltaX < -40) nextSlide();
        setTouchStartX(null);
    };

    return (
        <div className="w-full bg-white rounded-[24px] overflow-hidden shadow-[0_14px_40px_-8px_rgba(24,59,86,0.18)] border border-slate-100/90 font-sans flex flex-col max-h-[calc(100dvh-140px)]">
            {/* 1. Header Carousel Foto */}
            <div
                className="relative h-44 w-full bg-slate-100 shrink-0 overflow-hidden group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Track Slide Gambar */}
                <div
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {photos.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`${clinic.name} - foto ${idx + 1}`}
                            className="w-full h-full object-cover shrink-0 select-none"
                            draggable={false}
                        />
                    ))}
                </div>

                {/* Tombol Kembali ke Daftar Klinik (Pojok Kiri Atas Foto) */}
                <button
                    type="button"
                    onClick={onBack}
                    title="Kembali ke daftar klinik"
                    className="absolute top-3 left-3 z-10 bg-white/90 hover:bg-white text-[#1E3A4C] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Daftar klinik</span>
                </button>

                {/* Tombol Navigasi Panah Carousel Kiri & Kanan */}
                {photos.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Foto sebelumnya"
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Foto berikutnya"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Dots Indicator di Bawah Foto */}
                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
                            {photos.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 2. Konten Detail & Pilihan Layanan */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1 min-h-0">
                {/* Baris Badge Mitra & Jam Buka */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C5E7A]">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                        <span>Mitra PawSphere</span>
                    </div>

                    <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full ${clinic.isOpenNow
                            ? 'bg-[#EBF2F7] text-[#1E3A4C]'
                            : 'bg-rose-50 text-rose-600'
                            }`}
                    >
                        {clinic.isOpenNow ? `Buka · ${clinic.hours}` : `Tutup · ${clinic.openStatus}`}
                    </span>
                </div>

                {/* Nama Klinik & Alamat */}
                <h1 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C] leading-snug mb-1">
                    {clinic.name}
                </h1>
                <p className="text-xs text-slate-500 mb-4">
                    {clinic.address} · {clinic.distance}
                </p>

                {/* Profil Dokter Hewan */}
                {clinic.doctor && (
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                        <img
                            src={clinic.doctor.avatar}
                            alt={clinic.doctor.name}
                            className="w-10 h-10 rounded-full object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                            <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                {clinic.doctor.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                                {clinic.doctor.clinicName}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pilihan Kategori Layanan (Konsultasi vs Rawat inap) */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-[#1E3A4C] mb-2.5">
                        Pilih layanan untuk hewanmu
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => {
                                setServiceTab('konsultasi');
                                setCareMethod('klinik');
                            }}
                            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${serviceTab === 'konsultasi'
                                ? 'bg-[#2C5E7A] text-white shadow-xs'
                                : 'bg-[#EBF2F7] text-[#1E3A4C] hover:bg-[#dce7f0]'
                                }`}
                        >
                            Konsultasi
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setServiceTab('rawat_inap');
                                setCareMethod('klinik');
                            }}
                            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${serviceTab === 'rawat_inap'
                                ? 'bg-[#2C5E7A] text-white shadow-xs'
                                : 'bg-[#EBF2F7] text-[#1E3A4C] hover:bg-[#dce7f0]'
                                }`}
                        >
                            Rawat inap
                        </button>
                    </div>
                </div>

                {/* Pilihan Cara Perawatan ("Bagaimana ingin dirawat?") */}
                <div className="mb-5">
                    <label className="block text-xs font-bold text-[#1E3A4C] mb-2.5">
                        Bagaimana ingin dirawat?
                    </label>

                    {serviceTab === 'konsultasi' ? (
                        <div className="grid grid-cols-2 gap-2.5">
                            {/* Opsi 1: Ke klinik */}
                            <button
                                type="button"
                                onClick={() => setCareMethod('klinik')}
                                className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-2 transition cursor-pointer ${careMethod === 'klinik'
                                    ? 'bg-[#EEF4F8] border-[#2C5E7A]'
                                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <svg className="w-4 h-4 text-[#2C5E7A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-[#1E3A4C] truncate">Ke klinik</div>
                                        <div className="text-[11px] text-slate-500 truncate">
                                            Mulai {clinic.startingPrice}
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${careMethod === 'klinik' ? 'border-[#2C5E7A] border-4' : 'border-slate-300'
                                        }`}
                                />
                            </button>

                            {/* Opsi 2: Dokter ke rumah */}
                            <button
                                type="button"
                                onClick={() => setCareMethod('rumah')}
                                className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-2 transition cursor-pointer ${careMethod === 'rumah'
                                    ? 'bg-[#EEF4F8] border-[#2C5E7A]'
                                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <svg className="w-4 h-4 text-[#2C5E7A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-[#1E3A4C] whitespace-normal break-words leading-tight">Dokter ke rumah</div>
                                        <div className="text-[11px] text-slate-500 whitespace-normal break-words leading-tight">Perawatan di rumah</div>
                                    </div>
                                </div>
                                <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${careMethod === 'rumah' ? 'border-[#2C5E7A] border-4' : 'border-slate-300'
                                        }`}
                                />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {/* Opsi Rawat Inap Medis */}
                            <button
                                type="button"
                                onClick={() => setCareMethod('klinik')}
                                className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-2 transition cursor-pointer ${careMethod === 'klinik'
                                    ? 'bg-[#EEF4F8] border-[#2C5E7A]'
                                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                                    }`}
                            >
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-[#1E3A4C] truncate">Rawat inap medis</div>
                                    <div className="text-[11px] text-slate-500 truncate">{clinic.hospitalizationBadge}</div>
                                </div>
                                <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${careMethod === 'klinik' ? 'border-[#2C5E7A] border-4' : 'border-slate-300'
                                        }`}
                                />
                            </button>

                            {/* Opsi Penitipan / Pet Boarding */}
                            <button
                                type="button"
                                onClick={() => setCareMethod('rumah')}
                                className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-2 transition cursor-pointer ${careMethod === 'rumah'
                                    ? 'bg-[#EEF4F8] border-[#2C5E7A]'
                                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                                    }`}
                            >
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-[#1E3A4C] truncate">Pet Boarding</div>
                                    <div className="text-[11px] text-slate-500 truncate">{clinic.boardingBadge}</div>
                                </div>
                                <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${careMethod === 'rumah' ? 'border-[#2C5E7A] border-4' : 'border-slate-300'
                                        }`}
                                />
                            </button>
                        </div>
                    )}
                </div>

                {/* Tombol Utama Oranye: Lanjut pilih jadwal */}
                <button
                    type="button"
                    onClick={() => {
                        if (onContinueSchedule) {
                            onContinueSchedule({ clinic, serviceTab, careMethod });
                        } else {
                            navigate(`/clinic/${clinic.id}/jadwal`, {
                                state: { serviceTab, careMethod },
                            });
                        }
                    }}
                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer mb-4"
                >
                    <span>→</span>
                    <span>Lanjut pilih jadwal</span>
                </button>

                {/* Footer Card: Vitamin, pakan & perawatan -> Lihat produk */}
                <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Vitamin, pakan & perawatan</span>
                    <button
                        type="button"
                        onClick={() => navigate('/marketplace')}
                        className="font-bold text-[#2C5E7A] hover:underline cursor-pointer"
                    >
                        Lihat produk
                    </button>
                </div>
            </div>
        </div>
    );
}