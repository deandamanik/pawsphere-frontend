import { FiCheckCircle, FiHeart, FiImage } from 'react-icons/fi';

const shelterUpdates = [
  {
    date: '3 Mei',
    text: 'Rex berhasil melewati operasi dan dalam pemulihan',
    hasPhoto: true,
  },
  {
    date: '1 Mei',
    text: 'Operasi dijadwalkan oleh drh. Sari Dewi',
    hasPhoto: false,
  },
  {
    date: '29 Apr',
    text: 'Dana operasi terkumpul 75%, terima kasih!',
    hasPhoto: true,
  },
];

const SidebarUpdates = () => (
  <div className="flex flex-col gap-5 sticky top-24">
    <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-brand-blue-darker font-bold text-sm">
          Ledger Transparansi
        </h3>
        <button className="text-brand-blue-normal text-xs font-semibold hover:opacity-70 transition-opacity">
          Tampilkan
        </button>
      </div>
      <div className="bg-brand-blue-darker rounded-xl p-4">
        <div className="flex items-start gap-2 mb-2">
          <FiCheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
          <p className="text-white text-xs font-semibold leading-snug">
            Semua pengeluaran tercatat &amp; diverifikasi
          </p>
        </div>
        <p className="text-white/60 text-xs pl-5">
          3 pembaruan transaksi terbaru tersedia
        </p>
      </div>
    </div>

    {/* Update Terbaru Shelter */}
    <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-5">
      <h3 className="text-brand-blue-darker font-bold text-sm mb-4">
        Update Terbaru Shelter
      </h3>
      <div className="flex flex-col gap-4">
        {shelterUpdates.map((upd, i) => (
          <div key={i} className="flex gap-3">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-brand-blue-light flex items-center justify-center shrink-0">
                <FiHeart size={12} className="text-brand-blue-normal" />
              </div>
              {i < shelterUpdates.length - 1 && (
                <div className="w-px flex-1 bg-brand-blue-light-active mt-1" />
              )}
            </div>
            {/* Content */}
            <div className="pb-4">
              <p className="text-brand-blue-darker/50 text-xs mb-0.5">{upd.date}</p>
              <p className="text-brand-blue-darker text-xs font-medium leading-snug">
                {upd.text}
              </p>
              {upd.hasPhoto && (
                <button className="mt-1 text-brand-blue-normal text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity">
                  <FiImage size={11} />
                  Foto tersedia
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SidebarUpdates;