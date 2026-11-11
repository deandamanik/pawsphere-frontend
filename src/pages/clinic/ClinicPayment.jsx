// src/pages/clinic/ClinicPayment.jsx
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CLINICS_DATA } from '../../data/clinicsData';

export default function ClinicPayment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const clinic =
    state.clinic || CLINICS_DATA.find((c) => c.id === id) || CLINICS_DATA[0];

  const petData = state.petData || {
    name: 'Milo',
    type: 'Kucing domestik',
    age: '2 tahun',
    weight: '4 kg',
  };

  // Cek apakah dari alur Rawat Inap / Penitipan atau Kunjungan Rumah
  const isInpatient = Boolean(state.stayType);

  // State pilihan metode pembayaran ('tunai' | 'qris')
  const [paymentMethod, setPaymentMethod] = useState('tunai');

  // Kalkulasi biaya (Default mengikuti desain Ongkir Dokter ke Rumah: Rp10.000 + Rp5.000 = Rp15.000)
  const deliveryFee = isInpatient
    ? state.travelFeeNum || 0
    : 10000;
  const platformFee = 5000;
  const inpatientTotal = isInpatient
    ? (state.basePriceNum || 500000) + deliveryFee + platformFee
    : 15000;

  const formatRupiah = (num) => 'Rp' + num.toLocaleString('id-ID');

  const handleConfirmPayment = () => {
    navigate(`/clinic/${clinic.id}/berhasil`, {
      state: {
        ...state,
        clinic,
        petData,
        careMethod: isInpatient ? 'inpatient' : 'rumah',
        method: isInpatient ? state.method : 'Dokter ke rumah',
        paymentMethod: paymentMethod === 'tunai' ? 'Tunai' : 'QRIS',
        paymentStatus:
          paymentMethod === 'tunai' ? 'Tunai · Saat tiba' : 'QRIS · Lunas',
        totalPaid: isInpatient ? formatRupiah(inpatientTotal) : 'Rp15.000',
        bookingCode: 'PS-H-261102-008',
      },
    });
  };

  return (
    <div className="bg-[#F4F8FB] min-h-[calc(100dvh-80px)] py-12 md:py-16 px-5 sm:px-6 font-sans flex flex-col items-center">
      <div className="w-full max-w-[660px]">
        {/* ================= KARTU 1: RINCIAN BIAYA KUNJUNGAN RUMAH ================= */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(24,59,86,0.04)] mb-4">
          <h1 className="font-display text-lg md:text-xl font-extrabold text-[#1E3A4C] mb-5">
            {isInpatient
              ? `Ringkasan biaya ${state.service?.toLowerCase() || 'rawat inap'}`
              : 'Biaya kunjungan rumah'}
          </h1>

          <div className="space-y-3.5 text-xs md:text-sm pb-5 mb-5 border-b border-slate-200/80">
            {!isInpatient ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Konsultasi & tindakan {petData.name}
                  </span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    Bayar tatap muka
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Ongkir dokter · zona ≤5 km
                  </span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    Rp10.000
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Biaya platform PawSphere
                  </span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    Rp5.000
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    {state.service} {petData.name} ({state.totalNights || 2}{' '}
                    malam)
                  </span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    {formatRupiah(state.basePriceNum || 500000)}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">Biaya jemput hewan</span>
                    <span className="font-bold text-[#1E3A4C] text-right">
                      {formatRupiah(deliveryFee)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Biaya platform PawSphere
                  </span>
                  <span className="font-bold text-[#1E3A4C] text-right">
                    Rp5.000
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Baris Total yang Harus Dibayar */}
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-base md:text-lg font-extrabold text-[#1E3A4C]">
              Total yang harus dibayar
            </span>
            <span className="font-display text-xl md:text-2xl font-extrabold text-[#1E3A4C]">
              {isInpatient ? formatRupiah(inpatientTotal) : 'Rp15.000'}
            </span>
          </div>
        </div>

        {/* ================= KARTU 2: PILIHAN METODE PEMBAYARAN (TUNAI vs QRIS) ================= */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 md:p-6 shadow-[0_8px_30px_rgba(24,59,86,0.04)] mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Opsi 1: Tunai */}
            <button
              type="button"
              onClick={() => setPaymentMethod('tunai')}
              className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                paymentMethod === 'tunai'
                  ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#2C5E7A] shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="2"
                      y="6"
                      width="20"
                      height="12"
                      rx="2"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="12" r="2.5" strokeWidth="1.8" />
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.8"
                      d="M6 12h.01M18 12h.01"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                    Tunai
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    Bayar saat dokter tiba
                  </div>
                </div>
              </div>

              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                  paymentMethod === 'tunai'
                    ? 'border-[#2C5E7A] border-[5px] bg-white'
                    : 'border-slate-300 bg-white'
                }`}
              />
            </button>

            {/* Opsi 2: QRIS */}
            <button
              type="button"
              onClick={() => setPaymentMethod('qris')}
              className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                paymentMethod === 'qris'
                  ? 'bg-[#EBF2F7] border-[#2C5E7A]'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#2C5E7A] shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="1.8"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="1.8"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="1.8"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 18v3"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs md:text-sm font-bold text-[#1E3A4C] truncate">
                    QRIS
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    Scan & bayar
                  </div>
                </div>
              </div>

              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                  paymentMethod === 'qris'
                    ? 'border-[#2C5E7A] border-[5px] bg-white'
                    : 'border-slate-300 bg-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ================= BARIS BAWAH: KETERANGAN & TOMBOL KONFIRMASI ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
            Tunai dibayar saat dokter tiba. QRIS dibayar sebelum penugasan.
            Alamat dan telepon tetap perlu diisi.
          </p>

          <button
            type="button"
            onClick={handleConfirmPayment}
            className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-7 rounded-2xl text-xs md:text-sm inline-flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer shrink-0 min-w-[235px]"
          >
            <svg
              className="w-4 h-4 text-white shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                strokeWidth="2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 11V7a4 4 0 118 0v4"
              />
            </svg>
            <span>
              {paymentMethod === 'tunai'
                ? 'Konfirmasi tunai'
                : 'Konfirmasi QRIS'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}