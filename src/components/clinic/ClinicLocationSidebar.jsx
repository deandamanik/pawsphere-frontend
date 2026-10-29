import {
  FiMapPin as MapPin,
  FiCrosshair as LocateFixed,
  FiShield as ShieldCheck,
} from "react-icons/fi";

export default function ClinicLocationSidebar({
  onRequestLocation,
  onManualLocation,
  isLocating,
  locationError,
  userLocation,
  isManualSelection = false,
  selectedManualLocation,
  onConfirmManualLocation,
  onCancelManualLocation,
}) {
  return (
    <div className="w-full bg-white rounded-[24px] p-6 md:p-7 shadow-[0_14px_40px_-8px_rgba(24,59,86,0.16)] border border-slate-100/90 font-sans">
      {/* Badge Atas */}
      <span className="inline-block bg-[#EBF2F7] text-[#243B53] text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-4">
        TEMUKAN CLINIC MITRA
      </span>

      {/* Heading & Deskripsi */}
      <h1 className="font-display text-2xl font-extrabold text-[#1E3A4C] leading-snug mb-2.5">
        {isManualSelection ? 'Pilih titik lokasi' : 'Perawatan dekat, hati lebih tenang.'}
      </h1>
      <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-5">
        {isManualSelection
          ? 'Klik titik di peta yang ingin dijadikan lokasi pencarian klinik.'
          : 'Izinkan lokasi untuk menemukan klinik mitra terdekat dan melihat pilihan perawatan hewanmu.'}
      </p>

      {isManualSelection ? (
        <>
          <div className="bg-[#EEF4F8] rounded-2xl p-3.5 mb-4 text-xs text-[#243B53] leading-relaxed font-medium">
            {selectedManualLocation
              ? `Titik dipilih: ${selectedManualLocation.lat.toFixed(5)}, ${selectedManualLocation.lng.toFixed(5)}`
              : 'Belum ada titik dipilih. Klik peta untuk menandai lokasi.'}
          </div>
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onConfirmManualLocation}
              disabled={!selectedManualLocation}
              className="w-full bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-5 rounded-full text-sm transition shadow-xs"
            >
              Gunakan lokasi ini
            </button>
            <button
              type="button"
              onClick={onCancelManualLocation}
              className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3 px-5 rounded-full text-sm transition"
            >
              Batal
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2.5 mb-4">
            <button
              type="button"
              onClick={onRequestLocation}
              disabled={isLocating}
              className="w-full bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-60 text-white font-bold py-3 px-5 rounded-full text-sm flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer"
            >
              <LocateFixed className="w-4 h-4 stroke-[2.2]" />
              <span>
                {isLocating
                  ? 'Mencari lokasi...'
                  : userLocation
                    ? 'Lihat klinik terdekat'
                    : 'Izinkan lokasi'}
              </span>
            </button>

            <button
              type="button"
              onClick={onManualLocation}
              className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3 px-5 rounded-full text-sm flex items-center justify-center gap-2.5 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#2C5E7A] stroke-[2.2]" />
              <span>Pilih lokasi manual</span>
            </button>
          </div>

          <div className="bg-[#EEF4F8] rounded-2xl p-3.5 flex items-start gap-3 mb-4">
            <ShieldCheck className="w-4 h-4 text-[#2C5E7A] shrink-0 mt-0.5" />
            <p className="text-xs text-[#243B53] leading-relaxed font-medium">
              {userLocation
                ? 'Lokasi Anda berhasil ditemukan. Tekan Izinkan lokasi untuk melihat semua klinik mitra.'
                : 'Lokasi hanya digunakan untuk mencari klinik dan jangkauan layanan.'}
            </p>
          </div>

          {locationError ? (
            <p className="text-[11px] text-red-500 leading-relaxed font-medium">
              {locationError}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Lokasi tidak tersedia? Pilih titik di peta secara manual.
            </p>
          )}
        </>
      )}
    </div>
  );
}