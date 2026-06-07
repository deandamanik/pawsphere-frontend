import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { IoWalletOutline } from 'react-icons/io5';
import { RiBankLine } from 'react-icons/ri';

const PaymentMethod = ({ selectedMethod, onSelectMethod }) => {
  const [activeGroup, setActiveGroup] = useState(null);

  const paymentGroups = [
    {
      id: 'bank',
      title: 'Transfer Bank',
      desc: 'BCA, Mandiri, BNI, BRI',
      icon: <RiBankLine size={18} />,
      options: ['BCA Virtual Account', 'Mandiri Virtual Account', 'BNI Virtual Account', 'BRI Virtual Account']
    },
    {
      id: 'qris',
      title: 'QRIS',
      desc: 'Gombal, ShopeePay, OVO, LinkAja',
      icon: <MdOutlineQrCodeScanner size={18} />,
      options: ['QRIS Dinamis']
    },
    {
      id: 'ewallet',
      title: 'E-Wallet',
      desc: 'GoPay, OVO, DANA, ShopeePay',
      icon: <IoWalletOutline size={18} />,
      options: ['GoPay', 'DANA', 'OVO', 'ShopeePay']
    },
    {
      id: 'card',
      title: 'Kartu Kredit/Debit',
      desc: 'Visa, Mastercard, JCB',
      icon: <FiCreditCard size={18} />,
      options: ['Kartu Kredit (Visa/Mastercard)']
    }
  ];

  const toggleGroup = (groupId) => {
    setActiveGroup(activeGroup === groupId ? null : groupId);
  };

  return (
    <div className="w-full flex flex-col gap-3 font-poppins">
      <div className="flex items-center gap-2 mb-1">
        <FiCreditCard className="text-brand-blue-darker" size={16} />
        <h4 className="font-bold text-brand-blue-darker text-sm">Metode Pembayaran</h4>
      </div>
      <p className="text-brand-blue-darker/40 text-[11px] font-medium -mt-3 mb-2">
        Pilih cara pembayaran yang Anda inginkan
      </p>

      <div className="flex flex-col gap-3">
        {paymentGroups.map((group) => {
          const isGroupOpen = activeGroup === group.id;
          const isAnyOptionSelected = group.options.includes(selectedMethod);

          return (
            <div
              key={group.id}
              className={`border rounded-2xl overflow-hidden bg-white transition-all duration-200
                ${isAnyOptionSelected 
                  ? 'border-brand-blue-normal shadow-sm ring-1 ring-brand-blue-normal/20' 
                  : 'border-gray-200/80 hover:border-gray-300'
                }`}
            >
              <div
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between p-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors
                    ${isAnyOptionSelected 
                      ? 'bg-brand-blue-light/20 border-brand-blue-normal/30 text-brand-blue-normal' 
                      : 'bg-gray-50 border-gray-100 text-brand-blue-darker/60'
                    }`}
                  >
                    {group.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-blue-darker text-xs md:text-sm">{group.title}</h5>
                    <p className="text-[10px] md:text-xs text-brand-blue-darker/40 font-medium mt-0.5">{group.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isAnyOptionSelected && (
                    <FiCheckCircle size={16} className="text-brand-blue-normal shrink-0" />
                  )}
                  <motion.div
                    animate={{ rotate: isGroupOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-brand-blue-darker/40"
                  >
                    <FiChevronDown size={16} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isGroupOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-gray-50 bg-gray-50/30 flex flex-col gap-2">
                      <label className="block text-[11px] font-bold text-brand-blue-darker/50 uppercase tracking-wider mb-1">
                        Pilih Opsi Pembayaran
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.options.map((option) => {
                          const isOptionChecked = selectedMethod === option;
                          return (
                            <div
                              key={option}
                              onClick={() => onSelectMethod(option)}
                              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all
                                ${isOptionChecked
                                  ? 'bg-white border-brand-blue-normal text-brand-blue-normal shadow-sm'
                                  : 'bg-white border-gray-200 text-brand-blue-darker/70 hover:border-gray-300'
                                }`}
                            >
                              <span>{option}</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors
                                ${isOptionChecked ? 'border-brand-blue-normal bg-brand-blue-normal' : 'border-gray-300'}`}
                              >
                                {isOptionChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethod;