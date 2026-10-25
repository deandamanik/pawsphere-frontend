import React, { useState, useRef } from "react";
import { CLINICS_DATA } from "../../data/clinicsData";
import ClinicHero from "../../components/clinic/ClinicHero";
import ClinicFilterBar from "../../components/clinic/ClinicFilterBar";
import ClinicCard from "../../components/clinic/ClinicCard";
import ClinicStepsSection from "../../components/clinic/ClinicStepsSection";

export default function Clinic() {
  const searchSectionRef = useRef(null);
  const [filters, setFilters] = useState({
    location: "Bali • Semua area",
    service: "Semua layanan",
    checkIn: "19 Okt 2026",
    checkOut: "22 Okt 2026",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Banner */}
      <ClinicHero onExploreClick={scrollToSearch} />

      {/* 2. Main Search & Clinic List */}
      <section ref={searchSectionRef} className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A4C] mb-6">
          Cari teman sehat untuk hewanmu
        </h2>

        <ClinicFilterBar
          filters={filters}
          onChange={handleFilterChange}
          onSearch={() => {}}
        />

        {/* Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-2 gap-2">
          <span className="text-sm md:text-base font-bold text-[#1E3A4C]">
            {CLINICS_DATA.length} klinik mitra di Bali
          </span>
          <span className="text-xs md:text-sm text-slate-500 cursor-pointer">
            Urutkan: Jarak terdekat ▾
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mb-6">
          Kapasitas tersedia untuk 19–22 Oktober 2026. Ketersediaan akhir ditentukan oleh masing-masing klinik.
        </p>

        {/* Grid 3 Klinik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {CLINICS_DATA.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>

      </section>

      {/* 3. Steps Section */}
      <ClinicStepsSection />
    </div>
  );
}