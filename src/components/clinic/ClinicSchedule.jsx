import React, { useState, useMemo, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CLINICS_DATA } from '../../data/clinicsData';
import Mascot from '../../components/ui/Mascot';

const TIME_SLOTS = ['09.00', '09.30', '10.00', '10.30', '11.00'];

const DAYS_ID = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
];

const MONTHS_FULL_ID = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const MONTHS_SHORT_ID = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
];

// Helper mendapatkan string YYYY-MM-DD sesuai tanggal hari ini di perangkat lokal
function getTodayISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper mengubah YYYY-MM-DD menjadi label lengkap ("Senin, 2 November 2026") & singkat ("2 Nov 2026")
function formatIndonesianDate(isoDateStr) {
    if (!isoDateStr) {
        return { label: '-', short: '-' };
    }
    const [y, m, d] = isoDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayName = DAYS_ID[dateObj.getDay()];
    const monthFull = MONTHS_FULL_ID[m - 1];
    const monthShort = MONTHS_SHORT_ID[m - 1];

    return {
        iso: isoDateStr,
        label: `${dayName}, ${d} ${monthFull} ${y}`,
        short: `${d} ${monthShort} ${y}`,
    };
}

export default function ClinicSchedule() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dateInputRef = useRef(null);

    const clinic = CLINICS_DATA.find((c) => c.id === id) || CLINICS_DATA[0];

    // Deteksi apakah user memilih radio button "Dokter ke rumah"
    const isHomeCare = location.state?.careMethod === 'rumah';

    const doctorsList = [
        clinic.doctor?.name || 'drh. Putu Ayu Pratiwi',
        'drh. I Made Wirawan',
        'drh. Ni Luh Gede Saraswati',
    ];

    // State Biodata Hewan
    const [petData, setPetData] = useState(null);
    const [isPetFormOpen, setIsPetFormOpen] = useState(false);
    const [petForm, setPetForm] = useState({
        name: '',
        type: '',
        age: '',
        weight: '',
    });
    const [petFormError, setPetFormError] = useState('');

    // State Tanggal Kunjungan (Otomatis default tanggal hari ini)
    const [selectedIsoDate, setSelectedIsoDate] = useState(() => getTodayISO());
    const selectedDateObj = useMemo(
        () => formatIndonesianDate(selectedIsoDate),
        [selectedIsoDate]
    );

    // State Dokter, Jam, & Keluhan
    const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0]);
    const [selectedTime, setSelectedTime] = useState('10.00');
    const [complaint, setComplaint] = useState('');
    const [formValidationMsg, setFormValidationMsg] = useState('');

    // State Pop-up Modal Periksa Data Booking & Status Konfirmasi
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const invalidateConfirmation = () => {
        if (isConfirmed) setIsConfirmed(false);
        if (formValidationMsg) setFormValidationMsg('');
    };

    const handleOpenPetForm = () => {
        if (petData) {
            setPetForm(petData);
        }
        setPetFormError('');
        setIsPetFormOpen(true);
    };

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

    // Klik tombol utama di bawah form
    const handlePrimaryAction = () => {
        if (!isConfirmed) {
            if (!petData) {
                setFormValidationMsg(
                    'Silakan klik dan isi biodata hewan peliharaan terlebih dahulu.'
                );
                setIsPetFormOpen(true);
                return;
            }
            if (!complaint.trim()) {
                setFormValidationMsg(
                    `Silakan tuliskan keluhan ${petData.name} terlebih dahulu.`
                );
                return;
            }

            setFormValidationMsg('');
            // Munculkan Pop-up "Apakah data booking sudah benar?"
            setIsReviewModalOpen(true);
            return;
        }

        // Jika sudah dikonfirmasi lewat pop-up, arahkan ke halaman Pembayaran
        navigate(`/clinic/${clinic.id}/pembayaran`, {
            state: {
                clinic,
                petData,
                date: selectedDateObj,
                doctor: selectedDoctor,
                time: selectedTime,
                complaint,
                userLocation: location.state?.userLocation,
                careMethod: isHomeCare ? 'rumah' : 'klinik',
                service: 'Konsultasi',
                method: isHomeCare ? 'Dokter ke rumah' : 'Datang ke klinik',
            },
        });
    };

    const handleConfirmBookingModal = () => {
        setIsReviewModalOpen(false);

        if (!isHomeCare) {
            // Skenario 1: Datang ke klinik -> Langsung ke halaman Nomor Antrean (A-012)
            navigate(`/clinic/${clinic.id}/berhasil`, {
                state: {
                    clinic,
                    petData,
                    date: selectedDateObj,
                    doctor: selectedDoctor,
                    time: selectedTime,
                    complaint,
                    userLocation: location.state?.userLocation,
                    careMethod: 'klinik',
                    service: 'Konsultasi',
                    method: 'Datang ke klinik',
                    queueNumber: 'A-012',
                    bookingCode: 'PS-C-261102-012',
                },
            });
            return;
        }

        // Skenario 2: Dokter ke rumah -> Langsung ke halaman Biaya Kunjungan Rumah (Rp15.000)
        navigate(`/clinic/${clinic.id}/pembayaran`, {
            state: {
                clinic,
                petData,
                date: selectedDateObj,
                doctor: selectedDoctor,
                time: selectedTime,
                complaint,
                userLocation: location.state?.userLocation,
                careMethod: 'rumah',
                service: 'Konsultasi',
                method: 'Dokter ke rumah',
            },
        });
    };

    const shortPetSpecies = petData?.type ? petData.type.split(' ')[0] : 'Kucing';

    return (
        <div className="relative bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-14 px-6 lg:px-10 font-sans">
            <div className="mx-auto max-w-3xl">
                <div className="grid grid-cols-1 gap-7 items-start">
                    <div className="w-full">
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            {/* Header Card */}
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <h1 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C]">
                                    {isHomeCare
                                        ? 'Konsultasi dokter ke rumah'
                                        : 'Konsultasi dokter hewan'}
                                </h1>
                            </div>

                            {/* 1. Field Biodata Hewan */}
                            <div className="mb-6">
                                {!petData && !isPetFormOpen && (
                                    <button
                                        type="button"
                                        onClick={handleOpenPetForm}
                                        className="w-full bg-[#EBF2F7] hover:bg-[#e1ebf3] border border-dashed border-[#2C5E7A]/40 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer group text-left"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#2C5E7A] shadow-2xs shrink-0">
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M5 11V5l4 3h6l4-3v6c0 4.5-3.1 8-7 8s-7-3.5-7-8z"
                                                    />
                                                    <circle
                                                        cx="9.5"
                                                        cy="11.5"
                                                        r="0.8"
                                                        fill="currentColor"
                                                    />
                                                    <circle
                                                        cx="14.5"
                                                        cy="11.5"
                                                        r="0.8"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.6"
                                                        d="M10.5 14.5c.8.6 2.2.6 3 0"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-[#1E3A4C] group-hover:text-[#2C5E7A] transition">
                                                    Pilih atau isi biodata hewan peliharaan
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    Klik di sini untuk mengisi nama, jenis, umur, dan
                                                    berat hewan
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-[#2C5E7A] px-3 py-1.5 rounded-lg bg-white/80 group-hover:bg-white transition shrink-0">
                                            + Isi biodata
                                        </span>
                                    </button>
                                )}

                                {petData && !isPetFormOpen && (
                                    <div
                                        onClick={handleOpenPetForm}
                                        className="w-full bg-[#EBF2F7] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#e3edf5] transition"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#2C5E7A] shadow-2xs shrink-0">
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M5 11V5l4 3h6l4-3v6c0 4.5-3.1 8-7 8s-7-3.5-7-8z"
                                                    />
                                                    <circle
                                                        cx="9.5"
                                                        cy="11.5"
                                                        r="0.8"
                                                        fill="currentColor"
                                                    />
                                                    <circle
                                                        cx="14.5"
                                                        cy="11.5"
                                                        r="0.8"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.6"
                                                        d="M10.5 14.5c.8.6 2.2.6 3 0"
                                                    />
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
                                                        setPetForm((prev) => ({
                                                            ...prev,
                                                            name: e.target.value,
                                                        }))
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
                                                        setPetForm((prev) => ({
                                                            ...prev,
                                                            type: e.target.value,
                                                        }))
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
                                                        setPetForm((prev) => ({
                                                            ...prev,
                                                            age: e.target.value,
                                                        }))
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
                                                        setPetForm((prev) => ({
                                                            ...prev,
                                                            weight: e.target.value,
                                                        }))
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

                            {/* 2. Tanggal Kunjungan (Kalender Otomatis Hari Ini) & Pilihan Dokter */}
                            <div
                                className={`grid grid-cols-1 ${!isHomeCare ? 'md:grid-cols-2' : ''
                                    } gap-4 mb-6`}
                            >
                                {!isHomeCare && (
                                    <div>
                                        <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                            Tanggal kunjungan
                                        </label>
                                        <div
                                            onClick={() => {
                                                if (dateInputRef.current?.showPicker) {
                                                    dateInputRef.current.showPicker();
                                                } else {
                                                    dateInputRef.current?.focus();
                                                }
                                            }}
                                            className="relative w-full bg-white border border-slate-200/90 hover:border-[#2C5E7A]/60 rounded-2xl px-4 py-3.5 pr-10 text-xs md:text-sm font-medium text-[#1E3A4C] focus-within:border-[#2C5E7A] cursor-pointer transition"
                                        >
                                            {/* Label Format Hari & Tanggal Indonesia ("Rabu, 11 November 2026") */}
                                            <span className="block truncate select-none">
                                                {selectedDateObj.label}
                                            </span>

                                            {/* Input Date Kalender Asli */}
                                            <input
                                                ref={dateInputRef}
                                                type="date"
                                                min={getTodayISO()}
                                                value={selectedIsoDate}
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        setSelectedIsoDate(e.target.value);
                                                        invalidateConfirmation();
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />

                                            <svg
                                                className="w-4 h-4 text-[#2C5E7A] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <rect
                                                    width="18"
                                                    height="18"
                                                    x="3"
                                                    y="4"
                                                    rx="2"
                                                    ry="2"
                                                    strokeWidth="1.8"
                                                />
                                                <line
                                                    x1="16"
                                                    y1="2"
                                                    x2="16"
                                                    y2="6"
                                                    strokeWidth="1.8"
                                                />
                                                <line
                                                    x1="8"
                                                    y1="2"
                                                    x2="8"
                                                    y2="6"
                                                    strokeWidth="1.8"
                                                />
                                                <line
                                                    x1="3"
                                                    y1="10"
                                                    x2="21"
                                                    y2="10"
                                                    strokeWidth="1.8"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}

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

                            {/* 3. Jam Tersedia · WITA (Khusus Datang ke Klinik) */}
                            {!isHomeCare && (
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
                            )}

                            {/* 4. Textarea Keluhan */}
                            <div>
                                <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                    {petData?.name
                                        ? `Apa keluhan ${petData.name}?`
                                        : 'Apa keluhan hewanmu?'}
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

                        {/* Baris Bawah Card Kiri */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">
                            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                                Untuk kunjungan rumah, dokter memeriksa dan merawat hewan di
                                rumahmu.
                            </p>

                            <button
                                type="button"
                                onClick={handlePrimaryAction}
                                className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-7 rounded-2xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer shrink-0 min-w-[235px]"
                            >
                                {isConfirmed ? (
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

                </div>
            </div>

            {/* ================= POP-UP MODAL: APAKAH DATA BOOKING SUDAH BENAR? ================= */}
            {isReviewModalOpen && (
                <div
                    onClick={() => setIsReviewModalOpen(false)}
                    className="fixed inset-0 z-50 bg-[#1E3A4C]/35 backdrop-blur-[2px] flex items-center justify-center p-4 transition-opacity duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[520px] bg-white rounded-[28px] p-6 md:p-8 shadow-[0_20px_50px_rgba(24,59,86,0.18)] border border-slate-100 animate-[fadeIn_0.2s_ease-out]"
                    >
                        {/* Maskot Konfirmasi */}
                        <div className="flex justify-center -mt-1 mb-1">
                            <Mascot state="confirm" size={92} />
                        </div>

                        {/* Header Pop-up & Tombol Close Bulat */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h2 className="font-display text-xl md:text-[22px] font-extrabold text-[#1E3A4C] leading-snug">
                                Apakah data booking sudah benar?
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsReviewModalOpen(false)}
                                aria-label="Tutup pop-up"
                                className="w-8 h-8 rounded-full bg-[#EBF2F7] hover:bg-[#dce7f0] text-[#1E3A4C] flex items-center justify-center transition cursor-pointer shrink-0"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <p className="text-xs md:text-sm text-slate-500 mb-5">
                            Periksa kembali sebelum mengonfirmasi. Kamu masih bisa mengubah
                            data.
                        </p>

                        {/* Kotak Biru Muda Ringkasan Data Booking */}
                        <div className="bg-[#EBF2F7] rounded-2xl p-5 space-y-3 text-xs md:text-sm mb-5">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-500">Klinik</span>
                                <span className="font-bold text-[#1E3A4C] text-right">
                                    {clinic.name}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-500">Layanan</span>
                                <span className="font-bold text-[#1E3A4C] text-right">
                                    Konsultasi ·{' '}
                                    {isHomeCare ? 'Dokter ke rumah' : 'Datang ke klinik'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-500">Hewan</span>
                                <span className="font-bold text-[#1E3A4C] text-right">
                                    {petData?.name || 'Milo'} · {shortPetSpecies}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-500">Dokter</span>
                                <span className="font-bold text-[#1E3A4C] text-right">
                                    {selectedDoctor}
                                </span>
                            </div>

                            {!isHomeCare && (
                                <>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-slate-500">Tanggal</span>
                                        <span className="font-bold text-[#1E3A4C] text-right">
                                            {selectedDateObj.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-slate-500">Jam</span>
                                        <span className="font-bold text-[#1E3A4C] text-right">
                                            {selectedTime} WITA
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Keluhan Singkat */}
                        <div className="mb-6">
                            <div className="text-xs font-bold text-slate-500 mb-1">
                                Keluhan singkat
                            </div>
                            <p className="text-xs md:text-sm text-[#1E3A4C] leading-relaxed">
                                {complaint}
                            </p>
                        </div>

                        {/* 2 Tombol Aksi: Ubah data & Ya, konfirmasi booking */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <button
                                type="button"
                                onClick={() => setIsReviewModalOpen(false)}
                                className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm transition cursor-pointer"
                            >
                                Ubah data
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmBookingModal}
                                className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm transition shadow-xs cursor-pointer"
                            >
                                Ya, konfirmasi booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}