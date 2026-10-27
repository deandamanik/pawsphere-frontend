import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  FiCrosshair as LocateFixed,
  FiPlus as Plus,
  FiMinus as Minus,
} from 'react-icons/fi';

export default function ClinicMapCanvas({
  clinics,
  userLocation,
  onSelectClinic,
  onLocateClick,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Titik tengah awal: Denpasar, Bali
    const map = L.map(mapContainerRef.current, {
      center: [-8.6650, 115.2280],
      zoom: 13,
      zoomControl: false, // Kita memakai custom zoom button di kanan atas
      attributionControl: false,
    });

    // Tile Layer terang & bersih (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Render Pin Klinik bernomor (1, 2, 3)
    clinics.forEach((clinic) => {
      const numberedIcon = L.divIcon({
        className: 'custom-clinic-marker',
        html: `
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
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(clinic.coordinates, { icon: numberedIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
          <strong style="color: #1E3A4C; font-size: 13px;">${clinic.name}</strong><br/>
          <span style="color: #64748b; font-size: 11px;">${clinic.area} • ${clinic.hours}</span>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectClinic) onSelectClinic(clinic);
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [clinics, onSelectClinic]);

  // Update Marker Lokasi User saat diaktifkan
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: #FF6B00;
          border: 3px solid #ffffff;
          border-radius: 9999px;
          box-shadow: 0 0 0 6px rgba(255, 107, 0, 0.22);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
    })
      .addTo(map)
      .bindPopup('<strong>Lokasi Anda Saat Ini</strong>')
      .openPopup();

    map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.2 });
  }, [userLocation]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetNorth = () => {
    mapInstanceRef.current?.flyTo([-8.6650, 115.2280], 13, { duration: 0.8 });
  };

  return (
    <div className="relative w-full h-full">
      {/* Container Map Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Kontrol Map Kanan Atas (N↑, +, -, Locate) */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleResetNorth}
          title="Reset arah utara"
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
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Perkecil"
            className="w-10 h-10 hover:bg-slate-50 text-[#1E3A4C] flex items-center justify-center cursor-pointer transition"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <button
          type="button"
          onClick={onLocateClick}
          title="Lokasi Saya"
          className="w-10 h-10 bg-white hover:bg-slate-50 text-[#2C5E7A] rounded-xl shadow-md border border-slate-100 flex items-center justify-center cursor-pointer transition"
        >
          <LocateFixed className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Legend Kanan Bawah */}
      <div className="absolute bottom-6 right-6 z-10 bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-full shadow-md border border-slate-100 flex items-center gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2C5E7A] inline-block" />
          <span>Klinik mitra</span>
        </div>
        <div className="flex items-center gap-1.5">
          <LocateFixed className="w-3.5 h-3.5 text-[#2C5E7A]" />
          <span>Lokasi Anda</span>
        </div>
        <span className="text-slate-400 border-l border-slate-200 pl-3">1 km</span>
      </div>
    </div>
  );
}