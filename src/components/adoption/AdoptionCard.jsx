import { HiOutlineCalendar, HiOutlineMapPin } from 'react-icons/hi2';
import { BiMaleFemale } from 'react-icons/bi';
import { IoHeartOutline } from 'react-icons/io5'; 
import Button from '../ui/Button'; 

const AdoptionCard = ({ pet, onActionClick }) => {
  const getTypeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case 'anjing':
        return 'text-teal-600 bg-teal-50/80';
      case 'kucing':
        return 'text-cyan-600 bg-cyan-50/80';
      default:
        return 'text-amber-600 bg-amber-50/80';
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col border border-gray-100/80">
      <div className="relative h-52 w-full bg-gray-100">
        <img 
          src={pet.image} 
          alt={pet.name} 
          className="w-full h-full object-cover"
        />
        
        <span className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          Siap Adopsi
        </span>
        
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-brand-red-normal transition-colors shadow-sm group">
          <IoHeartOutline className="w-4 h-4 transition-transform group-hover:scale-110" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{pet.name}</h3>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${getTypeStyles(pet.type)}`}>
              {pet.type}
            </span>
          </div>

          <p className="text-xs text-gray-400 font-medium mb-3">{pet.breed}</p>

          <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mb-4">
            <div className="flex items-center gap-1">
              <HiOutlineCalendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{pet.age}</span>
            </div>
            <div className="flex items-center gap-1">
              <BiMaleFemale className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{pet.gender}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <HiOutlineMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{pet.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {pet.tags.map((tag, i) => {
              const isWarning = tag.toLowerCase().includes('perlu') || tag.toLowerCase().includes('rawat');
              return (
                <span 
                  key={i} 
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                    isWarning 
                      ? 'bg-amber-50/60 text-amber-600 border-amber-100' 
                      : 'bg-emerald-50/60 text-emerald-600 border-emerald-100'
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 font-medium mb-5">
            Shelter: <span className="text-gray-600 font-semibold">{pet.shelter}</span>
          </p>
        </div>

        <Button 
          variant="blue" 
          onClick={onActionClick}
          className="w-full py-2.5! rounded-xl! text-xs font-bold tracking-wide"
        >
          Ajukan Adopsi
        </Button>
      </div>
    </div>
  );
};

export default AdoptionCard;