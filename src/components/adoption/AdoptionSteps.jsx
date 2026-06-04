const AdoptionSteps = () => {
  const steps = [
    { no: 1, title: 'Ajukan Permohonan', desc: 'Isi formulir adopsi online' },
    { no: 2, title: 'Review oleh Shelter', desc: 'Tim shelter akan mengevaluasi' },
    { no: 3, title: 'Dihubungi', desc: 'Koordinasi jadwal kunjungan' },
    { no: 4, title: 'Proses Survey', desc: 'Survey rumah dan wawancara' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      {steps.map((step, index) => (
        <div key={step.no} className="flex-1 flex items-center gap-4">
          
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full bg-brand-blue-normal text-white flex items-center justify-center font-extrabold text-sm shadow-inner">
              {step.no}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-md font-semibold text-gray-900">{step.title}</h4>
              <p className="text-xs text-gray-400 font-medium">{step.desc}</p>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className="hidden md:block shrink-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={3} 
                stroke="currentColor" 
                className="w-3 h-3 text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default AdoptionSteps;