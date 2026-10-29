import React from 'react';
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
}) {
  return (
    <div className="w-full bg-white rounded-[24px] p-6 md:p-7 shadow-[0_14px_40px_-8px_rgba(24,59,86,0.16)] border border-slate-100/90 font-sans">
      {/* Badge Atas */}
      <span className="inline-block bg-[#EBF2F7] text-[#243B53] text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-4">
        TEMUKAN CLINIC MITRA
      </span>

      {/* Heading & Deskripsi */}
      <h1 className="font-display text-2xl font-extrabold text-[#1E3A4C] leading-snug mb-2.5">
        Perawatan dekat, hati lebih tenang.
      </h1>
      <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-5">
        Izinkan lokasi untuk menemukan klinik mitra terdekat dan melihat pilihan perawatan hewanmu.
      </p>

      {/* Tombol Aksi */}
      <div className="space-y-2.5 mb-4">
        <button
          type="button"
          onClick={onRequestLocation}
          disabled={isLocating}
          className="w-full bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-60 text-white font-bold py-3 px-5 rounded-full text-sm flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer"
        >
          <LocateFixed className="w-4 h-4 stroke-[2.2]" />
          <span>{isLocating ? 'Mencari lokasi...' : 'Izinkan lokasi'}</span>
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

      {/* Info Box Privasi Lokasi */}
      <div className="bg-[#EEF4F8] rounded-2xl p-3.5 flex items-start gap-3 mb-4">
        <ShieldCheck className="w-4 h-4 text-[#2C5E7A] shrink-0 mt-0.5" />
        <p className="text-xs text-[#243B53] leading-relaxed font-medium">
          {userLocation
            ? 'Lokasi Anda berhasil diaktifkan. Menampilkan klinik mitra terdekat di sekitar Anda.'
            : 'Lokasi hanya digunakan untuk mencari klinik dan jangkauan layanan. Belum ada akses lokasi yang diberikan.'}
        </p>
      </div>

      {/* Pesan Error / Catatan Kaki */}
      {locationError ? (
        <p className="text-[11px] text-red-500 leading-relaxed font-medium">
          {locationError}
        </p>
      ) : (
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Izin ditolak? Cari area secara manual untuk tetap menemukan klinik pilihanmu.
        </p>
      )}
    </div>
  );
}