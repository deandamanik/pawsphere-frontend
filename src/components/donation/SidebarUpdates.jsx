import { motion } from 'framer-motion';
import { FiClock, FiInfo } from 'react-icons/fi';

const shelterUpdates = [
  {
    id: 1,
    shelter: 'Shelter Harapan Hewan',
    campaignTitle: 'Operasi Darurat Rex',
    time: '2 jam yang lalu',
    status: 'Medis',
    statusColor: 'bg-amber-500 text-white',
    content: 'Rex sudah selesai menjalani operasi patah tulang belakang. Saat ini ia sedang dalam masa kritis pemulihan di ruang isolasi medis.',
  },
  {
    id: 2,
    shelter: 'Cat Haven Jakarta',
    campaignTitle: 'Renovasi Kandang Kucing',
    time: 'Yesterday',
    status: 'Fasilitas',
    statusColor: 'bg-emerald-500 text-white',
    content: 'Semen dan material besi untuk fondasi kandang baru blok B telah tiba di lokasi shelter. Pengerjaan fisik dimulai pagi ini.',
  },
  {
    id: 3,
    shelter: 'Paws for Life',
    campaignTitle: 'Sterilisasi 50 Kucing Kemang',
    time: '2 hari yang lalu',
    status: 'Selesai',
    statusColor: 'bg-brand-blue-normal text-white',
    content: '12 ekor kucing liar kloter pertama telah berhasil disterilkan dan dikembalikan ke area pekarangan aman Kemang setelah observasi.',
  },
];

const SidebarUpdates = () => {
  return (
    <div className="w-full lg:w-85 bg-white rounded-2xl border border-brand-blue-light-active p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-brand-blue-darker font-bold text-base tracking-tight">
          Kabar Shelter Terbaru
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="relative border-l border-brand-blue-light-active ml-2 pl-4 space-y-6">
        {shelterUpdates.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative space-y-1.5 group"
          >
            <div className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-blue-light-active border-2 border-white group-hover:bg-brand-blue-normal transition-colors duration-300" />

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="font-bold text-brand-blue-darker">
                {update.shelter}
              </span>
              <span className="text-brand-blue-normal/40">•</span>
              <span className="text-brand-blue-normal/60 flex items-center gap-1 font-medium">
                <FiClock size={11} /> {update.time}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide uppercase ${update.statusColor}`}>
                {update.status}
              </span>
              <span className="text-xs text-brand-blue-normal/60 font-semibold truncate max-w-45">
                {update.campaignTitle}
              </span>
            </div>

            <p className="text-brand-blue-darker/75 text-xs leading-relaxed font-medium bg-brand-blue-light/30 p-2.5 rounded-xl border border-brand-blue-light-active/50">
              {update.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-brand-blue-light-active flex items-start gap-2 text-[11px] text-brand-blue-normal/50 leading-normal font-medium">
        <FiInfo size={13} className="shrink-0 mt-0.5 text-brand-blue-normal/40" />
        <p>Seluruh informasi di atas diunggah langsung oleh penanggung jawab shelter yang bersangkutan secara berkala.</p>
      </div>
    </div>
  );
};

export default SidebarUpdates;