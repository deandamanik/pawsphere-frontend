import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createReport, getShelters } from '../../services/pawAlert.service';

import HeroHeader from '../../components/paw-alert/HeroHeader';
import ContactModal from '../../components/paw-alert/ContactModal';
import EmergencyTips from '../../components/paw-alert/EmergencyTips';
import NearbyShelters from '../../components/paw-alert/NearbyShelters';
import AlertForm from '../../components/paw-alert/AlertForm';
import CameraCaptureModal from '../../components/paw-alert/CameraCaptureModal';
import SuccessModal from '../../components/ui/SuccessModal';
import ErrorModal from '../../components/ui/ErrorModal';

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

const fileToResizedDataUrl = (file, max = 800) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const PawAlert = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [jenisHewan, setJenisHewan] = useState('');
  const [kondisiHewan, setKondisiHewan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState(null);
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const [activeShelter, setActiveShelter] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [sortedShelters, setSortedShelters] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  // Ambil daftar shelter dari DB saat halaman dibuka.
  useEffect(() => {
    getShelters()
      .then((data) => {
        setShelters(data);
        setSortedShelters(data.slice(0, 2));
      })
      .catch(() => {
        setShelters([]);
        setSortedShelters([]);
      });
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleCameraCapture = (file) => {
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setShowCamera(false);
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
        const withDist = shelters
          .map((s) => ({ ...s, distance: haversine(userLat, userLng, s.lat, s.lng) }))
          .sort((a, b) => a.distance - b.distance);

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
    setSortedShelters(shelters.slice(0, 2));
    setLokasi(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/paw-alert' } } });
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl = null;
      if (photo) photoUrl = await fileToResizedDataUrl(photo);

      await createReport({
        animal_type: jenisHewan || undefined,
        condition: kondisiHewan || undefined,
        description: deskripsi,
        photo_url: photoUrl,
        latitude: lokasi ? lokasi.lat : undefined,
        longitude: lokasi ? lokasi.lng : undefined,
      });

      setShowSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirim laporan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
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
    setSortedShelters(shelters.slice(0, 2));
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <AnimatePresence>
        {activeShelter && (
          <ContactModal shelter={activeShelter} onClose={() => setActiveShelter(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCamera && (
          <CameraCaptureModal
            open={showCamera}
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccessModal}
        title="Laporan Dikirim!"
        message="Laporan darurat Anda telah berhasil diterbitkan ke dalam sistem rescue."
      />
      <ErrorModal isOpen={!!errorMsg} message={errorMsg} onClose={() => setErrorMsg('')} />

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
              onOpenCamera={() => setShowCamera(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PawAlert;