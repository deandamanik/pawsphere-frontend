import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CLINICS_DATA } from '../../data/clinicsData';
import ClinicGallery from '../../components/clinic/ClinicGallery';
import ClinicServiceCard from "../../components/clinic/ClinicServiceCard";
import ClinicDoctorCard from "../../components/clinic/ClinicDoctorCard";
import ClinicProductCard from "../../components/clinic/ClinicProductCard";
import ClinicBookingSidebar from "../../components/clinic/ClinicBookingSidebar";

export default function ClinicDetail() {
  const { id } = useParams();
  const clinic = CLINICS_DATA.find((c) => c.id === id) || CLINICS_DATA[0];
  const [activeTab, setActiveTab] = useState("Tentang");

  const tabs = ["Tentang", "Layanan", "Dokter", "Produk"];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 clinic-poppins">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <span>Layanan</span>
          <span>/</span>
          <Link to="/clinic" className="hover:text-slate-600">Clinic</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">{clinic.name}</span>
        </nav>

        {/* Gallery 3 Foto */}
        <ClinicGallery images={clinic.gallery} clinicName={clinic.name} />

        {/* Header Nama Klinik & Badge Mitra */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-7 border-b border-slate-200/80 mb-7">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A4C] mb-2.5">
              {clinic.name}
            </h1>
            <p className="text-base md:text-lg font-medium text-slate-600 mb-1">
              {clinic.address}
            </p>
            <p className="text-sm text-slate-400">
              Buka setiap hari • {clinic.hours} • {clinic.distance} dari lokasi pilihan
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#EEF4F8] text-[#2C5E7A] px-4 py-2 rounded-full text-sm font-semibold self-start">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{clinic.badge}</span>
          </div>
        </div>

        {/* Layout 2 Kolom: Kiri (Konten) & Kanan (Sidebar Reservasi) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri (8 Kolom) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Anchor Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200/80 text-base font-bold">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3.5 transition cursor-pointer ${
                    activeTab === tab
                      ? "text-[#1E3A4C] border-b-2 border-[#1E3A4C]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Section 1: Tentang */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E3A4C] mb-3.5">
                Tentang {clinic.name.replace("Klinik ", "")}
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-5">
                {clinic.about}
              </p>
              <div className="flex flex-wrap gap-3">
                {clinic.highlights.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-[#EEF4F8] text-[#1E3A4C] text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 2: Layanan & Kapasitas */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E3A4C] mb-1">
                Layanan & kapasitas klinik
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Untuk 19–22 Oktober 2026 • kapasitas milik {clinic.name}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <ClinicServiceCard
                  type="hospitalization"
                  service={clinic.services.hospitalization}
                />
                <ClinicServiceCard
                  type="boarding"
                  service={clinic.services.boarding}
                />
              </div>

              {/* Catatan Info Medis */}
              <div className="bg-[#FFF8F1] border border-[#FDE6CE] rounded-xl p-4 flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="text-[#FF6B1A] font-bold text-base mt-0.5">ⓘ</span>
                <p>
                  Rawat inap memerlukan penilaian medis dan konfirmasi klinik. Untuk kondisi darurat, hubungi klinik langsung.
                </p>
              </div>
            </div>

            {/* Section 3: Dokter */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E3A4C] mb-5">
                Dokter di {clinic.name.replace("Klinik ", "")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {clinic.doctors.map((doctor) => (
                  <ClinicDoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>

            {/* Section 4: Produk */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E3A4C] mb-1">
                Produk dari {clinic.name.replace("Klinik ", "")}
              </h2>
              <p className="text-sm text-slate-400 mb-5">
                Stok dan penjualan dikelola oleh klinik ini, bukan seluruh mitra PawSphere.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clinic.products.map((product) => (
                  <ClinicProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan (4 Kolom): Sidebar Reservasi & Kontak */}
          <div className="lg:col-span-4">
            <ClinicBookingSidebar clinic={clinic} />
          </div>
        </div>

        <p className="text-sm text-slate-400 mt-12">
          Data klinik, kapasitas, dokter, dan harga pada halaman ini bersifat ilustratif.
        </p>
      </div>
    </div>
  );
}