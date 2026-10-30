// src/pages/clinic/ClinicSchedule.jsx
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CLINICS_DATA } from '../../data/clinicsData';

const TIME_SLOTS = ['09.00', '09.30', '10.00', '10.30', '11.00'];

const DATE_OPTIONS = [
    { label: 'Senin, 2 November 2026', short: '2 Nov 2026' },
    { label: 'Selasa, 3 November 2026', short: '3 Nov 2026' },
    { label: 'Rabu, 4 November 2026', short: '4 Nov 2026' },
];

export default function ClinicSchedule() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const clinic = CLINICS_DATA.find((c) => c.id === id) || CLINICS_DATA[0];

    // Ambil daftar dokter (default dari data klinik + opsi dokter mitra)
    const doctorsList = [
        clinic.doctor?.name || 'drh. Putu Ayu Pratiwi',
        'drh. I Made Wirawan',
        'drh. Ni Luh Gede Saraswati',
    ];

    // State Biodata Hewan (Awalnya kosong sesuai Skenario 3)
    const [petData, setPetData] = useState(null);
    const [isPetFormOpen, setIsPetFormOpen] = useState(false);
    const [petForm, setPetForm] = useState({
        name: '',
        type: '',
        age: '',
        weight: '',
    });
    const [petFormError, setPetFormError] = useState('');

    // State Jadwal & Keluhan
    const [selectedDateObj, setSelectedDateObj] = useState(DATE_OPTIONS[0]);
    const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0]);
    const [selectedTime, setSelectedTime] = useState('10.00');
    const [complaint, setComplaint] = useState('');
    const [formValidationMsg, setFormValidationMsg] = useState('');

    // State Konfirmasi & Animasi Loading (Skenario 2, 5, 6)
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Fungsi bila ada perubahan input setelah konfirmasi -> minta konfirmasi ulang
    const invalidateConfirmation = () => {
        if (isConfirmed) setIsConfirmed(false);
        if (formValidationMsg) setFormValidationMsg('');
    };

    // Buka form biodata hewan
    const handleOpenPetForm = () => {
        if (petData) {
            setPetForm(petData);
        }
        setPetFormError('');
        setIsPetFormOpen(true);
    };

    // Submit form biodata hewan
    const handleSavePetData = (e) => {
        e.preventDefault();
        if (
            !petForm.name.trim() ||
            !petForm.type.trim() ||
            !petForm.age.trim() ||
            !petForm.weight.trim()
        ) {
            setPetFormError('Mohon lengkapi semua kolom biodata hewan peliharaanmu.');
            return;
        }

        setPetData({
            name: petForm.name.trim(),
            type: petForm.type.trim(),
            age: petForm.age.trim(),
            weight: petForm.weight.trim(),
        });
        setIsPetFormOpen(false);
        setPetFormError('');
        invalidateConfirmation();
    };

    // Handler Tombol Utama (Konfirmasi terlebih dahulu -> Lanjut ke pembayaran)
    const handlePrimaryAction = () => {
        // Jika belum dikonfirmasi, jalankan validasi + animasi spinner muter-muter
        if (!isConfirmed) {
            if (!petData) {
                setFormValidationMsg('Silakan klik dan isi biodata hewan peliharaan terlebih dahulu.');
                setIsPetFormOpen(true);
                return;
            }
            if (!complaint.trim()) {
                setFormValidationMsg(`Silakan tuliskan keluhan ${petData.name} terlebih dahulu.`);
                return;
            }

            setFormValidationMsg('');
            setIsConfirming(true);

            setTimeout(() => {
                setIsConfirming(false);
                setIsConfirmed(true);
            }, 900);
            return;
        }

        // Skenario 6: Jika sudah dikonfirmasi, redirect ke halaman Payment
        navigate(`/clinic/${clinic.id}/pembayaran`, {
            state: {
                clinic,
                petData,
                date: selectedDateObj,
                doctor: selectedDoctor,
                time: selectedTime,
                complaint,
                service: 'Konsultasi',
                method: location.state?.careMethod === 'rumah' ? 'Dokter ke rumah' : 'Datang ke klinik',
            },
        });
    };

    // Ambil kata pertama jenis hewan untuk ringkasan kanan (contoh: "Kucing domestik" -> "Kucing")
    const shortPetSpecies = petData?.type ? petData.type.split(' ')[0] : 'Hewan';

    return (
        <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-14 px-6 lg:px-10 font-sans">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)] gap-7 items-start">
                    {/* ================= KOLOM KIRI: CARD KONSULTASI DOKTER HEWAN ================= */}
                    <div className="w-full min-w-0">
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            {/* Header Card */}
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <h1 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C]">
                                    Konsultasi dokter hewan
                                </h1>
                                <span className="bg-[#EBF2F7] text-[#243B53] text-xs font-bold px-3.5 py-1.5 rounded-full shrink-0">
                                    30 menit
                                </span>
                            </div>

                            {/* Skenario 3: Field Biodata Hewan (Awalnya Kosong -> Klik Muncul Form -> Submit Tampil di Field) */}
                            <div className="mb-6">
                                {!petData && !isPetFormOpen && (
                                    <button
                                        type="button"
                                        onClick={handleOpenPetForm}
                                        className="w-full bg-[#EBF2F7] hover:bg-[#e1ebf3] border border-dashed border-[#2C5E7A]/40 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer group text-left"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#2C5E7A] shadow-2xs shrink-0">
                                                {/* Ikon Kucing/Hewan */}
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M12 4.5c-4.5 0-7.5 3-7.5 7.5 0 4.2 3.3 7.5 7.5 7.5s7.5-3.3 7.5-7.5c0-4.5-3-7.5-7.5-7.5z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M9 10h.01M15 10h.01M9.5 14.5c1.5 1 3.5 1 5 0"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-[#1E3A4C] group-hover:text-[#2C5E7A] transition">
                                                    Pilih atau isi biodata hewan peliharaan
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    Klik di sini untuk mengisi nama, jenis, umur, dan berat hewan
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-[#2C5E7A] px-3 py-1.5 rounded-lg bg-white/80 group-hover:bg-white transition shrink-0">
                                            + Isi biodata
                                        </span>
                                    </button>
                                )}

                                {/* Tampilan Field Setelah Biodata Disubmit (Persis Gambar Referensi) */}
                                {petData && !isPetFormOpen && (
                                    <div
                                        onClick={handleOpenPetForm}
                                        className="w-full bg-[#EBF2F7] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#e3edf5] transition"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#2C5E7A] shadow-2xs shrink-0">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M5 11V5l4 3h6l4-3v6c0 4.5-3.1 8-7 8s-7-3.5-7-8z"
                                                    />
                                                    <circle cx="9.5" cy="11.5" r="0.8" fill="currentColor" />
                                                    <circle cx="14.5" cy="11.5" r="0.8" fill="currentColor" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M10.5 14.5c.8.6 2.2.6 3 0" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-[#1E3A4C] truncate">
                                                    {petData.name}
                                                </div>
                                                <div className="text-xs text-slate-500 truncate mt-0.5">
                                                    {petData.type} · {petData.age} · {petData.weight}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenPetForm();
                                            }}
                                            className="text-xs md:text-sm font-bold text-[#2C5E7A] hover:underline px-2 py-1 cursor-pointer shrink-0"
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                )}

                                {/* Form Pop-down Pengisian Biodata Hewan */}
                                {isPetFormOpen && (
                                    <form
                                        onSubmit={handleSavePetData}
                                        className="bg-[#F4F8FB] border border-[#2C5E7A]/30 rounded-2xl p-5 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-[#1E3A4C]">
                                                Biodata Hewan Peliharaan
                                            </h3>
                                            {petData && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsPetFormOpen(false)}
                                                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                                                >
                                                    Batal
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#1E3A4C] mb-1.5">
                                                    Nama Hewan
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Milo"
                                                    value={petForm.name}
                                                    onChange={(e) =>
                                                        setPetForm((prev) => ({ ...prev, name: e.target.value }))
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#1E3A4C] mb-1.5">
                                                    Jenis Hewan
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Kucing domestik"
                                                    value={petForm.type}
                                                    onChange={(e) =>
                                                        setPetForm((prev) => ({ ...prev, type: e.target.value }))
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#1E3A4C] mb-1.5">
                                                    Umur Hewan
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: 2 tahun"
                                                    value={petForm.age}
                                                    onChange={(e) =>
                                                        setPetForm((prev) => ({ ...prev, age: e.target.value }))
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#1E3A4C] mb-1.5">
                                                    Berat Hewan
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: 4 kg"
                                                    value={petForm.weight}
                                                    onChange={(e) =>
                                                        setPetForm((prev) => ({ ...prev, weight: e.target.value }))
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                                />
                                            </div>
                                        </div>

                                        {petFormError && (
                                            <p className="text-xs text-rose-600 font-medium mb-3">
                                                {petFormError}
                                            </p>
                                        )}

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-[#2C5E7A] hover:bg-[#234d64] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-2xs"
                                            >
                                                Simpan biodata hewan
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Baris Tanggal Kunjungan & Pilih Dokter */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Tanggal Kunjungan */}
                                <div>
                                    <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                        Tanggal kunjungan
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedDateObj.label}
                                            onChange={(e) => {
                                                const found = DATE_OPTIONS.find((d) => d.label === e.target.value);
                                                if (found) setSelectedDateObj(found);
                                                invalidateConfirmation();
                                            }}
                                            className="w-full appearance-none bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 pr-10 text-xs md:text-sm font-medium text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A] cursor-pointer"
                                        >
                                            {DATE_OPTIONS.map((d) => (
                                                <option key={d.label} value={d.label}>
                                                    {d.label}
                                                </option>
                                            ))}
                                        </select>
                                        <svg
                                            className="w-4 h-4 text-[#2C5E7A] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" strokeWidth="1.8" />
                                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" />
                                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" />
                                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Dokter */}
                                <div>
                                    <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                        Dokter
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedDoctor}
                                            onChange={(e) => {
                                                setSelectedDoctor(e.target.value);
                                                invalidateConfirmation();
                                            }}
                                            className="w-full appearance-none bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 pr-10 text-xs md:text-sm font-medium text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A] cursor-pointer"
                                        >
                                            {doctorsList.map((doc) => (
                                                <option key={doc} value={doc}>
                                                    {doc}
                                                </option>
                                            ))}
                                        </select>
                                        <svg
                                            className="w-4 h-4 text-[#2C5E7A] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Jam Tersedia · WITA */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-[#1E3A4C] mb-2.5">
                                    Jam tersedia · WITA
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                                    {TIME_SLOTS.map((slot) => {
                                        const isActive = selectedTime === slot;
                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedTime(slot);
                                                    invalidateConfirmation();
                                                }}
                                                className={`py-3 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${isActive
                                                        ? 'bg-[#2C5E7A] text-white shadow-xs'
                                                        : 'bg-[#EBF2F7] text-[#1E3A4C] hover:bg-[#dce7f0]'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Skenario 4: Textarea "Apa keluhan Milo?" */}
                            <div>
                                <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                    {petData?.name ? `Apa keluhan ${petData.name}?` : 'Apa keluhan hewanmu?'}
                                </label>
                                <textarea
                                    rows={3}
                                    value={complaint}
                                    onChange={(e) => {
                                        setComplaint(e.target.value);
                                        invalidateConfirmation();
                                    }}
                                    placeholder={
                                        petData?.name
                                            ? `Contoh: ${petData.name} kurang nafsu makan sejak kemarin.`
                                            : 'Tuliskan gejala atau keluhan yang dialami hewan peliharaanmu...'
                                    }
                                    className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition resize-none leading-relaxed"
                                />
                            </div>

                            {formValidationMsg && (
                                <p className="text-xs font-semibold text-rose-600 mt-3">
                                    {formValidationMsg}
                                </p>
                            )}
                        </div>

                        {/* Baris Bawah Card Kiri: Teks Info & Tombol Konfirmasi / Lanjut ke Pembayaran */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">
                            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                                Untuk kunjungan rumah, dokter memeriksa dan merawat hewan di rumahmu.
                            </p>

                            {/* Skenario 5: Tombol Konfirmasi Terlebih Dahulu -> Loading Spinner -> Lanjut ke Pembayaran */}
                            <button
                                type="button"
                                disabled={isConfirming}
                                onClick={handlePrimaryAction}
                                className="bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-75 text-white font-bold py-3.5 px-7 rounded-2xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer shrink-0 min-w-[235px]"
                            >
                                {isConfirming ? (
                                    <>
                                        <svg
                                            className="w-4 h-4 animate-spin text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        <span>Mengonfirmasi...</span>
                                    </>
                                ) : isConfirmed ? (
                                    <>
                                        <span>Lanjut ke pembayaran</span>
                                        <span>→</span>
                                    </>
                                ) : (
                                    <span>Konfirmasi terlebih dahulu</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ================= KOLOM KANAN: MUNCUL SETELAH DIKONFIRMASI (Skenario 2 & 5) ================= */}
                    {isConfirmed && (
                        <aside className="min-w-0 space-y-4 transition-all duration-500 animate-[fadeIn_0.35s_ease-out]">
                            <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                                {/* Badge Mitra PawSphere */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C5E7A] mb-2">
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
                                        <span className="font-bold text-[#1E3A4C]">Konsultasi</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Metode</span>
                                        <span className="font-bold text-[#1E3A4C]">
                                            {location.state?.careMethod === 'rumah'
                                                ? 'Dokter ke rumah'
                                                : 'Datang ke klinik'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Jadwal</span>
                                        <span className="font-bold text-[#1E3A4C]">
                                            {selectedDateObj.short} · {selectedTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Hewan</span>
                                        <span className="font-bold text-[#1E3A4C]">
                                            {petData?.name} · {shortPetSpecies}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400">
                                    Semua waktu dalam WITA.
                                </p>
                            </div>

                            {/* Kotak Info Nomor Antrean di Bawah Card Kanan */}
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
                    )}
                </div>
            </div>
        </div>
    );
}