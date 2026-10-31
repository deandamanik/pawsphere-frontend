// src/pages/clinic/ClinicSuccess.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CLINICS_DATA } from '../../data/clinicsData';

export default function ClinicSuccess() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Ambil data klinik & state dari halaman pembayaran
    const clinic =
        location.state?.clinic ||
        CLINICS_DATA.find((c) => c.id === id) ||
        CLINICS_DATA[0];

    // Cek apakah mode yang dipilih adalah "Dokter ke rumah"
    const isHomeCare =
        location.state?.careMethod === 'rumah' ||
        location.state?.method === 'Dokter ke rumah';

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
    const methodName = isHomeCare ? 'Dokter ke rumah' : 'Datang ke klinik';
    const paymentMethodLabel = location.state?.paymentMethodLabel || 'GoPay';

    // Harga menyesuaikan mode Rumah (Rp240.000) atau Klinik (Rp155.000)
    const basePriceNum =
        location.state?.basePriceNum || (isHomeCare ? 200000 : 150000);
    const travelFeeNum =
        location.state?.travelFeeNum ?? (isHomeCare ? 35000 : 0);
    const serviceFeeNum = location.state?.serviceFeeNum || 5000;
    const totalPriceNum =
        location.state?.totalPriceNum ||
        basePriceNum + travelFeeNum + serviceFeeNum;

    const formatRupiah = (num) => 'Rp' + num.toLocaleString('id-ID');
    const shortPetSpecies = petData?.type ? petData.type.split(' ')[0] : 'Kucing';
    const shortScheduleText = `${dateObj.short.replace(' 2026', '')} · ${selectedTime} WITA`;

    // ================= STATE KHUSUS FORM ALAMAT RUMAH (HOME CARE) =================
    const [homeCoords, setHomeCoords] = useState({
        lat: -8.6815,
        lng: 115.2215,
    });
    const [isPinEditMode, setIsPinEditMode] = useState(false);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [landmark, setLandmark] = useState('');
    const [isSubmittingHome, setIsSubmittingHome] = useState(false);
    const [isHomeSubmitted, setIsHomeSubmitted] = useState(false);

    const miniMapContainerRef = useRef(null);
    const miniMapInstanceRef = useRef(null);
    const homeMarkerRef = useRef(null);
    const isPinEditModeRef = useRef(false);

    useEffect(() => {
        isPinEditModeRef.current = isPinEditMode;
    }, [isPinEditMode]);

    // Inisialisasi Peta Mini untuk halaman Lengkapi Alamat Rumah
    useEffect(() => {
        if (!isHomeCare) return;
        const container = miniMapContainerRef.current;
        if (!container || miniMapInstanceRef.current) return;

        const map = L.map(container, {
            center: [-8.6725, 115.2335],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Render Pin Klinik (Pin klinik terpilih berwarna Oranye #FF6B00, lainnya Biru #2C5E7A)
        CLINICS_DATA.forEach((item) => {
            const isSelectedClinic = item.id === clinic.id;
            const pinIcon = L.divIcon({
                className: 'bg-transparent border-0',
                html: `
          <div style="
            width: 28px;
            height: 28px;
            background-color: ${isSelectedClinic ? '#FF6B00' : '#2C5E7A'};
            color: #ffffff;
            border: 2.5px solid #ffffff;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 12px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.22);
          ">
            ${item.number}
          </div>
        `,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });

            L.marker(item.coordinates, { icon: pinIcon }).addTo(map);
        });

        // Klik pada peta untuk memindahkan pin rumah saat mode "Ubah pin di peta" aktif
        map.on('click', (e) => {
            if (isPinEditModeRef.current) {
                setHomeCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        });

        miniMapInstanceRef.current = map;

        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            map.remove();
            miniMapInstanceRef.current = null;
        };
    }, [isHomeCare, clinic.id]);

    // Render & Update Titik Radar Rumah Pengguna di Peta Mini
    useEffect(() => {
        if (!isHomeCare) return;
        const map = miniMapInstanceRef.current;
        if (!map) return;

        if (homeMarkerRef.current) {
            homeMarkerRef.current.remove();
        }

        const homeIcon = L.divIcon({
            className: 'bg-transparent border-0',
            html: `
        <div style="
          width: 34px;
          height: 34px;
          background-color: rgba(44, 94, 122, 0.18);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background-color: #2C5E7A;
            border: 2.5px solid #ffffff;
            border-radius: 9999px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          "></div>
        </div>
      `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
        });

        homeMarkerRef.current = L.marker([homeCoords.lat, homeCoords.lng], {
            icon: homeIcon,
        }).addTo(map);
    }, [isHomeCare, homeCoords]);

    // Tombol "Gunakan lokasi terkini"
    const handleUseCurrentLocation = () => {
        setIsPinEditMode(false);
        if (!navigator.geolocation) {
            setHomeCoords({ lat: -8.6815, lng: 115.2215 });
            miniMapInstanceRef.current?.flyTo([-8.6815, 115.2215], 13, {
                duration: 0.8,
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const nextCoords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                setHomeCoords(nextCoords);
                miniMapInstanceRef.current?.flyTo([nextCoords.lat, nextCoords.lng], 14, {
                    duration: 0.9,
                });
            },
            () => {
                setHomeCoords({ lat: -8.6815, lng: 115.2215 });
                miniMapInstanceRef.current?.flyTo([-8.6815, 115.2215], 13, {
                    duration: 0.8,
                });
            }
        );
    };

    // Tombol "Kirim alamat & panggil dokter"
    const handleSendHomeAddress = (e) => {
        e.preventDefault();
        if (!address.trim() || !phone.trim()) return;

        setIsSubmittingHome(true);
        setTimeout(() => {
            setIsSubmittingHome(false);
            navigate(`/clinic/${clinic.id}/perjalanan`, {
                state: {
                    clinic,
                    petData,
                    date: dateObj,
                    doctor: location.state?.doctor || clinic.doctor?.name,
                    time: selectedTime,
                    address,
                    landmark,
                    phone,
                    homeCoords,
                    paymentMethodLabel,
                    totalPriceNum,
                },
            });
        }, 600);
    };

    // =================================================================================
    // TAMPILAN 1: SLICING KHUSUS "DOKTER KE RUMAH" (LUNAS & LENGKAPI ALAMAT RUMAH)
    // =================================================================================
    if (isHomeCare) {
        return (
            <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-12 px-6 lg:px-10 font-sans">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                        {/* ================= KOLOM KIRI: RINGKASAN LUNAS KONSULTASI RUMAH ================= */}
                        <aside className="lg:col-span-5 space-y-4">
                            <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                                {/* Badge Hijau Lunas · Rp240.000 */}
                                <span className="inline-block bg-[#E6F2EC] text-[#23533D] text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
                                    Lunas · {formatRupiah(totalPriceNum)}
                                </span>

                                {/* Judul & Subjudul Klinik · Nama Hewan */}
                                <h1 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C] mb-1">
                                    Konsultasi di rumah
                                </h1>
                                <p className="text-xs md:text-sm text-slate-500 pb-5 mb-5 border-b border-slate-100">
                                    {clinic.name} · {petData.name}
                                </p>

                                {/* Rincian Jadwal & Biaya */}
                                <div className="space-y-3.5 text-xs md:text-sm pb-5 mb-5 border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Jadwal</span>
                                        <span className="font-bold text-[#1E3A4C]">
                                            {shortScheduleText}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Konsultasi rumah</span>
                                        <span className="font-bold text-[#1E3A4C]">
                                            {formatRupiah(basePriceNum)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Perjalanan zona ≤5 km</span>
                                        <span className="font-bold text-[#1E3A4C]">
                                            {formatRupiah(travelFeeNum)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Biaya layanan</span>
                                        <span className="font-bold text-[#1E3A4C]">
                                            {formatRupiah(serviceFeeNum)}
                                        </span>
                                    </div>
                                </div>

                                {/* Info Metode Bayar & Kode Transaksi */}
                                <p className="text-xs text-slate-500 mb-1.5">
                                    {paymentMethodLabel} · {dateObj.short}, 09.43 WITA
                                </p>
                                <p className="text-xs font-extrabold text-[#1E3A4C] tracking-wide mb-5">
                                    PS-H-261102-008
                                </p>

                                {/* Tombol Unduh Bukti Bayar */}
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
                            </div>

                            {/* Kotak Info Status Pengiriman Dokter */}
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
                                    {isHomeSubmitted
                                        ? 'Alamat telah diterima! Klinik sedang menugaskan dokter menuju lokasi rumahmu.'
                                        : 'Belum ada dokter yang dikirim. Setelah alamat diterima, klinik memeriksa jangkauan dan menugaskan dokter untuk jadwalmu.'}
                                </p>
                            </div>
                        </aside>

                        {/* ================= KOLOM KANAN: PILIH TITIK RUMAH KAMU & FORM ALAMAT ================= */}
                        <div className="lg:col-span-7">
                            <form onSubmit={handleSendHomeAddress}>
                                <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                                    {/* Header Card Kanan */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                        <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C]">
                                            Pilih Titik Rumah Kamu
                                        </h2>
                                    </div>

                                    {/* Peta Mini Interaktif */}
                                    <div className="relative w-full h-44 md:h-48 rounded-2xl overflow-hidden border border-slate-200/80 mb-3.5 bg-[#E5EEF5]">
                                        <div
                                            ref={miniMapContainerRef}
                                            style={{ width: '100%', height: '100%' }}
                                            className="w-full h-full z-0"
                                        />
                                        {isPinEditMode && (
                                            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 bg-[#1E3A4C]/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs pointer-events-none">
                                                Klik pada peta untuk memindahkan titik rumah
                                            </div>
                                        )}
                                    </div>

                                    {/* 2 Tombol Aksi Peta: Gunakan lokasi terkini & Ubah pin di peta */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                                        <button
                                            type="button"
                                            onClick={handleUseCurrentLocation}
                                            className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3 px-4 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
                                        >
                                            <svg
                                                className="w-4 h-4 text-[#2C5E7A]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                                                <circle cx="12" cy="12" r="7" strokeWidth="2" />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="2"
                                                    d="M12 2v3m0 14v3M2 12h3m14 0h3"
                                                />
                                            </svg>
                                            <span>Gunakan lokasi terkini</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setIsPinEditMode(!isPinEditMode)}
                                            className={`w-full font-bold py-3 px-4 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer ${isPinEditMode
                                                ? 'bg-[#2C5E7A] text-white shadow-xs'
                                                : 'bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C]'
                                                }`}
                                        >
                                            <svg
                                                className={`w-4 h-4 ${isPinEditMode ? 'text-white' : 'text-[#2C5E7A]'
                                                    }`}
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
                                            <span>
                                                {isPinEditMode ? 'Selesai ubah pin' : 'Ubah pin di peta'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Input Alamat Lengkap */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                            Alamat lengkap
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Masukkan alamat lengkap rumahmu..."
                                            className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition resize-none leading-relaxed"
                                        />
                                    </div>

                                    {/* Baris Nomor Telepon Aktif & Patokan (Opsional) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                                Nomor telepon aktif
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="0812 xxxx xxxx"
                                                    className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 pr-10 text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition"
                                                />
                                                <svg
                                                    className="w-4 h-4 text-[#2C5E7A] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                                                Patokan (opsional)
                                            </label>
                                            <input
                                                type="text"
                                                value={landmark}
                                                onChange={(e) => setLandmark(e.target.value)}
                                                placeholder="Contoh: Pagar putih, sebelah warung"
                                                className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Baris Bawah Card Kanan: Catatan Privasi & Tombol Oranye Kirim Alamat */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                                        Alamat dan telepon hanya dibagikan kepada klinik dan dokter
                                        yang ditugaskan.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingHome}
                                        className="bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-75 text-white font-bold py-3.5 px-7 rounded-2xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer shrink-0 min-w-[250px]"
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
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            />
                                        </svg>
                                        <span>
                                            {isSubmittingHome
                                                ? 'Mengirim alamat...'
                                                : isHomeSubmitted
                                                    ? 'Alamat terkirim ✓'
                                                    : 'Kirim alamat & panggil dokter'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =================================================================================
    // TAMPILAN 2: SLICING "KE KLINIK" (PEMBAYARAN BERHASIL & TIKET ANTREAN A-012)
    // =================================================================================
    return (
        <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-12 px-6 lg:px-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* KOLOM KIRI: TIKET ANTREAN & BUKTI PEMBAYARAN */}
                    <div className="lg:col-span-7">
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
                                    Nomor antrean {petData.name} sudah siap. Sampai bertemu di
                                    klinik.
                                </p>
                            </div>
                        </div>

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
                                <span>{petData.name} · Konsultasi di klinik</span>
                                <span className="font-medium tracking-wide">
                                    PS-C-261102-012
                                </span>
                            </div>
                        </div>

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
                                Datang pukul 09.45 WITA dan tunjukkan tiket ke resepsionis untuk
                                check-in. Antrean mengikuti urutan layanan; kondisi darurat
                                dapat diprioritaskan.
                            </p>
                        </div>

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
                                {formatRupiah(basePriceNum)} konsultasi +{' '}
                                {formatRupiah(serviceFeeNum)} biaya layanan.
                            </p>

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

                        <p className="text-[11px] md:text-xs text-slate-400">
                            Nomor ini adalah urutan kunjungan, bukan jaminan admisi medis atau
                            rawat inap.
                        </p>
                    </div>

                    {/* KOLOM KANAN: RINGKASAN KLINIK & TOMBOL RUTE */}
                    <aside className="lg:col-span-5">
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
                                {clinic.address}
                            </p>

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