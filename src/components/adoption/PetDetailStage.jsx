import { HiOutlineMapPin, HiStar } from 'react-icons/hi2';
import { IoHeartOutline } from 'react-icons/io5';
import { BsShieldCheck, BsPatchCheck, BsHeartPulse } from 'react-icons/bs';

const PetDetailStage = ({ pet, onNext }) => {
  const medicalTags = pet?.tags || ['Sudah Divaksinasi', 'Sudah Disteril', 'Sehat'];
  const personalities = ['Ramah', 'Energik', 'Suka bermain', 'Loyal'];

  const getMedicalStyle = (tag) => {
    const text = tag.toLowerCase();
    if (text.includes('vaksin')) return 'text-emerald-600 bg-emerald-50 border-emerald-100/50';
    if (text.includes('steril')) return 'text-blue-600 bg-blue-50 border-blue-100/50';
    return 'text-teal-600 bg-teal-50 border-teal-100/50';
  };

  const getMedicalIcon = (tag) => {
    const text = tag.toLowerCase();
    if (text.includes('vaksin')) return <BsShieldCheck className="w-3.5 h-3.5" />;
    if (text.includes('steril')) return <BsPatchCheck className="w-3.5 h-3.5" />;
    return <BsHeartPulse className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex flex-col h-full font-poppins">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{pet?.name}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {pet?.breed} &middot; {pet?.age} &middot; {pet?.gender}
          </p>
        </div>
        <div className="flex gap-0.5 text-amber-400 pt-1.5">
          {[...Array(5)].map((_, index) => (
            <HiStar key={index} className="w-4 h-4" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 mb-4">
        {medicalTags.map((tag, idx) => (
          <span 
            key={idx} 
            className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${getMedicalStyle(tag)}`}
          >
            {getMedicalIcon(tag)}
            {tag}
          </span>
        ))}
      </div>

      <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 mb-4">
        <h4 className="text-xs font-bold text-slate-900 mb-1.5">Kisah {pet?.name}</h4>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">
          {pet?.name} ditemukan di tepi jalan dalam kondisi kurus dan ketakutan. Setelah {pet?.id === 2 ? '1.5' : '3'} bulan perawatan di shelter, ia kini menjadi hewan yang ceria, energetik, dan sangat menyukai interaksi dengan manusia.
        </p>
      </div>

      <div className="mb-5">
        <h4 className="text-xs font-bold text-slate-900 mb-2">Kepribadian</h4>
        <div className="flex flex-wrap gap-2">
          {personalities.map((trait) => (
            <span 
              key={trait} 
              className="text-[11px] font-bold px-3 py-1 bg-teal-50/30 border border-teal-100/40 rounded-full text-teal-600/90"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-5 px-0.5">
        <HiOutlineMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>
          {pet?.location} - <span className="text-gray-400 font-medium">{pet?.shelter}</span>
        </span>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-3.5 bg-brand-blue-normal hover:bg-[#2e5d79] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 active:scale-[0.98]"
      >
        <IoHeartOutline className="w-4 h-4 text-white stroke-[3px]" />
        Ajukan Adopsi untuk {pet?.name}
      </button>
    </div>
  );
};

export default PetDetailStage;