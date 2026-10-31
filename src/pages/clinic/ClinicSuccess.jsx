// src/pages/clinic/ClinicSuccess.jsx
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CLINICS_DATA } from '../../data/clinicsData';

export default function ClinicSuccess() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Ambil data klinik & state dari halaman pembayaran (dengan fallback sesuai gambar desain)
    const clinic =
        location.state?.clinic ||
        CLINICS_DATA.find((c) => c.id === id) ||
        CLINICS_DATA[0];

    const petData = location.state?.petData || {
        name: 'Milo',
        type: 'Kucing domestik',
        age: '2 tahun',
        weight: '4 kg',
    };

    const dateObj = location.state?.date || {
        label: 'Senin, 2 November 2026',
        short: '2 Nov 2026',
    };

    const selectedTime = location.state?.time || '10.00';
    const serviceName = location.state?.service || 'Konsultasi';
    const methodName = location.state?.method || 'Datang ke klinik';
    const paymentMethodLabel = location.state?.paymentMethodLabel || 'GoPay';
    const basePriceNum = location.state?.basePriceNum || 150000;
    const serviceFeeNum = location.state?.serviceFeeNum || 5000;
    const totalPriceNum = location.state?.totalPriceNum || 155000;

    const formatRupiah = (num) => 'Rp' + num.toLocaleString('id-ID');
    const shortPetSpecies = petData?.type ? petData.type.split(' ')[0] : 'Kucing';

    return (
        <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-12 px-6 lg:px-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* ================= KOLOM KIRI: TIKET ANTREAN & BUKTI PEMBAYARAN ================= */}
                    <div className="lg:col-span-7">
                        {/* Header Status Pembayaran Berhasil */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-[#E6F2EC] flex items-center justify-center text-[#2C5E7A] shrink-0">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-display text-2xl md:text-[28px] font-extrabold text-[#1E3A4C] leading-tight">
                                    Pembayaran berhasil!
                                </h1>
                                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                                    Nomor antrean {petData.name} sudah siap. Sampai bertemu di klinik.
                                </p>
                            </div>
                        </div>

                        {/* Kartu Utama Biru Tua: Nomor Antrean A-012 */}
                        <div className="bg-[#2D5F7C] text-white rounded-[24px] p-6 md:p-8 shadow-[0_12px_32px_rgba(45,95,124,0.22)] text-center mb-4">
                            <p className="text-[11px] md:text-xs font-bold tracking-wider uppercase text-white/90 mb-3">
                                ANTREAN KUNJUNGAN · {clinic.name.toUpperCase()}
                            </p>

                            <div className="font-display text-5xl md:text-6xl font-extrabold tracking-tight my-2">
                                A-012
                            </div>

                            <p className="text-sm md:text-base font-bold text-white/95 mt-3 mb-7">
                                {dateObj.label} · {selectedTime} WITA
                            </p>

                            <div className="flex items-center justify-between text-xs text-white/85 pt-2">
                                <span>
                                    {petData.name} ·{' '}
                                    {methodName === 'Dokter ke rumah'
                                        ? 'Konsultasi di rumah'
                                        : 'Konsultasi di klinik'}
                                </span>
                                <span className="font-medium tracking-wide">PS-C-261102-012</span>
                            </div>
                        </div>

                        {/* Info Box Instruksi Kedatangan Check-in */}
                        <div className="bg-[#EBF2F7] rounded-2xl p-4 flex items-start gap-3 mb-5">
                            <svg
                                className="w-4 h-4 text-[#2C5E7A] shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                            <p className="text-xs text-[#243B53] leading-relaxed font-medium">
                                Datang pukul 09.45 WITA dan tunjukkan tiket ke resepsionis untuk check-in. Antrean mengikuti urutan layanan; kondisi darurat dapat diprioritaskan.
                            </p>
                        </div>

                        {/* Card Putih: Bukti Pembayaran */}
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)] mb-4">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <h2 className="font-display text-base md:text-lg font-extrabold text-[#1E3A4C]">
                                    Bukti pembayaran
                                </h2>
                                <span className="bg-[#E6F2EC] text-[#23533D] text-xs font-bold px-3.5 py-1 rounded-full">
                                    Lunas
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs md:text-sm mb-2">
                                <span className="text-slate-500">
                                    {paymentMethodLabel} · {dateObj.short}, 09.42 WITA
                                </span>
                                <span className="font-extrabold text-[#1E3A4C]">
                                    {formatRupiah(totalPriceNum)}
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 pb-5 mb-5 border-b border-slate-100">
                                {formatRupiah(basePriceNum)} konsultasi + {formatRupiah(serviceFeeNum)} biaya layanan.
                            </p>

                            {/* Tombol Aksi Bukti Bayar & Detail Booking */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4 text-[#2C5E7A]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                        />
                                    </svg>
                                    <span>Unduh bukti bayar</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/clinic')}
                                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                        />
                                    </svg>
                                    <span>Lihat detail booking</span>
                                </button>
                            </div>
                        </div>

                        {/* Catatan Kaki Bawah */}
                        <p className="text-[11px] md:text-xs text-slate-400">
                            Nomor ini adalah urutan kunjungan, bukan jaminan admisi medis atau rawat inap.
                        </p>
                    </div>

                    {/* ================= KOLOM KANAN: RINGKASAN KLINIK & TOMBOL RUTE ================= */}
                    <aside className="lg:col-span-5">
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            {/* Badge Mitra PawSphere */}
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C5E7A] mb-2">
                                <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                <span>Mitra PawSphere</span>
                            </div>

                            {/* Nama & Alamat Klinik */}
                            <h2 className="font-display text-xl font-extrabold text-[#1E3A4C] mb-1">
                                {clinic.name}
                            </h2>
                            <p className="text-xs text-slate-500 pb-5 mb-5 border-b border-slate-100">
                                {clinic.address}
                            </p>

                            {/* Tabel Ringkasan Jadwal & Hewan */}
                            <div className="space-y-3.5 text-xs md:text-sm mb-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Layanan</span>
                                    <span className="font-bold text-[#1E3A4C]">{serviceName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Metode</span>
                                    <span className="font-bold text-[#1E3A4C]">{methodName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Jadwal</span>
                                    <span className="font-bold text-[#1E3A4C]">
                                        {dateObj.short} · {selectedTime}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Hewan</span>
                                    <span className="font-bold text-[#1E3A4C]">
                                        {petData.name} · {shortPetSpecies}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 mb-5">
                                Semua waktu dalam WITA.
                            </p>

                            {/* Tombol Lihat Rute ke Klinik */}
                            <button
                                type="button"
                                onClick={() => navigate('/clinic')}
                                className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                                <svg
                                    className="w-4 h-4 text-[#2C5E7A]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                                <span>Lihat rute ke klinik</span>
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}