import { HiOutlineCalendar, HiOutlineMapPin } from 'react-icons/hi2';
import { BiMaleFemale } from 'react-icons/bi';

const PetDetailStage = ({ pet, onNext }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{pet.name}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{pet.breed}</p>
        </div>
        <div className="text-amber-400 text-sm flex gap-0.5">⭐⭐⭐⭐⭐</div>
      </div>
      <div className="flex items-center gap-4 text-xs font-semibold text-emerald-600 mb-4">
        <span className="bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
          <HiOutlineCalendar className="w-3.5 h-3.5" /> {pet.age}
        </span>
        <span className="bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
          <BiMaleFemale className="w-3.5 h-3.5" /> {pet.gender}
        </span>
      </div>

      <div className="mb-5">
        <h4 className="text-sm font-bold text-slate-800 mb-1">Kisah {pet.name}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Max ditemukan di tepi jalan dalam kondisi kurus dan ketakutan. Setelah 2 bulan perawatan di shelter, ia kini menjadi anjing yang sangat energik, ceria, dan sangat menyukai interaksi dengan manusia.
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-800 mb-2">Kepribadian</h4>
        <div className="flex flex-wrap gap-2">
          {['Ramah', 'Energik', 'Suka Bermain', 'Lincah'].map((trait) => (
            <span key={trait} className="text-[11px] font-medium px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-600">
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-6">
        <HiOutlineMapPin className="w-4 h-4 text-gray-400" />
        <span>Lokasi Penjemputan: <span className="text-gray-600 font-semibold">{pet.location}</span></span>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-3 bg-brand-blue-normal hover:bg-[#2e5d79] text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-blue-900/10"
      >
        Ajukan Adopsi untuk {pet.name}
      </button>
    </div>
  );
};

export default PetDetailStage;