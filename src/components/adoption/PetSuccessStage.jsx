import { HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';

const PetSuccessStage = ({ onClose }) => {
  const statusSteps = [
    { label: 'Permohonan diterima', done: true },
    { label: 'Review oleh shelter', done: false },
    { label: 'Dihubungi', done: false },
    { label: 'Proses survey', done: false },
  ];

  return (
    <div className="flex flex-col items-center text-center py-2 font-poppins text-slate-800">
      <div className="w-16 h-16 bg-[#eef5f9] rounded-full flex items-center justify-center text-brand-blue-normal mb-4">
        <HiOutlineCheckCircle className="w-10 h-10 stroke-[2.2]" />
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Permohonan Terkirim!</h3>
      <p className="text-sm text-gray-400 mt-1.5 max-w-md font-medium leading-relaxed">
        Tim shelter akan menghubungi kamu dalam 2-3 hari kerja.
      </p>

      <div className="w-full flex flex-col gap-2.5 my-6">
        {statusSteps.map((step, idx) => (
          <div 
            key={idx} 
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all ${
              step.done 
                ? 'bg-[#eef5f9]/60 border-[#e2edf3] text-brand-blue-normal' 
                : 'bg-gray-50/70 border-gray-100 text-gray-400'
            }`}
          >
            {step.done ? (
              <HiOutlineCheckCircle className="w-5 h-5 text-brand-blue-normal shrink-0 stroke-[2.2]" />
            ) : (
              <HiOutlineClock className="w-5 h-5 text-gray-300 shrink-0" />
            )}
            
            <span className={`text-sm font-semibold ${step.done ? 'text-brand-blue-normal' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="w-full py-3.5 bg-brand-blue-normal hover:bg-[#2e5d79] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-slate-900/5 active:scale-[0.98]"
      >
        Selesai
      </button>
    </div>
  );
};

export default PetSuccessStage;