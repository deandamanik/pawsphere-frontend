import { motion } from 'framer-motion';
import { FiChevronLeft, FiAlertTriangle, FiUsers, FiClock } from 'react-icons/fi';
import DonationForm from './DonationForm';

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

const CampaignDetail = ({ campaign, onBack }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="max-w-2xl mx-auto px-4 pb-16"
  >
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 text-brand-blue-normal text-sm font-semibold mb-5 hover:opacity-70 transition-opacity"
    >
      <FiChevronLeft size={18} /> Kembali
    </button>

    <div className="relative rounded-2xl overflow-hidden mb-1 shadow-card">
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-72 object-cover"
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

    <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-6 mb-6">
      <p className="text-brand-blue-normal text-sm font-semibold mb-1">{campaign.shelter}</p>
      <h2 className="text-brand-blue-darker font-bold text-xl leading-snug mb-3">
        {campaign.title}
      </h2>
      <p className="text-brand-blue-darker/65 text-sm leading-relaxed mb-5">
        {campaign.description}
      </p>

      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-brand-blue-darker/60 font-medium">Terkumpul</span>
        <span className="text-brand-blue-normal font-bold">{campaign.progress}%</span>
      </div>
      <div className="w-full h-2 bg-brand-blue-light-active rounded-full mb-3">
        <div
          className="h-2 rounded-full bg-brand-blue-normal"
          style={{ width: `${campaign.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-brand-blue-darker">{campaign.collected}</span>
          <span className="text-brand-blue-darker/50 text-sm"> / {campaign.target}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-xs text-brand-blue-darker/60 flex items-center gap-1">
            <FiUsers size={11} /> {campaign.donors} donatur
          </span>
          <span className={`text-xs flex items-center gap-1 font-medium ${campaign.urgent ? 'text-red-500' : 'text-brand-blue-darker/60'}`}>
            <FiClock size={11} /> {campaign.daysLeft} hari lagi
          </span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-6">
      <h3 className="text-brand-blue-darker font-bold text-lg text-center mb-5">
        Formulir Donasi
      </h3>
      <DonationForm compact />
    </div>
  </motion.div>
);

export default CampaignDetail;