// src/pages/clinic/Clinic.jsx
import { useState } from 'react';
import { CLINICS_DATA } from '../../data/clinicsData';
import ClinicLocationSidebar from '../../components/clinic/ClinicLocationSidebar';
import ClinicNearbySidebar from '../../components/clinic/ClinicNearbySidebar';
import ClinicMapCanvas from '../../components/clinic/ClinicMapCanvas';

export default function Clinic() {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [sidebarMode, setSidebarMode] = useState('permission'); // 'permission' | 'nearby'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(CLINICS_DATA[0]);

  // Fungsi helper untuk animasi pergantian sidebar yang smooth
  const switchSidebarSmoothly = (targetMode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSidebarMode(targetMode);
      setIsTransitioning(false);
    }, 220);
  };

  // Ketika tombol "Izinkan lokasi" diklik
  const handleRequestLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      // Fallback ke lokasi perkiraan Renon jika browser tidak mendukung
      setUserLocation({ lat: -8.6815, lng: 115.2215 });
      setIsLocating(false);
      switchSidebarSmoothly('nearby');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        switchSidebarSmoothly('nearby');
      },
      () => {
        // Jika izin lokasi ditolak/timeout di lokal, tetap arahkan ke lokasi perkiraan Renon agar demo lancar
        setUserLocation({ lat: -8.6815, lng: 115.2215 });
        setIsLocating(false);
        switchSidebarSmoothly('nearby');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Ketika tombol "Pilih lokasi manual" diklik
  const handleManualLocation = () => {
    setLocationError('');
    setUserLocation({
      lat: -8.6815,
      lng: 115.2215,
    });
    switchSidebarSmoothly('nearby');
  };

  return (
    <div className="relative w-full flex-1 min-h-0 bg-[#E5EEF5] overflow-hidden select-none">
      {/* Peta Bali Full Canvas */}
      <ClinicMapCanvas
        clinics={CLINICS_DATA}
        userLocation={userLocation}
        selectedClinic={selectedClinic}
        onSelectClinic={(clinic) => {
          setSelectedClinic(clinic);
          if (sidebarMode !== 'nearby') {
            switchSidebarSmoothly('nearby');
          }
        }}
        onLocateClick={handleRequestLocation}
      />

      {/* Floating Sidebar Kiri dengan Transisi Smooth */}
      <div
        className={`absolute top-5 left-6 z-20 w-[calc(100%-3rem)] max-w-[390px] pointer-events-auto transition-all duration-300 ease-out ${
          isTransitioning
            ? 'opacity-0 -translate-x-3 scale-[0.98]'
            : 'opacity-100 translate-x-0 scale-100'
        }`}
      >
        {sidebarMode === 'permission' ? (
          <ClinicLocationSidebar
            onRequestLocation={handleRequestLocation}
            onManualLocation={handleManualLocation}
            isLocating={isLocating}
            locationError={locationError}
            userLocation={userLocation}
          />
        ) : (
          <ClinicNearbySidebar
            clinics={CLINICS_DATA}
            selectedClinicId={selectedClinic?.id}
            onSelectClinic={(clinic) => setSelectedClinic(clinic)}
            onChangeLocation={() => switchSidebarSmoothly('permission')}
          />
        )}
      </div>
    </div>
  );
}