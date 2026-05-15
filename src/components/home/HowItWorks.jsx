const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Buat Profil Hewan",
      desc: "Daftarkan hewan peliharaanmu dengan foto, jenis, dan riwayat kesehatan.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      number: "2",
      title: "Ceritakan Gejala",
      desc: "Ketik atau ucapkan gejala, AI kami akan menganalisis secara instan.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      number: "3",
      title: "Dapatkan Panduan",
      desc: "Terima hasil triage, panduan pertolongan pertama, atau rekomendasi vet.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      number: "4",
      title: "Tindak Lanjut",
      desc: "Konsultasi dokter, beli obat, atau laporkan darurat dari satu platform.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-brand-blue-normal pb- rounded-b-[80px] md:rounded-b-[120px]">
      <div className="w-full bg-brand-blue-normal rounded-[80px] md:rounded-[120px] py-24 px-6 md:px-16 border-8 border-white shadow-sm relative z-20 ">

        <div className="text-center mb-18">
          <h2 className="text-white text-5xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-sm">
            Cara Kerja PawSphere
          </h2>
          <p className="text-white text-xl md:text-3xl font-semibold tracking-tight">
            Mulai dalam hitungan menit, bantu hewanmu kapanpun!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 bg-white rounded-[50px] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col items-center text-center px-10 py-20 
                ${index !== steps.length - 1 ? 'md:border-r border-gray-200 shadow-[20px_0_25px_-20px_rgba(0,0,0,0.15)]' : ''}`}
            >
              <div className="relative mb-12">
                <div className="w-24 h-24 bg-brand-blue-normal rounded-full flex items-center justify-center shadow-2xl border-4 border-white/10">
                  {step.icon}
                </div>
                <div className="absolute -right-2 top-0 w-12 h-12 bg-brand-blue-light border-4 border-white rounded-full flex items-center justify-center text-brand-blue-normal font-black text-xl shadow-lg">
                  {step.number}
                </div>
              </div>

              <h3 className="text-brand-blue-normal text-3xl font-bold mb-6 leading-none">
                {step.title}
              </h3>
              <p className="text-brand-blue-normal text-base md:text-md leading-relaxed font-semibold max-w-60">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;