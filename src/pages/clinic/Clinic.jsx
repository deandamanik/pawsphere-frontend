import React, { useState } from 'react';
import { CLINICS_DATA } from '../../data/clinicsData';
import ClinicLocationSidebar from '../../components/clinic/ClinicLocationSidebar';
import ClinicMapCanvas from '../../components/clinic/ClinicMapCanvas';

export default function Clinic() {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

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
        setLocationError('Izin lokasi ditolak. Silakan pilih lokasi secara manual.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualLocation = () => {
    setLocationError('');
    setUserLocation({
      lat: -8.6725,
      lng: 115.2260,
    });
  };

  return (
    <div className="relative w-full h-[calc(100dvh-80px)] bg-[#E5EEF5] overflow-hidden select-none">
      {/* Peta Bali Full Canvas */}
      <ClinicMapCanvas
        clinics={CLINICS_DATA}
        userLocation={userLocation}
        onLocateClick={handleRequestLocation}
      />

      {/* Floating Sidebar Kiri: Tanpa overflow-auto di wrapper luar agar border-radius shadow tidak terpotong */}
      <div className="absolute top-6 left-6 z-20 w-[calc(100%-3rem)] max-w-[360px] pointer-events-auto">
        <ClinicLocationSidebar
          onRequestLocation={handleRequestLocation}
          onManualLocation={handleManualLocation}
          isLocating={isLocating}
          locationError={locationError}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
}