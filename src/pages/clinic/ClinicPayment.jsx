// src/pages/clinic/ClinicPayment.jsx
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CLINICS_DATA } from '../../data/clinicsData';

const VA_BANKS = [
    { id: 'bca', name: 'BCA Virtual Account' },
    { id: 'bni', name: 'BNI Virtual Account' },
    { id: 'mandiri', name: 'Mandiri Virtual Account' },
];

export default function ClinicPayment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil data klinik berdasarkan parameter URL atau state dari halaman sebelumnya
    const clinic =
        location.state?.clinic ||
        CLINICS_DATA.find((c) => c.id === id) ||
        CLINICS_DATA[0];

    // Ambil data booking dari Slicing 4 (dengan fallback sesuai gambar desain jika dibuka langsung)
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
    const selectedDoctor =
        location.state?.doctor || clinic.doctor?.name || 'drh. Putu Ayu Pratiwi';
    const serviceName = location.state?.service || 'Konsultasi';
    const methodName = location.state?.method || 'Datang ke klinik';

    // State Pilihan Metode Pembayaran (Hanya UI Slicing, belum ada logic transaksi)
    const [paymentMethod, setPaymentMethod] = useState('gopay'); // 'gopay' | 'va'
    const [selectedBank, setSelectedBank] = useState('bca');

    // Format rincian harga
    const basePriceNum =
        parseInt((clinic.startingPrice || 'Rp150.000').replace(/\D/g, ''), 10) ||
        150000;
    const serviceFeeNum = 5000;
    const travelFeeNum = methodName === 'Dokter ke rumah' ? 25000 : 0;
    const totalPriceNum = basePriceNum + serviceFeeNum + travelFeeNum;

    const formatRupiah = (num) =>
        'Rp' + num.toLocaleString('id-ID');

    const shortDateBadge = `${dateObj.short.replace(' 2026', '')} · ${selectedTime} WITA`;
    const shortPetSpecies = petData?.type ? petData.type.split(' ')[0] : 'Kucing';

    return (
        <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-14 px-6 lg:px-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* ================= KOLOM KIRI: RINCIAN BIAYA & METODE PEMBAYARAN ================= */}
                    <div className="lg:col-span-7 space-y-5">
                        {/* CARD 1: Rincian Konsultasi di Klinik */}
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            {/* Header & Badge Jadwal */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                <h1 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C]">
                                    {methodName === 'Dokter ke rumah'
                                        ? 'Konsultasi di rumah'
                                        : 'Konsultasi di klinik'}
                                </h1>
                                <span className="bg-[#EBF2F7] text-[#243B53] text-xs font-bold px-3.5 py-1.5 rounded-full">
                                    {shortDateBadge}
                                </span>
                            </div>

                            {/* Profil Dokter */}
                            <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-slate-100">
                                <img
                                    src={
                                        clinic.doctor?.avatar ||
                                        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
                                    }
                                    alt={selectedDoctor}
                                    className="w-11 h-11 rounded-full object-cover bg-slate-100 shrink-0"
                                />
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-[#1E3A4C] truncate">
                                        {selectedDoctor}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate mt-0.5">
                                        {clinic.name}
                                    </div>
                                </div>
                            </div>

                            {/* Rincian Item Pembayaran */}
                            <div className="space-y-3.5 text-xs md:text-sm pb-5 mb-5 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">
                                        Konsultasi {petData.name} · 1 sesi, 30 menit
                                    </span>
                                    <span className="font-bold text-[#1E3A4C]">
                                        {formatRupiah(basePriceNum)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Biaya layanan PawSphere</span>
                                    <span className="font-bold text-[#1E3A4C]">
                                        {formatRupiah(serviceFeeNum)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Biaya perjalanan</span>
                                    <span className="font-bold text-[#1E3A4C]">
                                        {travelFeeNum === 0 ? 'Rp0' : formatRupiah(travelFeeNum)}
                                    </span>
                                </div>
                            </div>

                            {/* Total Pembayaran */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-display text-base md:text-lg font-extrabold text-[#1E3A4C]">
                                    Total pembayaran
                                </span>
                                <span className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C]">
                                    {formatRupiah(totalPriceNum)}
                                </span>
                            </div>

                            <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed">
                                Pemeriksaan konsultasi termasuk. Obat atau tindakan tambahan hanya dilakukan dengan persetujuan dan biaya terpisah.
                            </p>
                        </div>

                        {/* CARD 2: Pilih Metode Pembayaran */}
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            <h2 className="font-display text-base md:text-lg font-extrabold text-[#1E3A4C] mb-4">
                                Pilih metode pembayaran
                            </h2>

                            {/* Grid 2 Pilihan: GoPay vs Virtual Account */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                                {/* Opsi 1: GoPay */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('gopay')}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${paymentMethod === 'gopay'
                                        ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Ikon Wallet */}
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#2C5E7A] shrink-0">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.8"
                                                    d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.8"
                                                    d="M16 12h.01M21 10h-4a2 2 0 00-2 2v0a2 2 0 002 2h4"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                                GoPay
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                Akun terhubung · ••42
                                            </div>
                                        </div>
                                    </div>

                                    {/* Radio Circle */}
                                    <span
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${paymentMethod === 'gopay'
                                            ? 'border-[#2C5E7A] border-[5px] bg-white'
                                            : 'border-slate-300 bg-white'
                                            }`}
                                    />
                                </button>

                                {/* Opsi 2: Virtual Account */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('va')}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${paymentMethod === 'va'
                                        ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Ikon Bank */}
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#2C5E7A] shrink-0">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.8"
                                                    d="M3 10h18M4 10v8m4-8v8m4-8v8m4-8v8m4-8v8M2 18h20M12 3l9 5H3l9-5z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                                Virtual account
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                BCA, BNI, Mandiri
                                            </div>
                                        </div>
                                    </div>

                                    {/* Radio Circle */}
                                    <span
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${paymentMethod === 'va'
                                            ? 'border-[#2C5E7A] border-[5px] bg-white'
                                            : 'border-slate-300 bg-white'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Rekomendasi UX Tambahan: Sub-pilihan Bank saat Virtual Account dipilih */}
                            {paymentMethod === 'va' && (
                                <div className="flex flex-wrap items-center gap-2 mb-4 pt-1 transition-all duration-200">
                                    {VA_BANKS.map((bank) => {
                                        const isSelectedBank = selectedBank === bank.id;
                                        return (
                                            <button
                                                key={bank.id}
                                                type="button"
                                                onClick={() => setSelectedBank(bank.id)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${isSelectedBank
                                                    ? 'bg-[#2C5E7A] text-white border-[#2C5E7A]'
                                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {bank.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Info Box Bukti Bayar & Check-in */}
                            <div className="bg-[#EBF2F7] rounded-2xl p-4 flex items-start gap-3">
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
                                    Setelah pembayaran berhasil, nomor antrean dan bukti bayar langsung tersedia. Tunjukkan saat check-in.
                                </p>
                            </div>
                        </div>

                        {/* Baris Action Bawah: Persetujuan & Tombol Bayar Oranye (Slicing Only) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                                Dengan melanjutkan, kamu menyetujui ketentuan layanan dan kebijakan pembatalan klinik.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/clinic/${clinic.id}/berhasil`, {
                                        state: {
                                            clinic,
                                            petData,
                                            date: dateObj,
                                            doctor: selectedDoctor,
                                            time: selectedTime,
                                            service: serviceName,
                                            method: methodName,
                                            paymentMethodLabel:
                                                paymentMethod === 'gopay'
                                                    ? 'GoPay'
                                                    : VA_BANKS.find((b) => b.id === selectedBank)?.name || 'Virtual Account',
                                            basePriceNum,
                                            serviceFeeNum,
                                            totalPriceNum,
                                        },
                                    })
                                }
                                className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-8 rounded-2xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer shrink-0 min-w-[235px]"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 11V7a4 4 0 118 0v4"
                                    />
                                </svg>
                                <span>Bayar {formatRupiah(totalPriceNum)}</span>
                            </button>
                        </div>
                    </div>

                    {/* ================= KOLOM KANAN: RINGKASAN KLINIK MITRA ================= */}
                    <aside className="lg:col-span-5 space-y-4">
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

                            <p className="text-[11px] text-slate-400">
                                Semua waktu dalam WITA.
                            </p>
                        </div>

                        {/* Kotak Info Bawah Kanan */}
                        <div className="bg-[#EBF2F7] rounded-2xl p-4 flex items-start gap-3">
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
                                Setelah pembayaran berhasil, nomor antrean kunjungan akan tersedia.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}