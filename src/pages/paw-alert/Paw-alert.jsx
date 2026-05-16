import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiMapPin, FiUpload, FiAlertTriangle, FiPhone, FiX, FiMessageCircle, FiNavigation } from 'react-icons/fi';

// ─── Haversine Formula ────────────────────────────────────────────────────────
// Hitung jarak antara dua koordinat (km)

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

const formatDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

// ─── Data Shelter (koordinat dummy sekitar Bali) ──────────────────────────────

const SHELTER_DATA = [
  {
    id: 1,
    name: 'Chandra Shelter',
    address: 'Jl. Sudirman No. 45, Denpasar',
    status: 'Buka',
    hours: '10.00 - 16.00',
    phone: '6281234567890',
    lat: -8.6705,
    lng: 115.2126,
  },
  {
    id: 2,
    name: 'Dean Shelter',
    address: 'Jl. Sudirman No. 45, Kuta',
    status: 'Buka',
    hours: '09.00 - 16.00',
    phone: '6281298765432',
    lat: -8.7215,
    lng: 115.1685,
  },
  {
    id: 3,
    name: 'Bali Animal Care',
    address: 'Jl. Raya Ubud No. 12, Gianyar',
    status: 'Buka',
    hours: '08.00 - 17.00',
    phone: '6281333445566',
    lat: -8.5069,
    lng: 115.2625,
  },
  {
    id: 4,
    name: 'BAWA Shelter',
    address: 'Jl. Sunset Road No. 88, Seminyak',
    status: 'Buka',
    hours: '07.00 - 19.00',
    phone: '6281244556677',
    lat: -8.6915,
    lng: 115.1590,
  },
  {
    id: 5,
    name: 'Sanur Pet Rescue',
    address: 'Jl. Danau Tamblingan No. 3, Sanur',
    status: 'Tutup',
    hours: '08.00 - 15.00',
    phone: '6281255667788',
    lat: -8.6839,
    lng: 115.2624,
  },
];

const tips = [
  'Jangan pindahkan hewan kecuali dalam bahaya langsung',
  'Hindari kontak langsung dengan mulut hewan luka',
  'Foto dari jarak aman terlebih dahulu',
  'Tetap di lokasi hingga tim shelter tiba',
];

// ─── Modal Hubungi Shelter ────────────────────────────────────────────────────

const ContactModal = ({ shelter, onClose }) => {
  const waMessage = encodeURIComponent(
    `Halo ${shelter.name}, saya menemukan hewan yang membutuhkan pertolongan darurat. Mohon bantuan segera!`
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200
                     flex items-center justify-center transition-colors"
        >
          <FiX size={15} className="text-gray-500" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="font-bold text-brand-blue-darker text-base">{shelter.name}</p>
            <p className="text-brand-blue-darker/55 text-xs">{shelter.address}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-brand-blue-light rounded-xl px-4 py-3 mb-5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${shelter.status === 'Buka' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className={`text-xs font-semibold ${shelter.status === 'Buka' ? 'text-green-700' : 'text-gray-500'}`}>
              {shelter.status}
            </span>
            <span className="text-brand-blue-darker/50 text-xs">· {shelter.hours}</span>
          </div>
          {shelter.distance !== undefined && (
            <span className="text-xs text-brand-blue-normal font-semibold flex items-center gap-1">
              <FiMapPin size={11} />
              {formatDist(shelter.distance)}
            </span>
          )}
        </div>

        <p className="text-xs text-brand-blue-darker/50 font-medium text-center mb-4">
          Pilih cara menghubungi
        </p>

        <div className="flex flex-col gap-3">
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/${shelter.phone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl
                       bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
          >
            <FiMessageCircle size={17} />
            Chat via WhatsApp
          </motion.a>

          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:+${shelter.phone}`}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl
                       bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white font-semibold text-sm transition-colors"
          >
            <FiPhone size={17} />
            Telepon Langsung
          </motion.a>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-200 text-brand-blue-darker/60
                       hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Shelter Card ─────────────────────────────────────────────────────────────

const ShelterCard = ({ shelter, rank, onContact }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: rank * 0.06 }}
    className="flex flex-col gap-3 bg-brand-blue-light rounded-xl p-3"
  >
    <div className="flex items-start gap-3">
      {/* Rank badge */}
      <div className="w-8 h-8 rounded-lg bg-brand-blue-light-active flex items-center justify-center shrink-0 mt-0.5 font-bold text-brand-blue-normal text-xs">
        #{rank + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="font-bold text-brand-blue-darker text-xs truncate">{shelter.name}</p>
          {shelter.distance !== undefined && (
            <span className="text-brand-blue-normal text-[10px] font-bold flex items-center gap-0.5 shrink-0">
              <FiMapPin size={9} />
              {formatDist(shelter.distance)}
            </span>
          )}
        </div>
        <p className="text-brand-blue-darker/60 text-[11px] mb-1.5 leading-snug">{shelter.address}</p>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
            shelter.status === 'Buka'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {shelter.status}
          </span>
          <span className="text-brand-blue-darker/50 text-[10px]">{shelter.hours}</span>
        </div>
      </div>
    </div>

    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onContact(shelter)}
      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
    >
      <FiPhone size={12} />
      Hubungi Shelter
    </motion.button>
  </motion.div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

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

        // Hitung jarak ke semua shelter lalu urutkan
        const withDist = SHELTER_DATA.map((s) => ({
          ...s,
          distance: haversine(userLat, userLng, s.lat, s.lng),
        })).sort((a, b) => a.distance - b.distance);

        setSortedShelters(withDist.slice(0, 3)); // tampilkan 3 terdekat
        setLokasi({ lat: userLat.toFixed(6), lng: userLng.toFixed(6) });
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
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ photo, jenisHewan, kondisiHewan, deskripsi, lokasi });
  };

  return (
    <div className="min-h-screen bg-white font-poppins">

      {/* Modal */}
      <AnimatePresence>
        {activeShelter && (
          <ContactModal shelter={activeShelter} onClose={() => setActiveShelter(null)} />
        )}
      </AnimatePresence>

      {/* ── Hero Header ── */}
      <section className="py-10 text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle size={22} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-brand-orange">Paw Alert</h1>
        </div>
        <p className="text-brand-blue-normal font-semibold text-sm mb-3">
          Sistem Pelaporan Darurat Hewan
        </p>
        <p className="text-red-500 text-sm max-w-md mx-auto leading-relaxed">
          Laporkan hewan terluka atau terlantar. Sistem kami akan segera mendeteksi lokasi dan
          menghubungi shelter terdekat untuk respons penyelamatan.
        </p>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* ── Left Sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Shelter Terdekat */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-brand-blue-darker text-sm">Shelter Terdekat</h3>
                {locationDetected && (
                  <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                    <FiNavigation size={9} />
                    Diurutkan
                  </span>
                )}
              </div>

              {/* Prompt GPS jika belum detect */}
              {!locationDetected && (
                <p className="text-brand-blue-darker/50 text-[11px] mb-3 leading-snug">
                  Aktifkan GPS untuk menampilkan shelter paling dekat dengan lokasimu.
                </p>
              )}

              {/* Detect button */}
              {!locationDetected && (
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeteksiLokasi}
                  disabled={loadingLokasi}
                  className="w-full flex items-center justify-center gap-2 py-2 mb-4 rounded-lg
                             bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white
                             text-xs font-semibold transition-colors disabled:opacity-60"
                >
                  <FiNavigation size={12} className={loadingLokasi ? 'animate-spin' : ''} />
                  {loadingLokasi ? 'Mendeteksi lokasi...' : 'Deteksi Lokasi Saya'}
                </motion.button>
              )}

              {/* Error */}
              {locationError && (
                <p className="text-red-500 text-[11px] mb-3 bg-red-50 rounded-lg px-3 py-2">
                  ⚠️ {locationError}
                </p>
              )}

              {/* Shelter list */}
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="wait">
                  {sortedShelters.map((s, i) => (
                    <ShelterCard
                      key={s.id}
                      shelter={s}
                      rank={i}
                      onContact={setActiveShelter}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Re-detect after first detect */}
              {locationDetected && (
                <button
                  onClick={() => { setLocationDetected(false); setSortedShelters(SHELTER_DATA.slice(0, 2)); setLokasi(null); }}
                  className="mt-3 w-full text-[11px] text-brand-blue-normal hover:underline font-medium"
                >
                  Ubah lokasi
                </button>
              )}
            </div>

            {/* Tips Darurat */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-brand-orange text-sm mb-3">⚠️ Tips Darurat</h3>
              <ul className="flex flex-col gap-2">
                {tips.map((tip, i) => (
                  <li key={i} className="text-red-500 text-xs leading-snug">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6"
          >
            {/* Foto Hewan */}
            <div>
              <label className="block text-sm font-semibold text-brand-blue-darker mb-3">
                Foto Hewan
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-red-300 rounded-xl bg-red-50/40
                           flex flex-col items-center justify-center py-10 gap-3 cursor-pointer
                           hover:bg-red-50 transition-colors"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-32 w-auto rounded-xl object-cover" />
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                      <FiCamera size={26} className="text-red-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-brand-blue-darker text-sm">Upload Foto Hewan</p>
                      <p className="text-brand-blue-darker/50 text-xs">JPG, PNG maksimum 5MB</p>
                    </div>
                  </>
                )}
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600
                             text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <FiUpload size={14} />
                  Pilih Foto
                </motion.button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
            </div>

            {/* Jenis Hewan */}
            <div>
              <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Jenis Hewan</label>
              <input
                type="text"
                value={jenisHewan}
                onChange={(e) => setJenisHewan(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           text-brand-blue-darker focus:outline-none focus:border-brand-blue-normal bg-white transition-colors"
              />
            </div>

            {/* Kondisi Hewan */}
            <div>
              <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Kondisi Hewan</label>
              <input
                type="text"
                value={kondisiHewan}
                onChange={(e) => setKondisiHewan(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           text-brand-blue-darker focus:outline-none focus:border-brand-blue-normal bg-white transition-colors"
              />
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Deskripsi Singkat</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Ceritakan kondisi hewan, lokasi spesifik, dan situasinya..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           text-brand-blue-darker placeholder:text-brand-blue-darker/40
                           focus:outline-none focus:border-brand-blue-normal bg-white resize-none transition-colors"
              />
            </div>

            {/* Lokasi GPS */}
            <div>
              <label className="block text-sm font-semibold text-brand-blue-darker mb-2">Lokasi GPS</label>
              <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <FiMapPin size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-blue-darker">
                      {lokasi ? `${lokasi.lat}, ${lokasi.lng}` : 'Lokasi belum terdeteksi'}
                    </p>
                    <p className="text-xs text-brand-blue-darker/50">
                      {lokasi ? 'Lokasi GPS berhasil dideteksi' : 'Izinkan akses lokasi untuk GPS otomatis'}
                    </p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeteksiLokasi}
                  disabled={loadingLokasi}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600
                             text-white text-sm font-semibold rounded-lg transition-colors
                             whitespace-nowrap disabled:opacity-60 shrink-0"
                >
                  <FiMapPin size={14} />
                  {loadingLokasi ? 'Mendeteksi...' : 'Deteksi Lokasi'}
                </motion.button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PawAlert;