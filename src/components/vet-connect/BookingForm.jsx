import { useState } from "react";
import { motion } from "framer-motion";
import { LuUser, LuMail, LuPhone, LuMapPin, LuCalendar } from "react-icons/lu";
import { PiPawPrintFill } from "react-icons/pi";
import PaymentMethod from "../ui/PaymentMethod";

const BookingForm = ({ doctor, onSuccess, onCancel }) => {
  // Data Diri
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Data Hewan Peliharaan
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petAge, setPetAge] = useState("");
  const [complaint, setComplaint] = useState("");

  // Payment
  const [selectedMethod, setSelectedMethod] = useState("");

  const consultationType = "Chat";
  const duration = "30 min";
  const price = doctor.price;
  const totalPayment = price;

  const isFormValid =
    fullName.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    petName.trim() !== "" &&
    petType.trim() !== "" &&
    petAge.trim() !== "" &&
    selectedMethod !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSuccess({
      fullName,
      phone,
      email,
      address,
      petName,
      petType,
      petAge,
      complaint,
      consultationType,
      duration,
      price,
      paymentMethod: selectedMethod,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onCancel}
            className="text-brand-blue-normal hover:text-brand-blue-dark font-semibold text-sm mb-4 flex items-center gap-2"
          >
            ← Kembali
          </button>
          <h1 className="text-2xl font-bold text-slate-800">
            Form Booking Konsultasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lengkapi field di bawah ini
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Data Diri */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <LuUser className="w-5 h-5 text-brand-blue-normal" />
                <h2 className="text-lg font-bold text-slate-800">Data Diri</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Masukkan informasi pribadi Anda
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="adwasd"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0129310231"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="asd@213@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Alamat lengkap"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Data Hewan Peliharaan */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <PiPawPrintFill className="w-5 h-5 text-brand-blue-normal" />
                <h2 className="text-lg font-bold text-slate-800">
                  Data Hewan Peliharaan
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Informasi tentang hewan kesayangan Anda
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Hewan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="adwasdwa"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Jenis Hewan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Usia Hewan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Keluhan / Catatan
                  </label>
                  <textarea
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="Jelaskan kondisi atau keluhan hewan peliharaan Anda"
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-brand-blue-normal focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <PaymentMethod
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
              />
            </div>
          </div>

          {/* Ringkasan Booking - Sticky */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Ringkasan Booking
              </h3>

              {/* Doctor Info */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate">
                    {doctor.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Jenis Konsultasi:</span>
                  <span className="font-semibold text-slate-800">
                    {consultationType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Durasi:</span>
                  <span className="font-semibold text-slate-800">
                    {duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Biaya Konsultasi:</span>
                  <span className="font-semibold text-slate-800">
                    Rp {price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-slate-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-800">
                    Total Pembayaran:
                  </span>
                  <span className="text-xl font-bold text-brand-blue-normal">
                    Rp {totalPayment.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-blue-800 leading-relaxed">
                  Setelah pembayaran, Anda dapat langsung chat dengan dokter
                  melalui dashboard Anda.
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                  isFormValid
                    ? "bg-brand-blue-normal hover:bg-brand-blue-normal-hover shadow-sm"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                Lanjut ke Pembayaran
              </button>

              {!isFormValid && (
                <p className="text-xs text-center text-slate-500 mt-2">
                  Lengkapi semua field yang wajib diisi
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
