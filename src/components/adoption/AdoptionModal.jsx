import { IoClose } from 'react-icons/io5';

const AdoptionModal = ({ isOpen, onClose, pet, children }) => {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="relative h-48 w-full bg-gray-100 shrink-0">
          <img 
            src={pet.image} 
            alt={pet.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AdoptionModal;