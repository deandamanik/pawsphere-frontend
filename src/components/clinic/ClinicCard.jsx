import React from 'react';

export default function ClinicCard({ clinic }) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden p-4 flex flex-col justify-between">
      <div>
        <img src={clinic.image} alt={clinic.name} className="w-full h-48 object-cover rounded-xl mb-4" />
        <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md">Mitra PawSphere</span>
        <h3 className="text-lg font-bold text-gray-800 mt-2">{clinic.name}</h3>
        <p className="text-xs text-gray-500 mb-4">{clinic.location} • {clinic.distance} • {clinic.hours}</p>

        {/* Informasi Kapasitas */}
        <div className="bg-gray-50 p-3 rounded-xl mb-4 text-xs space-y-2">
          <div>
            <p className="text-gray-500">Pet Hospitalization</p>
            <p className="font-bold text-gray-800">{clinic.hospitalization}</p>
          </div>
          <div>
            <p className="text-gray-500">Pet Boarding</p>
            <p className="font-bold text-gray-800">{clinic.boarding}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Pet Boarding mulai</p>
        <p className="text-sm font-bold text-gray-800 mb-4">{clinic.price}</p>
        
        <div className="flex gap-2">
          <button className="flex-1 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl">Lihat profil</button>
          <button className="flex-1 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl">Reservasi</button>
        </div>
      </div>
    </div>
  );
}