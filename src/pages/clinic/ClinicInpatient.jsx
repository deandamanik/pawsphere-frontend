import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CLINICS_DATA } from '../../data/clinicsData';

const MONTHS_ID = [
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

const getLocalISODate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const addDaysToISODate = (isoDate, days) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return getLocalISODate(date);
};

const formatStayDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    const monthName = MONTHS_ID[month - 1];
    return {
        iso: isoDate,
        label: `${day} ${monthName} ${year}`,
        short: `${day} ${monthName.slice(0, 3)} ${year}`,
    };
};
const SERVICE_FEE = 5000;
const PET_FIELD_LABELS = [
    ['name', 'nama hewan'],
    ['type', 'jenis hewan'],
    ['age', 'umur'],
    ['weight', 'berat'],
];

const getMissingPetFields = (pet) =>
    PET_FIELD_LABELS
        .filter(([field]) => !pet[field].trim())
        .map(([, label]) => label);

export default function ClinicInpatient() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const clinic =
        location.state?.clinic ||
        CLINICS_DATA.find((c) => c.id === id) ||
        CLINICS_DATA[0];

    // 1. State Jenis Layanan Menginap ('rawat_inap' | 'penitipan')
    const [stayType, setStayType] = useState(
        location.state?.stayType || 'rawat_inap'
    );

    // 2. State Biodata Hewan
    const [petData, setPetData] = useState({
        name: '',
        type: '',
        age: '',
        weight: '',
    });
    const [isPetFormOpen, setIsPetFormOpen] = useState(true);
    const [petForm, setPetForm] = useState(petData);
    const [petFormError, setPetFormError] = useState('');

    // 3. State Tanggal Masuk & Tanggal Keluar
    const [checkInDate, setCheckInDate] = useState(() => {
        const today = getLocalISODate();
        return formatStayDate(today);
    });
    const [checkOutDate, setCheckOutDate] = useState(() => {
        const today = getLocalISODate();
        return formatStayDate(addDaysToISODate(today, 2));
    });

    // 4. State Metode Kedatangan ('antar' | 'jemput')
    const [arrivalMethod, setArrivalMethod] = useState('antar');

    // 5. State Textarea Kebutuhan Singkat
    const [notes, setNotes] = useState('');

    // Hitung durasi malam otomatis (minimal 1 malam)
    const totalNights = Math.max(
        1,
        Math.round(
            (Date.parse(`${checkOutDate.iso}T00:00:00Z`) -
                Date.parse(`${checkInDate.iso}T00:00:00Z`)) /
                86400000
        )
    );
    const nightlyRate = stayType === 'rawat_inap' ? 250000 : 150000;
    const availableSlots = stayType === 'rawat_inap' ? 3 : 5;
    const accommodationPrice = totalNights * nightlyRate;
    const estimatedTotal = accommodationPrice + SERVICE_FEE;

    const formatRupiah = (num) => 'Rp' + num.toLocaleString('id-ID');

    // Handler Simpan Biodata Hewan saat klik "Ganti"
    const handleSavePet = (e) => {
        e.preventDefault();
        const missingFields = getMissingPetFields(petForm);

        if (missingFields.length > 0) {
            setPetFormError(`Semua data hewan wajib diisi. Lengkapi: ${missingFields.join(', ')}.`);
            return;
        }

        setPetFormError('');
        setPetData({
            name: petForm.name.trim(),
            type: petForm.type.trim(),
            age: petForm.age.trim(),
            weight: petForm.weight.trim(),
        });
        setIsPetFormOpen(false);
    };

    const updatePetField = (field, value) => {
        const updatedPetForm = { ...petForm, [field]: value };
        setPetForm(updatedPetForm);
        if (petFormError) {
            const missingFields = getMissingPetFields(updatedPetForm);
            setPetFormError(
                missingFields.length
                    ? `Semua data hewan wajib diisi. Lengkapi: ${missingFields.join(', ')}.`
                    : ''
            );
        }
    };

    // Handler Tombol Oranye "Cek ringkasan & biaya →"
    const handleProceedSummary = () => {
        if (isPetFormOpen) {
            const missingFields = getMissingPetFields(petForm);
            setPetFormError(
                missingFields.length
                    ? `Semua data hewan wajib diisi. Lengkapi: ${missingFields.join(', ')}.`
                    : 'Simpan biodata hewan terlebih dahulu sebelum melanjutkan.'
            );
            return;
        }

        const missingFields = getMissingPetFields(petData);
        if (missingFields.length > 0) {
            setPetForm(petData);
            setIsPetFormOpen(true);
            setPetFormError(`Semua data hewan wajib diisi. Lengkapi: ${missingFields.join(', ')}.`);
            return;
        }

        if (arrivalMethod === 'rumah') {
            navigate(`/clinic/${clinic.id}/pembayaran`, {
                state: {
                    clinic,
                    careMethod: 'rumah',
                    petData,
                    userLocation: location.state?.userLocation,
                    service: 'Konsultasi',
                    method: 'Dokter ke rumah',
                    complaint: notes,
                    notes,
                },
            });
            return;
        }

        navigate(`/clinic/${clinic.id}/pembayaran`, {
            state: {
                clinic,
                petData,
                userLocation: location.state?.userLocation,
                stayType,
                checkInDate,
                checkOutDate,
                totalNights,
                nightlyRate,
                transportMethod: arrivalMethod,
                notes,
                service: stayType === 'rawat_inap' ? 'Rawat inap' : 'Penitipan',
                method: 'Antar ke klinik',
                date: {
                    label: `${checkInDate.short}–${checkOutDate.label}`,
                    short: `${checkInDate.short}–${checkOutDate.short}`,
                },
                time: 'Check-in',
                basePriceNum: accommodationPrice,
                travelFeeNum: 0,
                serviceFeeNum: SERVICE_FEE,
                totalPriceNum: estimatedTotal,
            },
        });
    };

    return (
        <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] flex flex-col justify-between font-sans">
            {/* Konten Utama */}
            <div className="max-w-6xl w-full mx-auto py-8 md:py-10 px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* Heading Halaman */}
                    <div className="order-1 lg:order-1 lg:col-span-7 lg:col-start-1">
                        <h1 className="font-display text-2xl md:text-[32px] font-extrabold text-[#1E3A4C] leading-tight mb-1.5">
                            Tempat nyaman untuk {petData.name || 'hewanmu'}
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 ">
                            Cek tanggal dan kapasitas di klinik pilihanmu.
                        </p>
                    </div>

                    {/* ================= KOLOM KIRI: FORM RAWAT INAP & PENITIPAN ================= */}
                    <div className="order-3 lg:order-2 lg:col-span-7 lg:col-start-1 lg:row-start-2">
                        {/* Card Form Utama */}
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            {/* 1. Radio Option: Rawat inap vs Penitipan */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                                {/* Opsi Rawat Inap */}
                                <button
                                    type="button"
                                    onClick={() => setStayType('rawat_inap')}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${stayType === 'rawat_inap'
                                            ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                                            : 'bg-white border-slate-200/90 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
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
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                                Rawat inap
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                Perawatan medis di klinik
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${stayType === 'rawat_inap'
                                                ? 'border-[#2C5E7A] border-[5px] bg-white'
                                                : 'border-slate-300 bg-white'
                                            }`}
                                    />
                                </button>

                                {/* Opsi Penitipan */}
                                <button
                                    type="button"
                                    onClick={() => setStayType('penitipan')}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${stayType === 'penitipan'
                                            ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                                            : 'bg-white border-slate-200/90 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
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
                                                    d="M3 7v11m0-4h18m0 4V8a2 2 0 00-2-2H5a2 2 0 00-2 2"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                                Penitipan
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                Menginap nonmedis
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${stayType === 'penitipan'
                                                ? 'border-[#2C5E7A] border-[5px] bg-white'
                                                : 'border-slate-300 bg-white'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* 2. Field Biodata Hewan */}
                            <div className="mb-5">
                                {!isPetFormOpen && petData.name ? (
                                    <div
                                        onClick={() => {
                                            setPetForm(petData);
                                            setIsPetFormOpen(true);
                                        }}
                                        className="w-full bg-[#EBF2F7] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#e2ecf4] transition"
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
                                                    <circle cx="9.5" cy="11.5" r="0.8" fill="currentColor" />
                                                    <circle cx="14.5" cy="11.5" r="0.8" fill="currentColor" />
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
                                                    {[petData.type, petData.age, petData.weight]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPetForm(petData);
                                                setIsPetFormOpen(true);
                                            }}
                                            className="text-xs md:text-sm font-bold text-[#2C5E7A] hover:underline px-2 py-1 cursor-pointer shrink-0"
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSavePet}
                                        noValidate
                                        className="bg-[#F4F8FB] border border-[#2C5E7A]/30 rounded-2xl p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#1E3A4C]">
                                                Ubah Biodata Hewan
                                            </span>
                                            {petData.name && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsPetFormOpen(false)}
                                                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                                                >
                                                    Batal
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={petForm.name}
                                                onChange={(e) => updatePetField('name', e.target.value)}
                                                placeholder="Nama hewan"
                                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                            />
                                            <input
                                                type="text"
                                                name="type"
                                                required
                                                value={petForm.type}
                                                onChange={(e) => updatePetField('type', e.target.value)}
                                                placeholder="Jenis hewan"
                                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                            />
                                            <input
                                                type="text"
                                                name="age"
                                                required
                                                value={petForm.age}
                                                onChange={(e) => updatePetField('age', e.target.value)}
                                                placeholder="Umur"
                                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                            />
                                            <input
                                                type="text"
                                                name="weight"
                                                required
                                                value={petForm.weight}
                                                onChange={(e) => updatePetField('weight', e.target.value)}
                                                placeholder="Berat"
                                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                                            />
                                        </div>
                                        {petFormError && (
                                            <p role="alert" className="text-xs font-medium text-rose-600">
                                                {petFormError}
                                            </p>
                                        )}
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-[#2C5E7A] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* 3. Baris Tanggal Masuk & Tanggal Keluar */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3.5">
                                {/* Tanggal Masuk */}
                                <div>
                                    <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                        Tanggal masuk
                                    </label>
                                    <div>
                                        <input
                                            type="date"
                                            value={checkInDate.iso}
                                            min={getLocalISODate()}
                                            onChange={(e) => {
                                                if (!e.target.value) return;
                                                const nextCheckInDate = formatStayDate(e.target.value);
                                                setCheckInDate(nextCheckInDate);
                                                if (e.target.value >= checkOutDate.iso) {
                                                    setCheckOutDate(
                                                        formatStayDate(
                                                            addDaysToISODate(e.target.value, 1)
                                                        )
                                                    );
                                                }
                                            }}
                                            className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 text-xs md:text-sm font-medium text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A] cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Tanggal Keluar */}
                                <div>
                                    <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                        Tanggal keluar
                                    </label>
                                    <div>
                                        <input
                                            type="date"
                                            value={checkOutDate.iso}
                                            min={addDaysToISODate(checkInDate.iso, 1)}
                                            onChange={(e) => {
                                                if (
                                                    e.target.value &&
                                                    e.target.value > checkInDate.iso
                                                ) {
                                                    setCheckOutDate(
                                                        formatStayDate(e.target.value)
                                                    );
                                                }
                                            }}
                                            className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 text-xs md:text-sm font-medium text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A] cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Baris Badge Kapasitas Tersedia & Harga per Malam */}
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <span className="bg-[#EBF2F7] text-[#1E3A4C] text-xs font-bold px-3.5 py-1.5 rounded-full">
                                    {availableSlots} tempat tersedia
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {totalNights} malam · {formatRupiah(nightlyRate)} / malam
                                </span>
                            </div>

                            {/* 5. Pilih layanan: antar ke klinik atau kunjungan dokter ke rumah */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                                {/* Opsi Antar ke klinik */}
                                <button
                                    type="button"
                                    onClick={() => setArrivalMethod('antar')}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${arrivalMethod === 'antar'
                                            ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                                            : 'bg-white border-slate-200/90 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
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
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                                Antar ke klinik
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                Datang bersama {petData.name || 'hewanmu'}
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${arrivalMethod === 'antar'
                                                ? 'border-[#2C5E7A] border-[5px] bg-white'
                                                : 'border-slate-300 bg-white'
                                            }`}
                                    />
                                </button>

                                {/* Opsi Dokter ke rumah */}
                                <button
                                    type="button"
                                    onClick={() => setArrivalMethod('rumah')}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${arrivalMethod === 'rumah'
                                            ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                                            : 'bg-white border-slate-200/90 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
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
                                                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.8"
                                                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                                                Dokter ke rumah
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                Dokter datang ke alamatmu
                                            </div>
                                            <div className="text-xs font-semibold text-[#2C5E7A] mt-1">
                                                Layanan kunjungan rumah
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${arrivalMethod === 'rumah'
                                                ? 'border-[#2C5E7A] border-[5px] bg-white'
                                                : 'border-slate-300 bg-white'
                                            }`}
                                    />
                                </button>
                            </div>

                            {arrivalMethod === 'antar' ? (
                                <div className="bg-[#F4F8FB] rounded-2xl p-4 mb-5 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-500">
                                        <span>
                                            {stayType === 'rawat_inap' ? 'Rawat inap' : 'Penitipan'} · {totalNights} malam
                                        </span>
                                        <span>{formatRupiah(accommodationPrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-500">
                                        <span>Biaya layanan PawSphere</span>
                                        <span>{formatRupiah(SERVICE_FEE)}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-bold text-[#1E3A4C]">
                                        <span>Estimasi total</span>
                                        <span>{formatRupiah(estimatedTotal)}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="bg-[#F4F8FB] rounded-2xl p-4 mb-5 text-xs text-slate-600">
                                    Kamu akan melanjutkan ke jadwal kunjungan dokter ke rumah.
                                    Rincian biaya layanan rumah tersedia di halaman ringkasan.
                                </p>
                            )}

                            {/* 6. Textarea Kebutuhan Singkat */}
                            <div>
                                <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                    Kebutuhan singkat (Opsional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={`Tuliskan kebutuhan khusus untuk ${petData.name || 'hewanmu'}...`}
                                    className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition resize-none leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* Baris Action Bawah Kiri: Keterangan Penjemputan & Tombol Oranye */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">
                            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                                {arrivalMethod === 'rumah'
                                    ? 'Pilih jadwal kunjungan dokter ke rumah untuk melanjutkan.'
                                    : 'Datang ke klinik bersama hewanmu pada tanggal yang dipilih.'}
                            </p>

                            <button
                                type="button"
                                onClick={handleProceedSummary}
                                className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-7 rounded-2xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition shadow-sm cursor-pointer shrink-0 min-w-[235px]"
                            >
                                <span>
                                    {arrivalMethod === 'rumah'
                                        ? 'Lanjut atur kunjungan rumah'
                                        : 'Cek ringkasan & biaya'}
                                </span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                    {/* ================= KOLOM KANAN: KARTU KAPASITAS KLINIK ================= */}
                    <aside className="order-2 lg:order-3 lg:col-span-5 lg:col-start-8 lg:row-start-2">
                        {/* Kartu Kapasitas Mitra PawSphere */}
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
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

                            <h2 className="font-display text-xl font-extrabold text-[#1E3A4C] mb-1">
                                {clinic.name}
                            </h2>
                            <p className="text-xs text-slate-500 pb-5 mb-5 border-b border-slate-100">
                                {clinic.area} · {clinic.distance}
                            </p>

                            <h3 className="text-xs font-extrabold text-[#1E3A4C] mb-3.5">
                                Kapasitas {checkInDate.short}–{checkOutDate.label}
                            </h3>

                            <div className="space-y-3 text-xs md:text-sm mb-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Rawat inap</span>
                                    <span className="font-bold text-[#1E3A4C]">
                                        3 dari 8 tempat
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Penitipan</span>
                                    <span className="font-bold text-[#1E3A4C]">
                                        5 dari 12 tempat
                                    </span>
                                </div>
                            </div>

                            {/* Kotak Peringatan Krem (Indikasi Medis Rawat Inap) */}
                            <div className="bg-[#FDF1E6] rounded-2xl p-4 flex items-start gap-3 mb-4">
                                <svg
                                    className="w-4 h-4 text-[#2C5E7A] shrink-0 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 16v-4m0-4h.01"
                                    />
                                </svg>
                                <p className="text-xs text-[#1E3A4C] leading-relaxed font-medium">
                                    Rawat inap berlangsung di klinik. Dokter menilai kondisi{' '}
                                    {petData.name || 'hewanmu'} sebelum menentukan admisi medis akhir.
                                </p>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Jika tidak memenuhi indikasi rawat inap, klinik menjelaskan
                                penyesuaian layanan dan pengembalian biaya yang tidak terpakai.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer Tipis Bawah Sesuai Gambar Referensi */}
            <footer className="bg-white border-t border-slate-200/70 py-4 px-6 lg:px-10 mt-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>PawSphere Clinic · Mitra perawatan hewan di Bali</span>
                    <span>Data contoh · Bukan lokasi, antrean, atau pembayaran langsung.</span>
                </div>
            </footer>
        </div>
    );
}