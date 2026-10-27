import React, { useState } from 'react';
import { CLINICS_DATA } from '../../data/clinicsData';
import ClinicLocationSidebar from '../../components/clinic/ClinicLocationSidebar';
import ClinicMapCanvas from '../../components/clinic/ClinicMapCanvas';

export default function Clinic() {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Fungsi untuk mengaktifkan lokasi terkini menggunakan Geolocation API browser
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung fitur geolokasi.');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        // Jika user menolak izin atau gagal, tampilkan pesan sesuai UI
        setLocationError('Izin lokasi ditolak. Silakan pilih lokasi secara manual.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Simulasi pilih lokasi manual (fokus ke pusat Renon, Denpasar)
  const handleManualLocation = () => {
    setLocationError('');
    setUserLocation({
      lat: -8.6725,
      lng: -115.2260 < 0 ? 115.2260 : 115.2260,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] min-h-[640px] bg-[#F4F7F9] overflow-hidden">
      {/* Sub-header Stepper */}

      {/* Area Peta & Floating Sidebar */}
      <div className="relative flex-1 w-full h-full">
        {/* Background Peta Leaflet Full */}
        <ClinicMapCanvas
          clinics={CLINICS_DATA}
          userLocation={userLocation}
          onLocateClick={handleRequestLocation}
        />

        {/* Floating Sidebar Kiri */}
        <div className="absolute top-6 left-6 z-10 max-w-[calc(100%-3rem)]">
          <ClinicLocationSidebar
            onRequestLocation={handleRequestLocation}
            onManualLocation={handleManualLocation}
            isLocating={isLocating}
            locationError={locationError}
            userLocation={userLocation}
          />
        </div>
      </div>
    </div>
  );
}