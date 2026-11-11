// src/components/clinic/ClinicLocationSidebar.jsx
import React, { useState } from 'react';

export default function ClinicLocationSidebar({
  onRequestLocation,
  onManualLocation,
  isLocating = false,
  locationError = '',
  isManualSelection = false,
  selectedManualLocation = null,
  onConfirmManualLocation,
  onCancelManualLocation,
}) {
  // State untuk memperluas/mengecilkan tinggi Bottom Sheet di layar HP
  const [sheetExpanded, setSheetExpanded] = useState(false);

  return (
    <aside
      className={`w-full bg-white rounded-t-[28px] md:rounded-[28px] shadow-[0_-10px_35px_rgba(15,23,42,0.14)] md:shadow-[0_14px_40px_rgba(24,59,86,0.12)] border-t md:border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 font-sans ${
        sheetExpanded ? 'max-h-[80dvh]' : 'max-h-[58dvh]'
      } md:max-h-[calc(100dvh-128px)]`}
    >
      {/* DRAG HANDLE KHUSUS MOBILE (Mirip Google Maps Bottom Sheet) */} 
      <button
        type="button"
        onClick={() => setSheetExpanded((prev) => !prev)}
        aria-label="Perluas atau kecilkan panel lokasi"
        className="md:hidden w-full pt-3 pb-1.5 flex flex-col items-center justify-center cursor-pointer shrink-0 focus:outline-none"
      >
        <span className="w-11 h-1.5 rounded-full bg-slate-300" />
      </button>

      {/* KONTEN UTAMA (Scrollable jika layar HP sangat pendek) */}
      <div className="px-5 pt-2 md:pt-6 pb-6 overflow-y-auto">
        {isManualSelection ? (
          /* ================= MODE 2: PILIH TITIK MANUAL DI PETA ================= */
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-[#EBF2F7] text-[#2C5E7A] text-[11px] font-bold px-3 py-1 rounded-full">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Mode Pilih Peta</span>
              </span>

              <button
                type="button"
                onClick={onCancelManualLocation}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Batal
              </button>
            </div>

            <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C] mb-1.5">
              Pilih titik lokasi Anda
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-4">
              Ketuk atau klik langsung pada peta Bali di atas untuk menentukan
              titik lokasi pencarian klinik terdekat.
            </p>

            {/* Box Status Koordinat yang Dipilih */}
            <div className="bg-[#EBF2F7] rounded-2xl p-4 flex items-start gap-3 mb-5">
              <svg
                className="w-4 h-4 text-[#2C5E7A] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01"
                />
              </svg>
              <div className="text-xs text-[#243B53] leading-relaxed font-medium">
                {selectedManualLocation ? (
                  <>
                    <span className="font-bold text-[#1E3A4C] block mb-0.5">
                      Titik berhasil dipilih
                    </span>
                    Koordinat: {selectedManualLocation.lat.toFixed(4)},{' '}
                    {selectedManualLocation.lng.toFixed(4)}
                  </>
                ) : (
                  'Belum ada titik yang dipilih. Silakan ketuk area mana saja pada peta.'
                )}
              </div>
            </div>

            {/* Tombol Aksi Konfirmasi & Kembali */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={!selectedManualLocation}
                onClick={onConfirmManualLocation}
                className="w-full bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-5 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
              >
                <span>Gunakan titik lokasi ini</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={onCancelManualLocation}
                className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3 px-5 rounded-2xl text-xs md:text-sm flex items-center justify-center transition cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </div>
        ) : (
          /* ================= MODE 1: IZIN LOKASI AWAL ================= */
          <div>
            {/* Badge Header */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#EBF2F7] text-[#2C5E7A] text-[11px] font-bold px-3 py-1 rounded-full">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Mitra Klinik Bali</span>
              </span>
            </div>

            {/* Judul & Deskripsi */}
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C] leading-snug mb-1.5">
              Cari klinik hewan terdekat di Bali
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-4">
              Aktifkan lokasi untuk mengurutkan mitra klinik berdasarkan jarak
              terdekat, cek kuota rawat inap, atau panggil dokter ke rumah.
            </p>

            {/* Alert Error Lokasi (Jika Izin Ditolak / Timeout) */}
            {locationError && (
              <div className="bg-rose-50 border border-rose-200/80 text-rose-700 rounded-2xl p-3.5 text-xs leading-relaxed mb-4 flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
                <span>{locationError}</span>
              </div>
            )}

            {/* Tombol Utama Oranye: Gunakan Lokasi Saat Ini */}
            <div className="space-y-2.5 mb-4">
              <button
                type="button"
                disabled={isLocating}
                onClick={onRequestLocation}
                className="w-full bg-[#FF6B00] hover:bg-[#e66000] disabled:opacity-70 text-white font-bold py-3.5 px-5 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer"
              >
                {isLocating ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Mendeteksi lokasi...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                      <circle cx="12" cy="12" r="7" strokeWidth="2" />
                      <path
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M12 2v3m0 14v3M2 12h3m14 0h3"
                      />
                    </svg>
                    <span>Gunakan lokasi saya saat ini</span>
                  </>
                )}
              </button>

              {/* Tombol Sekunder: Pilih Titik di Peta */}
              <button
                type="button"
                onClick={onManualLocation}
                className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3.5 px-5 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-[#2C5E7A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Pilih titik di peta</span>
              </button>
            </div>

            {/* Info Privasi Lokasi */}
            <div className="bg-[#F4F8FB] border border-slate-200/60 rounded-2xl p-3.5 flex items-start gap-2.5">
              <svg
                className="w-4 h-4 text-[#2C5E7A] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Lokasi hanya dipakai menghitung estimasi jarak ke klinik mitra
                di Denpasar, Badung, dan Gianyar.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}