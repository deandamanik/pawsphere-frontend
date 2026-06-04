import { HiCheckCircle } from 'react-icons/hi2';

const PetSuccessStage = ({ onClose }) => {
  const statusSteps = [
    { label: 'Permohonan diterima', done: true },
    { label: 'Review oleh shelter', done: false },
    { label: 'Dihubungi', done: false },
    { label: 'Proses survey', done: false },
  ];

  return (
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-3 shadow-inner">
        <HiCheckCircle className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900">Permohonan Terkirim!</h3>
      <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
        Tim shelter akan menghubungi kamu dalam 2-3 hari kerja.
      </p>

      <div className="w-full max-w-xs bg-slate-50 border border-slate-100 rounded-xl p-4 my-5 flex flex-col gap-3">
        {statusSteps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3 text-left">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
              step.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              {step.done && '✓'}
            </div>
            <span className={`text-xs font-semibold ${step.done ? 'text-slate-800' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="w-full max-w-xs py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
      >
        Tutup
      </button>
    </div>
  );
};

export default PetSuccessStage;