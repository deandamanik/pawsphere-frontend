import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiAlertTriangle, FiUsers, FiClock } from 'react-icons/fi';
import DonationForm from './DonationForm';
import SuccessModal from '../../components/ui/SuccessModal';
import { donate } from '../../services/donation.service';

const UrgencyBadge = ({ label, color }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white ${color}`}>
    {label === 'Kritis' && <FiAlertTriangle size={11} />}
    {label}
  </span>
);

const Tag = ({ label }) => (
  <span className="px-2.5 py-1 rounded-full bg-white/80 border border-gray-200 text-xs font-semibold text-brand-blue-darker shadow-sm">
    {label}
  </span>
);

const CampaignDetail = ({ campaign, onBack, onDonated }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ amount: 0 });

  const handleSuccess = async ({ amount, name, message }) => {
    try {
      await donate(campaign.id, { amount, name, message });
      setSuccessData({ amount });
      setShowSuccess(true);
      if (onDonated) onDonated();
    } catch (err) {
      alert(err.message || 'Gagal memproses donasi. Coba lagi.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6 min-h-screen"
    >
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onBack();
        }}
        title="Donasi Berhasil Terkirim!"
        message={`Terima kasih orang baik! Donasi sebesar Rp ${successData.amount.toLocaleString('id-ID')} untuk "${campaign.title}" telah kami terima.`}
      />

      <div className="w-full flex justify-start mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-brand-blue-normal text-sm font-semibold hover:opacity-70 transition-opacity"
        >
          <FiChevronLeft size={18} /> Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(480px,540px)] gap-10 items-start">
        
        <div className="lg:sticky lg:top-24 bg-white rounded-3xl shadow-sm border border-brand-blue-light-active/60 overflow-hidden w-full">
          <div className="relative w-full aspect-16/10 bg-gray-100 border-b border-brand-blue-light-active/40">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <UrgencyBadge label={campaign.urgency} color={campaign.urgencyColor} />
            </div>
            <div className="absolute top-4 right-4 flex gap-1.5">
              {campaign.tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-brand-blue-normal text-sm font-bold mb-1">{campaign.shelter}</p>
            <h2 className="text-brand-blue-darker font-black text-2xl leading-snug mb-4">
              {campaign.title}
            </h2>
            <p className="text-brand-blue-darker/70 text-sm leading-relaxed mb-6">
              {campaign.description}
            </p>

            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-brand-blue-darker/60 font-semibold">Terkumpul</span>
              <span className="text-brand-blue-normal font-black">{campaign.progress}%</span>
            </div>
            <div className="w-full h-3 bg-brand-blue-light-active rounded-full mb-4">
              <div
                className="h-3 rounded-full bg-brand-blue-normal transition-all duration-500"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50">
              <div>
                <span className="font-extrabold text-brand-blue-darker text-base">{campaign.collected}</span>
                <span className="text-brand-blue-darker/40 font-medium"> / {campaign.target}</span>
              </div>
              <div className="flex gap-4 font-semibold text-brand-blue-darker/60 text-xs">
                <span className="flex items-center gap-1">
                  <FiUsers size={13} /> {campaign.donors} donatur
                </span>
                <span className={`flex items-center gap-1 ${campaign.urgent ? 'text-red-500 font-bold' : ''}`}>
                  <FiClock size={13} /> {campaign.daysLeft} hari lagi
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-brand-blue-light-active/70 p-6 sm:p-8 w-full">
          <h3 className="text-brand-blue-darker font-black text-xl tracking-tight mb-6 text-center">
            Formulir Donasi
          </h3>
          <DonationForm 
            campaign={campaign} 
            onSuccess={handleSuccess}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default CampaignDetail;