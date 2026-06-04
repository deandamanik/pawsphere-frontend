import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

const fmt = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}jt`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}rb`
    : `${n}`;

const DonationForm = ({ compact = false }) => {
  const [tab, setTab] = useState('uang');
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const total = selected ?? (custom ? parseInt(custom.replace(/\D/g, ''), 10) || 0 : 0);

  return (
    <div>
      <div className={`flex rounded-xl overflow-hidden border border-brand-blue-light-active mb-4 ${compact ? 'mb-4' : 'mb-5'}`}>
        <button
          onClick={() => setTab('uang')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'uang'
              ? 'bg-brand-blue-darker text-white'
              : 'bg-white text-brand-blue-darker/60 hover:bg-brand-blue-light'
          }`}
        >
          💰 Uang
        </button>
        <button
          onClick={() => setTab('barang')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'barang'
              ? 'bg-brand-blue-darker text-white'
              : 'bg-white text-brand-blue-darker/60 hover:bg-brand-blue-light'
          }`}
        >
          📦 Barang
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'uang' ? (
          <motion.div
            key="uang"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-3 gap-2">
              {AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelected(amt); setCustom(''); }}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                    selected === amt
                      ? 'bg-brand-blue-normal text-white border-brand-blue-normal'
                      : 'bg-white text-brand-blue-darker border-brand-blue-light-active hover:border-brand-blue-normal'
                  }`}
                >
                  {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-blue-darker/50">
                Rp
              </span>
              <input
                type="text"
                value={custom}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setCustom(raw ? parseInt(raw).toLocaleString('id-ID') : '');
                  setSelected(null);
                }}
                placeholder="Jumlah lainnya"
                className="w-full pl-8 pr-4 py-2.5 border border-brand-blue-light-active rounded-lg text-sm
                          text-brand-blue-darker placeholder:text-brand-blue-darker/40
                          focus:outline-none focus:border-brand-blue-normal bg-white"
              />
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama (opsional, boleh anonim)"
              className="w-full px-4 py-2.5 border border-brand-blue-light-active rounded-lg text-sm
                        text-brand-blue-darker placeholder:text-brand-blue-darker/40
                        focus:outline-none focus:border-brand-blue-normal bg-white"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pesan dukungan..."
              rows={compact ? 2 : 3}
              className="w-full px-4 py-2.5 border border-brand-blue-light-active rounded-lg text-sm
                        text-brand-blue-darker placeholder:text-brand-blue-darker/40
                        focus:outline-none focus:border-brand-blue-normal bg-white resize-none"
            />

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white
                        font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <FiHeart size={15} />
              Donasi{total > 0 ? ` Rp ${fmt(total)}` : ' Rp 0'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="barang"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <textarea
              placeholder="Deskripsikan barang yang ingin didonasikan..."
              rows={3}
              className="w-full px-4 py-2.5 border border-brand-blue-light-active rounded-lg text-sm
                        text-brand-blue-darker placeholder:text-brand-blue-darker/40
                        focus:outline-none focus:border-brand-blue-normal bg-white resize-none"
            />
            <input
              type="text"
              placeholder="Nama (opsional, boleh anonim)"
              className="w-full px-4 py-2.5 border border-brand-blue-light-active rounded-lg text-sm
                        text-brand-blue-darker placeholder:text-brand-blue-darker/40
                        focus:outline-none focus:border-brand-blue-normal bg-white"
            />
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white
                        font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <FiHeart size={15} />
              Kirim Donasi Barang
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DonationForm;