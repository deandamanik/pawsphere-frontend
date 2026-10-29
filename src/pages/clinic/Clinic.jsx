import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CLINICS_DATA } from '../../data/clinicsData';
import ClinicLocationSidebar from '../../components/clinic/ClinicLocationSidebar';
import ClinicNearbySidebar from '../../components/clinic/ClinicNearbySidebar';
import ClinicProfileSidebar from '../../components/clinic/ClinicProfileSidebar';
import ClinicMapCanvas from '../../components/clinic/ClinicMapCanvas';

export default function Clinic() {
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [mapView, setMapView] = useState('user');
  const [sidebarMode, setSidebarMode] = useState('permission');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const initialLocationRequested = useRef(false);

  const switchSidebarSmoothly = useCallback((targetMode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSidebarMode(targetMode);
      setIsTransitioning(false);
    }, 200);
  }, []);

  const getCurrentLocation = useCallback((showClinicsAfterLocate = true) => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Browser ini tidak mendukung akses lokasi. Silakan pilih titik di peta.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setManualLocation(null);
        setMapView(showClinicsAfterLocate ? 'clinics' : 'user');
        setIsLocating(false);
        if (showClinicsAfterLocate) switchSidebarSmoothly('nearby');
      },
      (error) => {
        const messages = {
          1: 'Izin lokasi ditolak. Izinkan akses lokasi di browser atau pilih titik secara manual.',
          2: 'Lokasi tidak dapat dideteksi. Coba lagi atau pilih titik secara manual.',
          3: 'Waktu pencarian lokasi habis. Coba lagi atau pilih titik secara manual.',
        };
        setLocationError(messages[error.code] || 'Lokasi gagal dideteksi. Coba lagi atau pilih titik secara manual.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [switchSidebarSmoothly]);

  useEffect(() => {
    if (initialLocationRequested.current) return;
    initialLocationRequested.current = true;
    getCurrentLocation(false);
  }, [getCurrentLocation]);

  const handleRequestLocation = () => {
    if (userLocation) {
      setMapView('clinics');
      switchSidebarSmoothly('nearby');
      return;
    }
    getCurrentLocation(true);
  };

  const handleManualLocation = () => {
    setLocationError('');
    setManualLocation(null);
    setMapView('manual');
    switchSidebarSmoothly('manual');
  };

  const handleManualMapClick = (location) => {
    setManualLocation(location);
  };

  const handleConfirmManualLocation = () => {
    if (!manualLocation) return;
    setUserLocation(manualLocation);
    setMapView('clinics');
    switchSidebarSmoothly('nearby');
  };

  const handleOpenClinicDetail = (clinic) => {
    setSelectedClinic(clinic);
    setMapView('selected');
    if (sidebarMode !== 'detail') {
      switchSidebarSmoothly('detail');
    }
  };

  const clinicsByDistance = useMemo(() => {
    if (!userLocation) return CLINICS_DATA;

    return CLINICS_DATA.map((clinic) => {
      const [clinicLat, clinicLng] = clinic.coordinates;
      const latDiff = ((clinicLat - userLocation.lat) * Math.PI) / 180;
      const lngDiff = ((clinicLng - userLocation.lng) * Math.PI) / 180;
      const haversine =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos((userLocation.lat * Math.PI) / 180) *
          Math.cos((clinicLat * Math.PI) / 180) *
          Math.sin(lngDiff / 2) ** 2;
      const boundedHaversine = Math.min(1, Math.max(0, haversine));
      const distanceKm = 6371 * 2 * Math.atan2(
        Math.sqrt(boundedHaversine),
        Math.sqrt(1 - boundedHaversine)
      );

      return {
        ...clinic,
        distanceKm,
        distance: `${distanceKm.toFixed(1).replace('.', ',')} km`,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation]);

  return (
    <div className="relative w-full h-[calc(100dvh-80px)] bg-[#E5EEF5] overflow-hidden select-none">
      {/* Peta Bali Full Canvas */}
      <ClinicMapCanvas
        clinics={clinicsByDistance}
        userLocation={manualLocation || userLocation}
        selectedClinic={selectedClinic}
        mapView={mapView}
        isSelectingLocation={sidebarMode === 'manual'}
        onMapLocationSelect={handleManualMapClick}
        showSelectedCallout={sidebarMode === 'detail' || sidebarMode === 'nearby'}
        onSelectClinic={handleOpenClinicDetail}
        onLocateClick={handleRequestLocation}
      />

      {/* Floating Sidebar Kiri dengan Transisi Smooth */}
      <div
        className={`absolute top-5 left-6 z-20 w-[calc(100%-3rem)] ${sidebarMode === 'detail' ? 'max-w-[460px]' : 'max-w-[395px]'} pointer-events-auto transition-all duration-300 ease-out ${isTransitioning
            ? 'opacity-0 -translate-x-3 scale-[0.98]'
            : 'opacity-100 translate-x-0 scale-100'
          }`}
      >
        {sidebarMode === 'permission' && (
          <ClinicLocationSidebar
            onRequestLocation={handleRequestLocation}
            onManualLocation={handleManualLocation}
            isLocating={isLocating}
            locationError={locationError}
            userLocation={userLocation}
          />
        )}

        {sidebarMode === 'manual' && (
          <ClinicLocationSidebar
            isManualSelection
            selectedManualLocation={manualLocation}
            onConfirmManualLocation={handleConfirmManualLocation}
            onCancelManualLocation={() => {
              setManualLocation(null);
              setMapView('user');
              switchSidebarSmoothly('permission');
            }}
          />
        )}

        {sidebarMode === 'nearby' && (
          <ClinicNearbySidebar
            clinics={clinicsByDistance}
            selectedClinicId={selectedClinic?.id}
            onSelectClinic={handleOpenClinicDetail}
            areaLabel={manualLocation ? 'Lokasi pilihan di peta' : 'Di sekitar lokasi Anda'}
            onChangeLocation={() => {
              setMapView('user');
              switchSidebarSmoothly('permission');
            }}
          />
        )}

        {sidebarMode === 'detail' && (
          <ClinicProfileSidebar
            clinic={selectedClinic}
            onBack={() => {
              setMapView('clinics');
              switchSidebarSmoothly('nearby');
            }}
          />
        )}
      </div>
    </div>
  );
}