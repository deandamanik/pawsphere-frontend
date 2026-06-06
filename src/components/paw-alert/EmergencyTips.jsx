const EmergencyTips = () => {
  const tips = [
    'Jangan pindahkan hewan kecuali dalam bahaya langsung',
    'Hindari kontak langsung dengan mulut hewan luka',
    'Foto dari jarak aman terlebih dahulu',
    'Tetap di lokasi hingga tim shelter tiba',
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-brand-orange text-sm mb-3">⚠️ Tips Darurat</h3>
      <ul className="flex flex-col gap-2">
        {tips.map((tip, i) => (
          <li key={i} className="text-red-500 text-xs leading-snug">• {tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencyTips;