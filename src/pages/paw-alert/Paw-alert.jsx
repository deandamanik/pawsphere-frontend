import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

import HeroHeader from '../../components/paw-alert/HeroHeader';
import ContactModal from '../../components/paw-alert/ContactModal';
import EmergencyTips from '../../components/paw-alert/EmergencyTips';
import NearbyShelters from '../../components/paw-alert/NearbyShelters';
import AlertForm from '../../components/paw-alert/AlertForm';
import SuccessModal from '../../components/ui/SuccessModal';

const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const SHELTER_DATA = [
  { id: 1, name: 'Chandra Shelter', address: 'Jl. Sudirman No. 45, Denpasar', status: 'Buka', hours: '10.00 - 16.00', phone: '6281234567890', lat: -8.6705, lng: 115.2126 },
  { id: 2, name: 'Dean Shelter', address: 'Jl. Sudirman No. 45, Kuta', status: 'Buka', hours: '09.00 - 16.00', phone: '6281298765432', lat: -8.7215, lng: 115.1685 },
  { id: 3, name: 'Bali Animal Care', address: 'Jl. Raya Ubud No. 12, Gianyar', status: 'Buka', hours: '08.00 - 17.00', phone: '6281333445566', lat: -8.5069, lng: 115.2625 },
  { id: 4, name: 'BAWA Shelter', address: 'Jl. Sunset Road No. 88, Seminyak', status: 'Buka', hours: '07.00 - 19.00', phone: '6281244556677', lat: -8.6915, lng: 115.1590 },
  { id: 5, name: 'Sanur Pet Rescue', address: 'Jl. Danau Tamblingan No. 3, Sanur', status: 'Tutup', hours: '08.00 - 15.00', phone: '6281255667788', lat: -8.6839, lng: 115.2624 },
];

const PawAlert = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [jenisHewan, setJenisHewan] = useState('');
  const [kondisiHewan, setKondisiHewan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState(null);
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const [activeShelter, setActiveShelter] = useState(null);
  const [sortedShelters, setSortedShelters] = useState(SHELTER_DATA.slice(0, 2));
  const [locationError, setLocationError] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDeteksiLokasi = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser tidak mendukung GPS.');
      return;
    }
    setLoadingLokasi(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: userLat, longitude: userLng } = pos.coords;
        const withDist = SHELTER_DATA.map((s) => ({
          ...s,
          distance: haversine(userLat, userLng, s.lat, s.lng),
        })).sort((a, b) => a.distance - b.distance);

        setSortedShelters(withDist.slice(0, 3));
        setLokasi({ lat: userLat, lng: userLng });
        setLocationDetected(true);
        setLoadingLokasi(false);
      },
      (err) => {
        const msg = {
          1: 'Akses lokasi ditolak. Izinkan lokasi di browser.',
          2: 'Lokasi tidak dapat dideteksi.',
          3: 'Waktu habis. Coba lagi.',
        }[err.code] || 'Gagal mendeteksi lokasi.';
        setLocationError(msg);
        setLoadingLokasi(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleResetLokasi = () => {
    setLocationDetected(false);
    setSortedShelters(SHELTER_DATA.slice(0, 2));
    setLokasi(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ photo, jenisHewan, kondisiHewan, deskripsi, lokasi });
    setShowSuccess(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccess(false);
    setPhoto(null);
    setPhotoPreview(null);
    setJenisHewan('');
    setKondisiHewan('');
    setDeskripsi('');
    setLokasi(null);
    setLocationDetected(false);
    setSortedShelters(SHELTER_DATA.slice(0, 2));
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <AnimatePresence>
        {activeShelter && (
          <ContactModal shelter={activeShelter} onClose={() => setActiveShelter(null)} />
        )}
      </AnimatePresence>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={handleCloseSuccessModal} 
        title="Laporan Dikirim!"
        message="Laporan darurat Anda telah berhasil diterbitkan ke dalam sistem rescue."
      />

      <HeroHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <div className="flex flex-col gap-5 w-full min-w-0">
            <NearbyShelters
              locationDetected={locationDetected}
              loadingLokasi={loadingLokasi}
              locationError={locationError}
              sortedShelters={sortedShelters}
              handleDeteksiLokasi={handleDeteksiLokasi}
              handleResetLokasi={handleResetLokasi}
              onContact={setActiveShelter}
            />
            <EmergencyTips />
          </div>

          <div className="w-full min-w-0">
            <AlertForm
              photoPreview={photoPreview}
              fileInputRef={fileInputRef}
              jenisHewan={jenisHewan}
              setJenisHewan={setJenisHewan}
              kondisiHewan={kondisiHewan}
              setKondisiHewan={setKondisiHewan}
              deskripsi={deskripsi}
              setDeskripsi={setDeskripsi}
              lokasi={lokasi}
              loadingLokasi={loadingLokasi}
              handlePhotoChange={handlePhotoChange}
              handleDeteksiLokasi={handleDeteksiLokasi}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PawAlert;  