import { useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiUsers, FiClock, FiHeart, FiArrowLeft } from 'react-icons/fi';

const AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

const fmt = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}jt`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}rb`
    : `${n}`;

const DonationForm = ({ campaign, onBack }) => {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const total = selected ?? (custom ? parseInt(custom.replace(/\D/g, ''), 10) || 0 : 0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-12 min-h-screen" 
    >
      <div className="mb-8 flex justify-start">
        <button 
          onClick={onBack}
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-brand-blue-light-active bg-white text-sm font-bold text-brand-blue-darker shadow-xs transition-all duration-200 hover:bg-brand-blue-light/20 hover:border-brand-blue-normal"
        >
          <FiArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Kembali ke Daftar Kampanye
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <div>
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-brand-blue-light-active aspect-16/10 bg-gray-100">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white ${campaign.urgencyColor}`}>
                {campaign.urgency === 'Kritis' && <FiAlertTriangle size={11} />}
                {campaign.urgency}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {campaign.tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/90 border border-gray-200 text-xs font-semibold text-brand-blue-darker shadow-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white rounded-3xl p-6 border border-brand-blue-light-active/60 shadow-xs text-center">
            <p className="text-brand-blue-normal font-semibold text-base mb-1">{campaign.shelter}</p>
            <h2 className="text-brand-blue-darker font-extrabold text-2xl leading-snug mb-3">
              {campaign.title}
            </h2>
            <p className="text-brand-blue-darker/70 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-6">
              {campaign.description}
            </p>

            <div className="flex items-center justify-between text-xs font-bold text-brand-blue-normal mb-1.5 px-1">
              <span>Terkumpul</span>
              <span>{campaign.progress}%</span>
            </div>
            <div className="w-full h-3 bg-brand-blue-light-active rounded-full mb-4">
              <div
                className="h-3 rounded-full bg-brand-blue-normal transition-all duration-700"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <div className="text-left">
                <span className="font-extrabold text-brand-blue-normal text-sm">{campaign.collected}</span>
                <span className="text-brand-blue-normal/50 font-medium"> / {campaign.target}</span>
              </div>
              <div className="text-right flex items-center gap-4 text-brand-blue-normal/60 font-semibold">
                <span className="flex items-center gap-1"><FiUsers size={12} /> {campaign.donors} donatur</span>
                <span className="flex items-center gap-1"><FiClock size={12} /> {campaign.daysLeft} hari lagi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-brand-blue-light-active/60 p-8 shadow-xs flex flex-col items-center min-h-127.5">
          <h3 className="text-brand-blue-darker font-black text-2xl tracking-tight mb-6 text-center">
            Formulir Donasi
          </h3>

          <div className="w-full grid grid-cols-3 gap-3 mb-4">
            {AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => { setSelected(amt); setCustom(''); }}
                className={`py-3 px-2 rounded-xl text-center font-bold text-sm border transition-all duration-200 ${
                  selected === amt
                    ? 'bg-brand-blue-normal text-white border-brand-blue-normal shadow-xs'
                    : 'bg-white text-brand-blue-darker border-gray-200 hover:border-brand-blue-light-active hover:bg-brand-blue-light/20'
                }`}
              >
                {amt.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

          <div className="w-full space-y-3.5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-blue-darker/50">
                Rp
              </span>
              <input
                type="text"
                value={custom}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setCustom(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                  setSelected(null);
                }}
                placeholder="Jumlah lainnya"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                          text-brand-blue-darker placeholder:text-brand-blue-darker/40
                          focus:outline-none focus:border-brand-blue-normal bg-gray-50/30 font-medium"
              />
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama (opsional, boleh anonim)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                        text-brand-blue-darker placeholder:text-brand-blue-darker/40
                        focus:outline-none focus:border-brand-blue-normal bg-gray-50/30 font-medium"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pesan dukungan..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                        text-brand-blue-darker placeholder:text-brand-blue-darker/40
                        focus:outline-none focus:border-brand-blue-normal bg-gray-50/30 resize-none font-medium"
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-brand-blue-normal hover:bg-brand-blue-dark-hover text-white
                        font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors mt-2 shadow-sm"
            >
              <FiHeart size={15} />
              Donasi{total > 0 ? ` Rp ${fmt(total)}` : ' Rp 0'}
            </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default DonationForm;