import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const BALI_CENTER = [-8.6650, 115.2350];

export default function ClinicMapCanvas({
  clinics = [],
  userLocation,
  selectedClinic,
  mapView = 'user',
  isSelectingLocation = false,
  onMapLocationSelect,
  showSelectedCallout = false,
  onSelectClinic,
  onLocateClick,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clinicMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const onMapLocationSelectRef = useRef(onMapLocationSelect);
  const isSelectingLocationRef = useRef(isSelectingLocation);

  useEffect(() => {
    onMapLocationSelectRef.current = onMapLocationSelect;
    isSelectingLocationRef.current = isSelectingLocation;
  }, [isSelectingLocation, onMapLocationSelect]);

  // 1. Inisialisasi Peta Dasar
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    const map = L.map(container, {
      center: BALI_CENTER,
      zoom: 13,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    map.on('click', (event) => {
      if (!isSelectingLocationRef.current) return;
      onMapLocationSelectRef.current?.({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render & Update Pin Klinik (Biru untuk reguler, Oranye + Kotak Nama untuk yang dipilih)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Bersihkan marker klinik sebelumnya
    clinicMarkersRef.current.forEach((m) => m.remove());
    clinicMarkersRef.current = [];

    clinics.forEach((clinic) => {
      const isSelected = selectedClinic?.id === clinic.id && showSelectedCallout;

      const markerHtml = isSelected
        ? `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <!-- Kotak Floating Info Klinik Mitra -->
            <div style="
              margin-bottom: 10px;
              background: #ffffff;
              padding: 10px 16px;
              border-radius: 16px;
              box-shadow: 0 10px 28px rgba(24, 59, 86, 0.16);
              border: 1px solid rgba(226, 232, 240, 0.9);
              white-space: nowrap;
              font-family: 'Plus Jakarta Sans', sans-serif;
              text-align: left;
              min-width: 190px;
            ">
              <div style="font-weight: 800; font-size: 13px; color: #1E3A4C; margin-bottom: 2px;">
                ${clinic.number} · ${clinic.name}
              </div>
              <div style="font-size: 11px; color: #64748b; font-weight: 500;">
                ${clinic.shortArea} · Mitra pilihanmu
              </div>
            </div>

            <!-- Pin Lingkaran Oranye -->
            <div style="
              width: 38px;
              height: 38px;
              background-color: #FF6B00;
              color: #ffffff;
              border: 3px solid #ffffff;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Poppins', sans-serif;
              font-weight: 700;
              font-size: 14px;
              box-shadow: 0 6px 16px rgba(255, 107, 0, 0.38);
              cursor: pointer;
            ">
              ${clinic.number}
            </div>
          </div>
        `
        : `
          <div style="
            width: 36px;
            height: 36px;
            background-color: #2C5E7A;
            color: #ffffff;
            border: 3px solid #ffffff;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(30, 58, 76, 0.28);
            cursor: pointer;
          ">
            ${clinic.number}
          </div>
        `;

      const numberedIcon = L.divIcon({
        className: 'bg-transparent border-0',
        html: markerHtml,
        iconSize: isSelected ? [220, 110] : [36, 36],
        iconAnchor: isSelected ? [110, 91] : [18, 18],
      });

      const marker = L.marker(clinic.coordinates, {
        icon: numberedIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(map);

      marker.on('click', () => {
        if (onSelectClinic) onSelectClinic(clinic);
      });

      clinicMarkersRef.current.push(marker);
    });
  }, [clinics, selectedClinic, showSelectedCallout, onSelectClinic]);

  // 3. Render Radar Lokasi Pengguna
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (!userLocation) return;

    const userIcon = L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 56px;
            height: 56px;
            background-color: rgba(44, 94, 122, 0.16);
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 14px;
              height: 14px;
              background-color: #2C5E7A;
              border: 3px solid #ffffff;
              border-radius: 9999px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            "></div>
          </div>
        </div>
      `,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      draggable: isSelectingLocation,
    }).addTo(map);

    if (isSelectingLocation) {
      userMarkerRef.current.on('dragend', (event) => {
        const location = event.target.getLatLng();
        onMapLocationSelectRef.current?.({
          lat: location.lat,
          lng: location.lng,
        });
      });
    }
  }, [isSelectingLocation, userLocation]);

  // 4. Fokuskan peta pada lokasi pengguna atau seluruh klinik sesuai alur.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (mapView === 'user' && userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.9 });
    } else if (mapView === 'clinics' && userLocation && clinics.length) {
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lng],
        ...clinics.map((clinic) => clinic.coordinates),
      ]);
      const isSmallScreen = map.getSize().x < 768;
      map.flyToBounds(bounds, {
        paddingTopLeft: isSmallScreen ? [24, Math.min(360, map.getSize().y * 0.45)] : [420, 40],
        paddingBottomRight: [32, 32],
        maxZoom: 12,
        duration: 0.9,
      });
    } else if (mapView === 'selected' && selectedClinic) {
      map.flyTo(selectedClinic.coordinates, 14, { duration: 0.9 });
    } else if (mapView === 'manual' && userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 0.5 });
    }
  }, [clinics, mapView, selectedClinic, userLocation]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetNorth = () => {
    if (userLocation) {
      mapInstanceRef.current?.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.8 });
      return;
    }
    mapInstanceRef.current?.flyTo(BALI_CENTER, 13, { duration: 0.8 });
  };

  return (
    <div className={`relative w-full h-full ${isSelectingLocation ? 'cursor-crosshair' : ''}`}>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full z-0"
      />

      {/* Kontrol Map Kanan Atas */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleResetNorth}
          title={userLocation ? 'Fokus ke lokasi Anda' : 'Tampilkan Bali'}
          className="w-10 h-10 bg-white hover:bg-slate-50 text-[#1E3A4C] font-bold text-xs rounded-xl shadow-md border border-slate-100 flex items-center justify-center cursor-pointer transition"
        >
          N↑
        </button>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Perbesar"
            className="w-10 h-10 hover:bg-slate-50 text-[#1E3A4C] flex items-center justify-center border-b border-slate-100 cursor-pointer transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Perkecil"
            className="w-10 h-10 hover:bg-slate-50 text-[#1E3A4C] flex items-center justify-center cursor-pointer transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={onLocateClick}
          title="Lokasi Saya di Bali"
          className="w-10 h-10 bg-white hover:bg-slate-50 text-[#2C5E7A] rounded-xl shadow-md border border-slate-100 flex items-center justify-center cursor-pointer transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <circle cx="12" cy="12" r="8" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M2 12h2m16 0h2" />
          </svg>
        </button>
      </div>

      {/* Legend Kanan Bawah */}
      <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-full shadow-md border border-slate-100 flex items-center gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2C5E7A] inline-block" />
          <span>Klinik mitra</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#2C5E7A] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E7A]" />
          </span>
          <span>Lokasi Anda</span>
        </div>
        <span className="text-slate-400 border-l border-slate-200 pl-3">1 km</span>
      </div>
    </div>
  );
}