const Stats = () => {
  const statsData = [
    { label: "Hewan Diselamatkan", value: "12,500+" },
    { label: "Dokter Terverifikasi", value: "350+" },
    { label: "Shelter Partner", value: "180+" },
    { label: "Dana Tersalurkan", value: "Rp 2.1M" },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-4">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <h2 className="text-brand-blue-normal text-4xl md:text-5xl font-black mb-2">
                {stat.value}
              </h2>
              <p className="text-brand-blue-normal font-medium text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;