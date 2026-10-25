import React from 'react';

export default function ClinicServiceCard({ type, service }) {
  const isHospital = type === 'hospitalization';

  return (
    <div className="bg-[#EEF4F8] rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <div className="text-[#2C5E7A] mb-3.5">
          {isHospital ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-[#1E3A4C] mb-2">
          {service.name}
        </h3>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-5">
          {service.description}
        </p>
      </div>

      <div>
        <div className="text-lg md:text-xl font-bold text-[#1E3A4C] mb-3.5">
          {service.priceFormatted}
        </div>
        <span className="inline-block bg-[#E1ECF2] text-[#1E3A4C] text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full">
          {service.available} dari {service.total} tempat tersedia
        </span>
      </div>
    </div>
  );
}