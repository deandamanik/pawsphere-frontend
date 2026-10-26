import { useNavigate } from 'react-router-dom';

export default function ClinicCard({ clinic }) {
  const navigate = useNavigate();
  const { hospitalization, boarding } = clinic.services;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Gambar Klinik */}
        <div className="h-52 w-full bg-slate-100 overflow-hidden relative">
          <img
            src={clinic.image}
            alt={clinic.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body Card */}
        <div className="p-5 md:p-6">
          {/* Badge Mitra */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-[#2C5E7A] mb-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{clinic.badge}</span>
          </div>

          <h3 className="text-xl font-bold text-[#1E3A4C] mb-1.5">{clinic.name}</h3>
          <p className="text-xs md:text-sm text-slate-500 mb-4">
            {clinic.area} • {clinic.distance} • {clinic.hours}
          </p>

          {/* Kotak Kapasitas */}
          <div className="bg-[#EEF4F8] rounded-xl p-4 space-y-3 mb-4">
            <div>
              <span className="block text-xs text-slate-500 mb-0.5">Pet Hospitalization</span>
              <span className="text-sm md:text-base font-bold text-[#1E3A4C]">
                {hospitalization.isFull
                  ? `Penuh • ${hospitalization.available} dari ${hospitalization.total}`
                  : `${hospitalization.available} dari ${hospitalization.total} tempat`}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 mb-0.5">Pet Boarding</span>
              <span className="text-sm md:text-base font-bold text-[#1E3A4C]">
                {boarding.available} dari {boarding.total} tempat
              </span>
            </div>
          </div>

          {/* Harga */}
          <div>
            <span className="block text-xs text-slate-400 mb-0.5">Pet Boarding mulai</span>
            <span className="text-base md:text-lg font-bold text-[#1E3A4C]">{clinic.startingPrice}</span>
          </div>
        </div>
      </div>

      {/* Footer Tombol */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate(`/clinic/${clinic.id}`)}
          className="bg-[#E6EFF5] hover:bg-[#d8e6ef] text-[#1E3A4C] font-semibold py-3 rounded-xl text-sm transition cursor-pointer"
        >
          Lihat profil
        </button>
        <button
          type="button"
          disabled
          className="bg-[#FF6B1A] text-white font-semibold py-3 rounded-xl text-sm transition cursor-not-allowed opacity-70"
        >
          Reservasi
        </button>
      </div>
    </div>
  );
}