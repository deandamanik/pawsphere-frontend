import { useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import PaymentMethod from '../../components/ui/PaymentMethod';

const AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

const fmt = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}jt`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}rb`
    : `${n}`;

const DonationForm = ({  onSuccess }) => {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const total = selected ?? (custom ? parseInt(custom.replace(/\D/g, ''), 10) || 0 : 0);
  const isFormValid = total > 0 && selectedMethod !== '';

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSuccess(total);
  };

  return (
    <div className="w-full space-y-4">
      <div className="w-full grid grid-cols-3 gap-3 mb-2">
        {AMOUNTS.map((amt) => {
          const isSelected = selected === amt;
          return (
            <button
              type="button"
              key={amt}
              onClick={() => { 
                setSelected(amt); 
                setCustom(amt.toLocaleString('id-ID')); 
              }}
              className={`relative isolate py-3 px-2 rounded-xl text-center font-bold text-sm border transition-colors duration-200 ${
                isSelected
                  ? 'text-white border-brand-blue-normal'
                  : 'bg-white text-brand-blue-darker border-gray-200 hover:border-brand-blue-light-active hover:bg-brand-blue-light/20'
              }`}
            >
              <span className="relative z-10">{amt.toLocaleString('id-ID')}</span>
              {isSelected && (
                <motion.div
                  layoutId="activeAmountBg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-brand-blue-normal rounded-xl -z-10 shadow-sm"
                />
              )}
            </button>
          );
        })}
      </div>

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
        rows={3}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                  text-brand-blue-darker placeholder:text-brand-blue-darker/40
                  focus:outline-none focus:border-brand-blue-normal bg-gray-50/30 resize-none font-medium"
      />

      <div className="pt-2 border-t border-gray-100 w-full">
        <PaymentMethod 
          selectedMethod={selectedMethod} 
          onSelectMethod={setSelectedMethod} 
        />
      </div>

      <motion.button
        whileHover={!isFormValid ? {} : { scale: 1.01 }}
        whileTap={!isFormValid ? {} : { scale: 0.99 }}
        disabled={!isFormValid}
        onClick={handleSubmitDonation}
        className="w-full bg-brand-blue-normal hover:bg-brand-blue-dark-hover disabled:opacity-40 text-white
                  font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors mt-4 shadow-sm"
      >
        <FiHeart size={15} />
        Donasi{total > 0 ? ` Rp ${fmt(total)}` : ' Rp 0'}
      </motion.button>
    </div>
  );
};

export default DonationForm;