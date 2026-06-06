import { motion } from 'framer-motion';
import { FiAlertTriangle, FiUsers, FiClock, FiHeart } from 'react-icons/fi';

const UrgencyBadge = ({ label, color }) => (
  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold text-white ${color}`}>
    {label === 'Kritis' && <FiAlertTriangle size={11} />}
    {label}
  </span>
);

const Tag = ({ label }) => (
  <span className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-sm font-semibold text-brand-blue-darker shadow-sm">
    {label}
  </span>
);

const CampaignCard = ({ campaign, onDetail }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl overflow-hidden shadow-card border border-brand-blue-light-active"
  >
    <div className="relative">
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-3 left-3">
        <UrgencyBadge label={campaign.urgency} color={campaign.urgencyColor} />
      </div>
      <div className="absolute top-3 right-3 flex gap-1.5">
        {campaign.tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
    </div>

    <div className="p-5">
      <p className="text-brand-blue-normal text-sm font-semibold mb-1">{campaign.shelter}</p>
      <h3 className="text-dark font-bold text-lg leading-snug mb-3">
        {campaign.title}
      </h3>

      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-500 font-medium">Terkumpul</span>
        <span className="text-brand-blue-normal text-sm font-bold">{campaign.progress}%</span>
      </div>
      <div className="w-full h-2 bg-brand-blue-light-active rounded-full mb-3">
        <div
          className="h-2 rounded-full bg-brand-blue-normal transition-all duration-700"
          style={{ width: `${campaign.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-bold text-brand-blue-normal text-sm">{campaign.collected}</span>
          <span className="text-brand-blue-normal/50 text-xs"> / {campaign.target}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs text-brand-blue-normal/60 flex items-center gap-1">
            <FiUsers size={11} /> {campaign.donors} donatur
          </span>
          <span
            className={`text-xs flex items-center gap-1 font-medium ${
              campaign.urgent ? 'text-red-500' : 'text-brand-blue-normal/60'
            }`}
          >
            <FiClock size={11} /> {campaign.daysLeft} hari lagi
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onDetail(campaign)}
        className="w-full bg-brand-blue-normal hover:bg-brand-blue-dark-hover text-white
                  font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
      >
        <FiHeart size={15} />
        Donasi Sekarang
      </motion.button>
    </div>
  </motion.div>
);

export default CampaignCard;