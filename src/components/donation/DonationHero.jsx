import { FiHeart } from 'react-icons/fi';

const DonationHero = () => {
  const stats = [
    { value: 'Rp 2.1 Miliar+', label: 'Dana Tersalurkan' },
    { value: '12,400+', label: 'Donatur Aktif' },
    { value: '180+', label: 'Kampanye Selesai' },
    { value: '100%', label: 'Laporan Transparan' },
  ];

  return (
    <section className="bg-linear-to-b from-brand-blue-light to-white pt-10 pb-12 text-center">
      <div className="inline-flex items-center gap-2 bg-brand-blue-darker text-white text-xs font-semibold px-4 py-2 rounded-full mb-5">
        <FiHeart size={13} className="text-red-300" />
        Donasi Transparan &amp; Terpercaya
      </div>

      <h1 className="text-4xl font-bold text-brand-blue-darker mb-3">Care Funding</h1>
      <p className="text-brand-blue-darker/65 text-sm max-w-md mx-auto leading-relaxed mb-8 px-4">
        Bantu hewan yang membutuhkan. Setiap donasi dilaporkan secara
        transparan dengan bukti dan pembaruan langsung dari shelter.
      </p>

      <div className="flex items-center justify-center gap-10 flex-wrap px-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-brand-blue-darker font-bold text-lg">{value}</p>
            <p className="text-brand-blue-normal text-xs font-medium">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DonationHero;