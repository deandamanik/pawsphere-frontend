import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CLINICS_DATA } from '../../data/clinicsData';

const QUICK_REPLIES = [
    'Baik dok, titik rumah sudah sesuai',
    'Nanti belok kiri dekat warung ya dok',
    'Milo sudah saya siapkan di ruang tamu',
];

export default function ClinicDoctorTracking() {
    const { id } = useParams();
    const location = useLocation();

    // Ambil data dari state navigasi sebelumnya (dengan fallback sesuai gambar desain)
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

    const doctorName =
        location.state?.doctor || clinic.doctor?.name || 'drh. Putu Ayu Pratiwi';
    const doctorAvatar =
        clinic.doctor?.avatar ||
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80';

    const address =
        location.state?.address ||
        'Jl. Tukad Badung No. 18, Renon, Denpasar Selatan, Bali 80226';
    const landmark =
        location.state?.landmark || 'Pagar putih, sebelah warung';
    const phone = location.state?.phone || '0812 3456 7820';
    const paymentMethodLabel = location.state?.paymentMethodLabel || 'GoPay';
    const totalPriceNum = location.state?.totalPriceNum || 240000;

    const homeCoords = location.state?.homeCoords || {
        lat: -8.6815,
        lng: 115.2215,
    };

    const formatRupiah = (num) => 'Rp' + num.toLocaleString('id-ID');

    // ================= STATE & REF PETA PELACAKAN RUTE =================
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const container = mapContainerRef.current;
        if (!container || mapInstanceRef.current) return;

        const clinicCoords = clinic.coordinates || [-8.6725, 115.2335];
        const userCoords = [homeCoords.lat, homeCoords.lng];

        // Titik posisi dokter di tengah perjalanan (sedikit berbelok mengikuti jalan Renon)
        const doctorCurrentPos = [
            clinicCoords[0] + (userCoords[0] - clinicCoords[0]) * 0.35,
            clinicCoords[1] + (userCoords[1] - clinicCoords[1]) * 0.42,
        ];

        const map = L.map(container, {
            center: [-8.675, 115.232],
            zoom: 13,
            zoomControl: false,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // 1. Render Pin Klinik (1 Oranye, 2 & 3 Biru)
        CLINICS_DATA.forEach((item) => {
            const isSelectedClinic = item.id === clinic.id;
            const pinIcon = L.divIcon({
                className: 'bg-transparent border-0',
                html: `
          <div style="
            width: 30px;
            height: 30px;
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
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            L.marker(item.coordinates, { icon: pinIcon }).addTo(map);
        });

        // 2. Render Garis Rute Perjalanan Dokter (Dari Klinik -> Posisi Dokter -> Rumah User)
        const routePoints = [
            clinicCoords,
            doctorCurrentPos,
            [userCoords[0] + 0.0025, userCoords[1] + 0.0015],
            userCoords,
        ];

        L.polyline(routePoints, {
            color: '#2C5E7A',
            weight: 4,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
        }).addTo(map);

        // 3. Render Titik Rumah Pengguna
        const homeIcon = L.divIcon({
            className: 'bg-transparent border-0',
            html: `
        <div style="
          width: 36px;
          height: 36px;
          background-color: rgba(44, 94, 122, 0.16);
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
            iconSize: [36, 36],
            iconAnchor: [18, 18],
        });
        L.marker(userCoords, { icon: homeIcon }).addTo(map);

        // 4. Render Marker Stetoskop Dokter yang Sedang Menuju Lokasi
        const doctorMarkerIcon = L.divIcon({
            className: 'bg-transparent border-0',
            html: `
        <div style="
          width: 40px;
          height: 40px;
          background-color: #2C5E7A;
          color: #ffffff;
          border: 3px solid #ffffff;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(30, 58, 76, 0.35);
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
            <circle cx="20" cy="10" r="2"/>
          </svg>
        </div>
      `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });
        L.marker(doctorCurrentPos, {
            icon: doctorMarkerIcon,
            zIndexOffset: 900,
        }).addTo(map);

        mapInstanceRef.current = map;

        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [clinic, homeCoords.lat, homeCoords.lng]);

    // ================= STATE & LOGIC MODAL CHAT DOKTER INTERAKTIF =================
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isSendingMsg, setIsSendingMsg] = useState(false);
    const [isDoctorTyping, setIsDoctorTyping] = useState(false);
    const chatBottomRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'doctor',
            text: `Halo Kak! Saya ${doctorName} dari ${clinic.name}. Saat ini saya sedang dalam perjalanan menuju rumah ${petData.name} di area ${clinic.shortArea || 'Renon'}.`,
            time: '09.45 WITA',
            status: 'read',
        },
        {
            id: 2,
            sender: 'doctor',
            text: `Patokannya "${landmark}" ya kak? Mohon siapkan ${petData.name} di ruangan yang tenang agar pemeriksaan lebih nyaman.`,
            time: '09.46 WITA',
            status: 'read',
        },
    ]);

    // Scroll otomatis ke pesan paling bawah setiap kali ada pesan baru atau dokter mengetik
    useEffect(() => {
        if (isChatOpen) {
            chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isDoctorTyping, isChatOpen]);

    const sendMessage = (customText) => {
        const textToSend = (customText ?? chatInput).trim();
        if (!textToSend || isSendingMsg) return;

        setIsSendingMsg(true);
        if (!customText) setChatInput('');

        const now = new Date();
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}.${String(
            now.getMinutes()
        ).padStart(2, '0')} WITA`;

        const newMsgId = Date.now();

        // 1. Tampilkan pesan user dengan animasi status "sending" -> "sent"
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: newMsgId,
                    sender: 'user',
                    text: textToSend,
                    time: formattedTime,
                    status: 'sending',
                },
            ]);
            setIsSendingMsg(false);

            // Ubah status centang menjadi terkirim/dibaca
            setTimeout(() => {
                setMessages((prev) =>
                    prev.map((m) => (m.id === newMsgId ? { ...m, status: 'read' } : m))
                );
            }, 450);

            // 2. Munculkan animasi "Dokter sedang mengetik..." lalu balas otomatis
            setTimeout(() => {
                setIsDoctorTyping(true);
            }, 650);

            setTimeout(() => {
                setIsDoctorTyping(false);
                const doctorReplies = [
                    `Siap kak, terima kasih infonya! Saya diperkirakan sampai sekitar pukul 10.00 WITA ya.`,
                    `Baik kak, sudah tercatat. Saya sudah dekat di sekitar Jl. Tukad Badung, sampai bertemu sebentar lagi!`,
                    `Oke kak, peralatan pemeriksaan dan vitamin untuk ${petData.name} juga sudah saya bawa lengkap.`,
                ];
                const randomReply =
                    doctorReplies[Math.floor(Math.random() * doctorReplies.length)];

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        sender: 'doctor',
                        text: randomReply,
                        time: formattedTime,
                        status: 'read',
                    },
                ]);
            }, 2200);
        }, 220);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <div className="relative bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-12 px-6 lg:px-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* ================= KOLOM KIRI: PROFIL DOKTER & ALAMAT KUNJUNGAN ================= */}
                    <div className="lg:col-span-5 space-y-5">
                        {/* CARD 1: Dokter untuk Milo */}
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            <div className="flex items-center justify-between gap-3 mb-5">
                                <h1 className="font-display text-lg md:text-xl font-extrabold text-[#1E3A4C]">
                                    Dokter untuk {petData.name}
                                </h1>
                                <span className="bg-[#EBF2F7] text-[#243B53] text-xs font-bold px-3.5 py-1.5 rounded-full">
                                    Ditugaskan
                                </span>
                            </div>

                            {/* Profil Dokter */}
                            <div className="flex items-center gap-3.5 pb-5 mb-4 border-b border-slate-100">
                                <img
                                    src={doctorAvatar}
                                    alt={doctorName}
                                    className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shrink-0"
                                />
                                <div className="min-w-0">
                                    <div className="text-sm md:text-base font-extrabold text-[#1E3A4C] truncate">
                                        {doctorName}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate mt-0.5">
                                        {clinic.name}
                                    </div>
                                    <div className="text-xs text-slate-400 truncate mt-0.5">
                                        Dokter hewan umum · 7 tahun praktik
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 mb-4">
                                Konsultasi rumah · {clinic.name}
                            </p>

                            {/* Tombol Aksi: Chat Dokter (Buka Modal) & Telepon */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setIsChatOpen(true)}
                                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
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
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    <span>Chat dokter</span>
                                </button>

                                <a
                                    href={`tel:${phone.replace(/\s+/g, '')}`}
                                    className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3 px-4 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
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
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <span>Telepon</span>
                                </a>
                            </div>

                            <p className="text-[11px] text-slate-400">
                                Kontak klinik: (0361) 445 0182
                            </p>
                        </div>

                        {/* CARD 2: Alamat Kunjungan */}
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            <h2 className="font-display text-lg md:text-xl font-extrabold text-[#1E3A4C] mb-3">
                                Alamat kunjungan
                            </h2>

                            <p className="text-xs md:text-sm text-[#1E3A4C] leading-relaxed mb-2">
                                {address}
                            </p>

                            {landmark && (
                                <p className="text-xs text-slate-500 mb-3.5">{landmark}</p>
                            )}

                            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#1E3A4C] pb-5 mb-4 border-b border-slate-100">
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
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <span>{phone}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs md:text-sm mb-3">
                                <span className="text-slate-500">PS-H-261102-008</span>
                                <span className="font-extrabold text-[#1E3A4C]">
                                    {formatRupiah(totalPriceNum)}
                                </span>
                            </div>

                            <span className="inline-block bg-[#E6F2EC] text-[#23533D] text-[11px] font-bold px-3.5 py-1 rounded-full">
                                {paymentMethodLabel} · Lunas
                            </span>
                        </div>
                    </div>

                    {/* ================= KOLOM KANAN: ESTIMASI TIBA & PETA RUTE DOKTER ================= */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.05)]">
                            <p className="text-xs text-slate-500 mb-1">
                                Perkiraan tiba · {dateObj.label.replace(/^[^,]+,\s*/, '')}
                            </p>
                            <h2 className="font-display text-2xl md:text-[28px] font-extrabold text-[#1E3A4C] mb-5">
                                10.00–10.10 WITA
                            </h2>

                            {/* Kanvas Peta Rute Perjalanan */}
                            <div className="relative w-full h-72 md:h-[340px] rounded-2xl overflow-hidden border border-slate-200/70 bg-[#E5EEF5]">
                                <div
                                    ref={mapContainerRef}
                                    style={{ width: '100%', height: '100%' }}
                                    className="w-full h-full z-0"
                                />

                                {/* Pill Rute di Pojok Kiri Bawah Peta */}
                                <div className="absolute bottom-3.5 left-3.5 z-10 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-xl shadow-md border border-slate-100 text-xs font-medium text-[#1E3A4C]">
                                    {clinic.name} <span className="text-slate-400 mx-1">→</span>{' '}
                                    Rumah {petData.name} · {clinic.shortArea || 'Renon'}
                                </div>
                            </div>
                        </div>

                        {/* Info Box Bawah Peta */}
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
                                Siapkan {petData.name} di tempat yang tenang dan pastikan telepon
                                aktif. Estimasi dapat berubah mengikuti kondisi perjalanan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MODAL OVERLAY LIVE CHAT DOKTER ================= */}
            {isChatOpen && (
                <div
                    onClick={() => setIsChatOpen(false)}
                    className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-4 transition-opacity duration-300"
                >
                    {/* Kontainer Form Chat */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-white rounded-[24px] shadow-[0_24px_60px_rgba(15,23,42,0.28)] border border-slate-100 overflow-hidden flex flex-col h-[560px] max-h-[88dvh] animate-[fadeIn_0.22s_ease-out]"
                    >
                        {/* Header Chat Dokter */}
                        <div className="bg-[#1E3A4C] text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                    <img
                                        src={doctorAvatar}
                                        alt={doctorName}
                                        className="w-11 h-11 rounded-full object-cover border-2 border-white/20"
                                    />
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1E3A4C] absolute bottom-0 right-0" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold truncate">{doctorName}</h3>
                                    <p className="text-[11px] text-emerald-300 font-medium truncate">
                                        Online · Sedang menuju rumah {petData.name}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsChatOpen(false)}
                                aria-label="Tutup chat"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer shrink-0"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Banner Info Kunjungan di Atas Chat */}
                        <div className="bg-[#EBF2F7] px-5 py-2.5 text-[11px] text-[#243B53] font-medium flex items-center justify-between border-b border-slate-200/60 shrink-0">
                            <span>Pasien: {petData.name} ({petData.type})</span>
                            <span className="font-bold text-[#2C5E7A]">
                                Tiba 10.00–10.10 WITA
                            </span>
                        </div>

                        {/* Area Pesan Chat */}
                        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-[#F8FAFC]">
                            {messages.map((msg) => {
                                const isUser = msg.sender === 'user';
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed transition-all duration-300 ${isUser
                                                    ? 'bg-[#2C5E7A] text-white rounded-br-xs shadow-xs'
                                                    : 'bg-white text-[#1E3A4C] border border-slate-200/80 rounded-bl-xs shadow-2xs'
                                                } ${msg.status === 'sending'
                                                    ? 'opacity-70 translate-y-1'
                                                    : 'opacity-100 translate-y-0'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-1 px-1">
                                            <span className="text-[10px] text-slate-400">
                                                {msg.time}
                                            </span>
                                            {isUser && (
                                                <span className="text-[10px] font-bold text-[#2C5E7A]">
                                                    {msg.status === 'sending' ? 'Mengirim...' : '✓✓ Dibaca'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Indikator Animasi Dokter Sedang Mengetik */}
                            {isDoctorTyping && (
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src={doctorAvatar}
                                        alt={doctorName}
                                        className="w-7 h-7 rounded-full object-cover shrink-0"
                                    />
                                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-2xs inline-flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E7A] animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E7A] animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E7A] animate-bounce" />
                                        <span className="text-[11px] text-slate-400 ml-1.5">
                                            mengetik...
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div ref={chatBottomRef} />
                        </div>

                        {/* Barisan Quick Replies (Balasan Cepat) */}
                        <div className="bg-white px-4 pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 shrink-0">
                            {QUICK_REPLIES.map((replyText, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => sendMessage(replyText)}
                                    className="px-3 py-1.5 rounded-full bg-[#EBF2F7] hover:bg-[#dce7f0] text-[#1E3A4C] text-[11px] font-semibold whitespace-nowrap transition cursor-pointer shrink-0"
                                >
                                    {replyText}
                                </button>
                            ))}
                        </div>

                        {/* Input Form Kirim Pesan */}
                        <form
                            onSubmit={handleChatSubmit}
                            className="bg-white p-3.5 flex items-center gap-2.5 shrink-0"
                        >
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder={`Tulis pesan untuk ${doctorName}...`}
                                className="flex-1 bg-[#F4F8FB] border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#1E3A4C] placeholder:text-slate-400 focus:outline-none focus:border-[#2C5E7A] transition"
                            />
                            <button
                                type="submit"
                                disabled={!chatInput.trim() || isSendingMsg}
                                className="bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                            >
                                <span>Kirim</span>
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}