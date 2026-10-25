import React from 'react';

export default function ClinicDoctorCard({ doctor }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={doctor.avatar}
        alt={doctor.name}
        className="w-16 h-16 rounded-full object-cover bg-slate-200 shrink-0"
      />
      <div>
        <h4 className="text-base md:text-lg font-bold text-[#1E3A4C]">
          {doctor.name}
        </h4>
        <p className="text-sm text-slate-500 mt-0.5">{doctor.role}</p>
        <p className="text-sm text-slate-400 mt-0.5">{doctor.schedule}</p>
      </div>
    </div>
  );
}