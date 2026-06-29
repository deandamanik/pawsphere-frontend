import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import DonationHero from '../../components/donation/DonationHero';
import CampaignCard from '../../components/donation/CampaignCard';
import CampaignDetail from '../../components/donation/CampaignDetail'; // Diubah agar memanggil file detail layout
import SidebarUpdates from '../../components/donation/SidebarUpdates';
import { getCampaigns } from '../../services/donation.service';

const Donation = () => {
  const [search, setSearch] = useState('');
  const [detailCampaign, setDetailCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  const reload = useCallback(() => {
    getCampaigns().then(setCampaigns).catch(() => setCampaigns([]));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const filtered = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.shelter.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-poppins">
      <AnimatePresence mode="wait">
        {detailCampaign ? (
          <motion.div key="detail" className="w-full">
            <CampaignDetail
              campaign={detailCampaign}
              onBack={() => { setDetailCampaign(null); reload(); }}
              onDonated={reload}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DonationHero />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 relative">
                  <FiSearch
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue-darker/40"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kampanye atau shelter..."
                    className="w-full pl-10 pr-4 py-3 border border-brand-blue-light-active rounded-xl bg-white
                              text-sm text-brand-blue-darker placeholder:text-brand-blue-darker/40
                              focus:outline-none focus:border-brand-blue-normal shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                <div className="flex flex-col gap-6">
                  {filtered.length === 0 ? (
                    <div className="text-center py-16 text-brand-blue-darker/40 text-sm">
                      Tidak ada kampanye ditemukan.
                    </div>
                  ) : (
                    filtered.map((c) => (
                      <CampaignCard
                        key={c.id}
                        campaign={c}
                        onDetail={setDetailCampaign}
                      />
                    ))
                  )}
                </div>

                <div className="flex flex-col gap-5 sticky top-24">
                  <SidebarUpdates />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Donation;