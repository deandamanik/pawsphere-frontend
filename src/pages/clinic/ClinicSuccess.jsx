// src/pages/clinic/ClinicSuccess.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { jsPDF } from 'jspdf';
import { CLINICS_DATA } from '../../data/clinicsData';

// Helper dikurangi 15 menit untuk jam kedatangan check-in (contoh: "10.00" -> "09.45")
function getArrivalTime(timeStr = '10.00') {
  const parts = timeStr.split('.');
  if (parts.length !== 2) return '09.45';
  let hours = parseInt(parts[0], 10);
  let mins = parseInt(parts[1], 10) - 15;
  if (mins < 0) {
    mins += 60;
    hours = (hours - 1 + 24) % 24;
  }
  return `${String(hours).padStart(2, '0')}.${String(mins).padStart(2, '0')}`;
}

export default function ClinicSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const clinic =
    state.clinic || CLINICS_DATA.find((c) => c.id === id) || CLINICS_DATA[0];

  const isHomeCare =
    state.careMethod === 'rumah' || state.method === 'Dokter ke rumah';

  const petData = state.petData || {
    name: 'Milo',
    type: 'Kucing domestik',
    age: '2 tahun',
    weight: '4 kg',
  };

  const dateObj = state.date || {
    label: 'Senin, 2 November 2026',
    short: '2 Nov',
  };

  // Singkatkan tanggal untuk kartu kiri ("2 Nov 2026" -> "2 Nov")
  const shortDateDisplay = (dateObj.short || '2 Nov').replace(/\s+\d{4}$/, '');
  const timeSlot = state.time || '10.00';
  const arrivalTime = getArrivalTime(timeSlot);
  const queueNumber = state.queueNumber || 'A-012';
  const bookingCode =
    state.bookingCode || (isHomeCare ? 'PS-H-261102-008' : 'PS-C-261102-012');

  // ================= UNDUH TIKET ANTREAN PDF (UNTUK DATANG KE KLINIK) =================
  const handleDownloadTicket = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [140, 175],
    });

    doc.setFillColor(244, 248, 251);
    doc.rect(0, 0, 140, 175, 'F');

    doc.setTextColor(30, 58, 76);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PawSphere Clinic', 70, 16, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Tiket Antrean Kunjungan Klinik', 70, 22, { align: 'center' });

    doc.setFillColor(44, 94, 122);
    doc.roundedRect(12, 28, 116, 68, 6, 6, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(
      `ANTREAN KUNJUNGAN · ${clinic.name.toUpperCase()}`,
      70,
      40,
      { align: 'center' }
    );

    doc.setFontSize(38);
    doc.text(queueNumber, 70, 60, { align: 'center' });

    doc.setFontSize(10.5);
    doc.text(`${dateObj.label} · ${timeSlot} WITA`, 70, 74, {
      align: 'center',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${petData.name} · Konsultasi di klinik`, 18, 89);
    doc.text(bookingCode, 122, 89, { align: 'right' });

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 102, 116, 44, 5, 5, 'F');

    doc.setTextColor(30, 58, 76);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('Detail Reservasi', 18, 112);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Klinik   : ${clinic.name}`, 18, 120);
    doc.text(`Alamat   : ${clinic.address || clinic.area}`, 18, 127);
    doc.text(`Hewan    : ${petData.name} (${petData.type})`, 18, 134);
    doc.text(`Status   : Terjadwal`, 18, 141);

    doc.setFillColor(235, 242, 247);
    doc.roundedRect(12, 151, 116, 15, 4, 4, 'F');
    doc.setTextColor(36, 59, 83);
    doc.setFontSize(7.5);
    doc.text(
      `Datang pukul ${arrivalTime} WITA dan tunjukkan tiket ini ke resepsionis`,
      70,
      157.5,
      { align: 'center' }
    );
    doc.text(
      'untuk check-in. Kondisi darurat dapat diprioritaskan.',
      70,
      162.5,
      { align: 'center' }
    );

    doc.save(`Tiket-Antrean-${queueNumber}-${petData.name}.pdf`);
  };

  // ================= UNDUH BUKTI BAYAR PDF (UNTUK KONSULTASI DI RUMAH) =================
  const handleDownloadReceipt = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [140, 165],
    });

    doc.setFillColor(244, 248, 251);
    doc.rect(0, 0, 140, 165, 'F');

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 12, 116, 140, 6, 6, 'F');

    doc.setTextColor(30, 58, 76);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Bukti Pembayaran PawSphere', 20, 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`${clinic.name} · ${petData.name}`, 20, 33);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 39, 120, 39);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Jadwal', 20, 49);
    doc.text('Konsultasi & tindakan', 20, 58);
    doc.text('Ongkir zona <=5 km', 20, 67);
    doc.text('Biaya PawSphere', 20, 76);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 76);
    doc.text(`${shortDateDisplay} · ${timeSlot} WITA`, 120, 49, {
      align: 'right',
    });
    doc.text('Bayar setelah periksa', 120, 58, { align: 'right' });
    doc.text('Rp10.000', 120, 67, { align: 'right' });
    doc.text('Rp5.000', 120, 76, { align: 'right' });

    doc.line(20, 84, 120, 84);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('GoPay · Rp15.000 dibayar', 20, 94);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 58, 76);
    doc.text(bookingCode, 20, 103);

    doc.setFillColor(235, 242, 247);
    doc.roundedRect(20, 114, 100, 24, 4, 4, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(36, 59, 83);
    doc.text(
      'Ongkir dan biaya PawSphere sudah dibayar. Biaya medis',
      70,
      123,
      { align: 'center' }
    );
    doc.text(
      'belum ditagihkan. Dokter ditugaskan setelah alamat diterima.',
      70,
      129,
      { align: 'center' }
    );

    doc.save(`Bukti-Bayar-${bookingCode}.pdf`);
  };

  const handleViewRoute = () => {
    const [lat, lng] = clinic.coordinates || [-8.6725, 115.2335];
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ================= STATE & PETA KHUSUS KONSULTASI DI RUMAH =================
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressFormError, setAddressFormError] = useState('');
  const [houseCoords, setHouseCoords] = useState(() => {
    const savedHouseCoords = state.homeCoords;
    if (
      Number.isFinite(savedHouseCoords?.lat) &&
      Number.isFinite(savedHouseCoords?.lng)
    ) {
      return [savedHouseCoords.lat, savedHouseCoords.lng];
    }

    if (
      Array.isArray(savedHouseCoords) &&
      Number.isFinite(savedHouseCoords[0]) &&
      Number.isFinite(savedHouseCoords[1])
    ) {
      return savedHouseCoords;
    }

    const detectedLocation = state.userLocation;
    if (
      Number.isFinite(detectedLocation?.lat) &&
      Number.isFinite(detectedLocation?.lng)
    ) {
      return [detectedLocation.lat, detectedLocation.lng];
    }

    return [-8.6815, 115.2215];
  });
  const [isPinEditMode, setIsPinEditMode] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const initialHouseCoords = useRef(houseCoords);

  const homeMapRef = useRef(null);
  const homeMapInstance = useRef(null);
  const userMarkerRef = useRef(null);
  const houseRouteRef = useRef(null);

  // Fungsi Reverse Geocoding saat pin rumah dipindahkan
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      if (data?.display_name) {
        setAddress(data.display_name);
      }
    } catch {
      // Tetap gunakan alamat yang tertulis jika offline
    }
  };

  useEffect(() => {
    if (!isHomeCare) return;
    const container = homeMapRef.current;
    if (!container || homeMapInstance.current) return;

    const map = L.map(container, {
      center: initialHouseCoords.current,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Render Pin Klinik (1 Oranye, 2 & 3 Biru Tua sesuai gambar referensi)
    CLINICS_DATA.forEach((item) => {
      const isSelected = item.id === clinic.id;
      const pinIcon = L.divIcon({
        className: 'bg-transparent border-0',
        html: `
          <div style="
            width: 26px;
            height: 26px;
            background-color: ${isSelected ? '#FF6B00' : '#2C5E7A'};
            color: #ffffff;
            border: 2.5px solid #ffffff;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 11px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.22);
          ">
            ${item.number}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      L.marker(item.coordinates, { icon: pinIcon }).addTo(map);
    });

    const clinicCoords = clinic.coordinates || [-8.6725, 115.2335];
    houseRouteRef.current = L.polyline(
      [clinicCoords, initialHouseCoords.current],
      {
        color: '#2C5E7A',
        weight: 4,
        opacity: 0.85,
        dashArray: '8 8',
        lineCap: 'round',
      }
    ).addTo(map);

    // Render Pin Radar Titik Rumah Kamu
    const userRadarIcon = L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background-color: rgba(44, 94, 122, 0.18);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 11px;
            height: 11px;
            background-color: #2C5E7A;
            border: 2.5px solid #ffffff;
            border-radius: 9999px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker(initialHouseCoords.current, {
      icon: userRadarIcon,
      draggable: true,
    }).addTo(map);

    userMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setHouseCoords([pos.lat, pos.lng]);
      fetchAddressFromCoords(pos.lat, pos.lng);
    });

    userMarkerRef.current = userMarker;

    map.on('click', (e) => {
      const nextCoords = [e.latlng.lat, e.latlng.lng];
      setHouseCoords(nextCoords);
      userMarker.setLatLng(nextCoords);
      fetchAddressFromCoords(e.latlng.lat, e.latlng.lng);
    });

    homeMapInstance.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      homeMapInstance.current = null;
      houseRouteRef.current = null;
    };
  }, [isHomeCare, clinic.id, clinic.coordinates]);

  useEffect(() => {
    const clinicCoords = clinic.coordinates || [-8.6725, 115.2335];
    houseRouteRef.current?.setLatLngs([clinicCoords, houseCoords]);
  }, [clinic, houseCoords]);

  // Handler Tombol "Gunakan lokasi terkini"
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextCoords = [pos.coords.latitude, pos.coords.longitude];
        setHouseCoords(nextCoords);
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(nextCoords);
        }
        if (homeMapInstance.current) {
          homeMapInstance.current.flyTo(nextCoords, 15, { duration: 0.8 });
        }
        fetchAddressFromCoords(nextCoords[0], nextCoords[1]);
        setIsLocatingGps(false);
      },
      () => {
        setIsLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Handler Tombol "Ubah pin di peta"
  const handleTogglePinEdit = () => {
    setIsPinEditMode((prev) => !prev);
    if (homeMapInstance.current) {
      homeMapInstance.current.flyTo(houseCoords, 15, { duration: 0.6 });
    }
  };

  const handleSendHomeAddress = () => {
    const missingFields = [
      [address, 'alamat lengkap'],
      [phone, 'nomor telepon aktif'],
      [landmark, 'patokan'],
    ]
      .filter(([value]) => !value.trim())
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setAddressFormError(
        `Tolong isi semua data terlebih dahulu: ${missingFields.join(', ')}.`
      );
      return;
    }

    setAddressFormError('');
    navigate(`/clinic/${clinic.id}/perjalanan`, {
      state: {
        ...state,
        clinic,
        petData,
        address: address.trim(),
        landmark: landmark.trim(),
        phone: phone.trim(),
        homeCoords: {
          lat: houseCoords[0],
          lng: houseCoords[1],
        },
        bookingCode,
      },
    });
  };

  // ================= TAMPILAN 1: ONGKIR LUNAS & ALAMAT RUMAH (SESUAI GAMBAR TERBARU) =================
  if (isHomeCare) {
    return (
      <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-8 md:py-10 px-5 sm:px-6 lg:px-10 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* ================= KOLOM KIRI: KARTU KONSULTASI DI RUMAH & UNDUH BUKTI BAYAR ================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.04)]">
              <h1 className="font-display text-lg md:text-xl font-extrabold text-[#1E3A4C] mb-1">
                Konsultasi di rumah
              </h1>
              <p className="text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
                {clinic.name} · {petData.name}
              </p>

              {/* Rincian Jadwal & Biaya */}
              <div className="space-y-3 text-xs md:text-sm pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Jadwal</span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    {shortDateDisplay} · {timeSlot} WITA
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Konsultasi & tindakan</span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    Bayar setelah periksa
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Ongkir zona ≤5 km</span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    Rp10.000
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Biaya PawSphere</span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    Rp5.000
                  </span>
                </div>
              </div>

              {/* Status Pembayaran & Kode Transaksi */}
              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-1">
                  QRIS · Rp15.000 dibayar
                </div>
                <div className="text-xs md:text-sm font-extrabold text-[#1E3A4C]">
                  {bookingCode}
                </div>
              </div>

              {/* Tombol Unduh Bukti Bayar */}
              <button
                type="button"
                onClick={handleDownloadReceipt}
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
                <span>Unduh Bukti Bayar</span>
              </button>
            </div>

            {/* Info Box Bawah Kiri */}
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
              <p className="text-xs text-[#243B53] leading-relaxed">
                Ongkir dan biaya PawSphere sudah dibayar. Biaya medis belum
                ditagihkan. Dokter ditugaskan setelah alamat diterima.
              </p>
            </div>
          </div>

          {/* ================= KOLOM KANAN: PILIH TITIK RUMAH KAMU & FORM ALAMAT ================= */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.04)]">
              {/* Header Kanan + Badge Dalam Zona <=5 km */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-display text-lg md:text-xl font-extrabold text-[#1E3A4C]">
                  Pilih Titik Rumah Kamu
                </h2>
                <span className="bg-[#EBF2F7] text-[#1E3A4C] text-[11px] font-bold px-3.5 py-1.5 rounded-full shrink-0">
                  Dalam zona ≤5 km
                </span>
              </div>

              {/* Peta Interaktif Bali */}
              <div className="relative w-full h-52 md:h-56 rounded-2xl overflow-hidden border border-slate-200/80 mb-3.5 bg-[#E5EEF5]">
                <div
                  ref={homeMapRef}
                  style={{ width: '100%', height: '100%' }}
                  className="w-full h-full z-0"
                />
                {isPinEditMode && (
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs text-[#1E3A4C] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs border border-slate-200">
                    Ketuk peta atau geser pin untuk mengubah titik rumah
                  </div>
                )}
              </div>

              {/* 2 Tombol Aksi Peta: Gunakan lokasi terkini & Ubah pin di peta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3.5 px-4 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-[#2C5E7A] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    <circle cx="12" cy="12" r="7" strokeWidth="1.8" />
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.8"
                      d="M12 2v3m0 14v3M2 12h3m14 0h3"
                    />
                  </svg>
                  <span>
                    {isLocatingGps
                      ? 'Mendeteksi lokasi...'
                      : 'Gunakan lokasi terkini'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleTogglePinEdit}
                  className={`w-full font-bold py-3.5 px-4 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer ${
                    isPinEditMode
                      ? 'bg-[#2C5E7A] text-white'
                      : 'bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C]'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 shrink-0 ${
                      isPinEditMode ? 'text-white' : 'text-[#2C5E7A]'
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
                  <span>Ubah pin di peta</span>
                </button>
              </div>

              {/* Field Alamat Lengkap */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#1E3A4C] mb-2">
                  Alamat lengkap
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (addressFormError) setAddressFormError('');
                  }}
                  placeholder="Masukkan alamat lengkap rumahmu..."
                  className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 text-xs md:text-sm text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A] resize-none leading-relaxed"
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
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (addressFormError) setAddressFormError('');
                      }}
                      placeholder="0812 xxxx xxxx"
                      className="w-full bg-white border border-slate-200/90 rounded-2xl pl-4 pr-10 py-3.5 text-xs md:text-sm text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
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
                    Patokan
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => {
                      setLandmark(e.target.value);
                      if (addressFormError) setAddressFormError('');
                    }}
                    placeholder="Contoh: Pagar putih, sebelah warung"
                    className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 text-xs md:text-sm text-[#1E3A4C] focus:outline-none focus:border-[#2C5E7A]"
                  />
                </div>
              </div>
              {addressFormError && (
                <p className="mt-3 text-xs font-semibold text-rose-600" role="alert">
                  {addressFormError}
                </p>
              )}
            </div>

            {/* Baris Bawah Kanan: Info Privasi & Tombol Oranye Kirim Alamat & Panggil Dokter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Alamat dan telepon hanya dibagikan kepada klinik dan dokter yang
                ditugaskan.
              </p>

              <button
                type="button"
                onClick={handleSendHomeAddress}
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-7 rounded-2xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer shrink-0"
              >
                <svg
                  className="w-4 h-4 text-white shrink-0"
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
                <span>Kirim alamat & panggil dokter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= TAMPILAN 2: BOOKING BERHASIL & ANTREAN KLINIK (A-012) =================
  return (
    <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-10 md:py-14 px-5 sm:px-6 font-sans flex flex-col items-center">
      <div className="w-full max-w-[660px]">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#2C5E7A] shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12.5l2 2 4-4"
              />
            </svg>
          </div>
          <h1 className="font-display text-2xl md:text-[28px] font-extrabold text-[#1E3A4C] tracking-tight">
            Booking berhasil!
          </h1>
        </div>

        <div className="bg-[#2C5E7A] text-white rounded-[24px] px-6 py-8 md:px-8 md:py-9 shadow-[0_12px_32px_rgba(44,94,122,0.18)] text-center mb-4">
          <div className="text-[11px] md:text-xs font-extrabold uppercase tracking-[0.08em] text-white/85 mb-2">
            ANTREAN KUNJUNGAN · {clinic.name.toUpperCase()}
          </div>

          <div className="font-display text-5xl md:text-[64px] font-extrabold leading-none tracking-tight my-3">
            {queueNumber}
          </div>

          <div className="text-sm md:text-base font-bold text-white/95 mt-3 mb-7">
            {dateObj.label} · {timeSlot} WITA
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-white/85 pt-1">
            <span>{petData.name} · Konsultasi di klinik</span>
            <span className="font-medium">{bookingCode}</span>
          </div>
        </div>

        <div className="bg-[#EBF2F7] rounded-2xl px-4 py-3.5 flex items-start gap-3 mb-4">
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
          <p className="text-xs text-[#243B53] leading-relaxed">
            Datang pukul {arrivalTime} WITA dan tunjukkan tiket ke resepsionis
            untuk check-in. Antrean mengikuti urutan layanan; kondisi darurat
            dapat diprioritaskan.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-7 shadow-[0_8px_30px_rgba(24,59,86,0.04)]">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h2 className="font-display text-base md:text-lg font-extrabold text-[#1E3A4C]">
              Ringkasan reservasi
            </h2>
            <span className="bg-[#E6F4EA] text-[#1E3A4C] text-[11px] font-bold px-3 py-1 rounded-full shrink-0">
              Terjadwal
            </span>
          </div>

          <p className="text-xs text-slate-500 pb-5 mb-5 border-b border-slate-100">
            Biaya konsultasi, obat, dan tindakan ditentukan saat pemeriksaan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={handleDownloadTicket}
              className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition cursor-pointer"
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
              <span>Unduh tiket antrean</span>
            </button>

            <button
              type="button"
              onClick={handleViewRoute}
              className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-5 rounded-xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer"
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
              <span>Lihat rute ke klinik</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}