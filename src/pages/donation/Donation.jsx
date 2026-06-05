import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import DonationHero from '../../components/donation/DonationHero';
import CampaignCard from '../../components/donation/CampaignCard';
import DonationForm from '../../components/donation/DonationForm';
import CampaignDetail from '../../components/donation/CampaignDetail';
import SidebarUpdates from '../../components/donation/SidebarUpdates';

const campaigns = [
  {
    id: 1,
    urgency: 'Kritis',
    urgencyColor: 'bg-red-500',
    tags: ['Bedah', 'Darurat'],
    shelter: 'Shelter Harapan Hewan',
    title: 'Operasi Darurat untuk Rex si Anjing Jalanan',
    description:
      'Rex, anjing jalanan dalam kondisi kritis, membutuhkan operasi darurat agar bisa bertahan dan pulih. Ia ditemukan dalam keadaan lemah dan terluka, dan kini sangat bergantung pada bantuan kita. Dukungan Anda akan membantu biaya operasi dan perawatannya, memberi Rex kesempatan untuk kembali sehat dan hidup lebih baik.',
    progress: 75,
    collected: 'Rp 11.3jt',
    target: 'Rp 15jt',
    donors: 342,
    daysLeft: 8,
    urgent: false,
    image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&q=80',
  },
  {
    id: 2,
    urgency: 'Normal',
    urgencyColor: 'bg-green-500',
    tags: ['Fasilitas', 'Shelter'],
    shelter: 'Cat Haven Jakarta',
    title: 'Renovasi Kandang & Fasilitas Shelter Kucing',
    description:
      'Cat Haven Jakarta membutuhkan renovasi kandang agar kucing-kucing yang dirawat bisa hidup lebih nyaman dan sehat. Dana akan digunakan untuk perbaikan kandang, sistem ventilasi, dan fasilitas sanitasi.',
    progress: 75,
    collected: 'Rp 18.8jt',
    target: 'Rp 25jt',
    donors: 567,
    daysLeft: 21,
    urgent: false,
    image: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&q=80',
  },
  {
    id: 3,
    urgency: 'Mendesak',
    urgencyColor: 'bg-orange-500',
    tags: ['Sterilisasi', 'Komunitas'],
    shelter: 'Paws for Life',
    title: 'Sterilisasi 50 Kucing Liar di Area Kemang',
    description:
      'Program sterilisasi massal untuk mengendalikan populasi kucing liar di area Kemang. Paws for Life bekerja sama dengan dokter hewan untuk mensterilkan 50 ekor kucing demi kesejahteraan hewan dan komunitas setempat.',
    progress: 85,
    collected: 'Rp 6.8jt',
    target: 'Rp 8jt',
    donors: 108,
    daysLeft: 5,
    urgent: true,
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&q=80',
  },
];

const Donation = () => {
  const [search, setSearch] = useState('');
  const [detailCampaign, setDetailCampaign] = useState(null);

  const filtered = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.shelter.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-poppins">
      
      <DonationHero />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {detailCampaign ? (
            <motion.div key="detail">
              <CampaignDetail
                campaign={detailCampaign}
                onBack={() => setDetailCampaign(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                <button className="flex items-center gap-2 px-5 py-3 border border-brand-blue-light-active rounded-xl
                                  bg-white text-brand-blue-darker text-sm font-semibold shadow-sm
                                  hover:border-brand-blue-normal transition-colors">
                  <FiFilter size={15} />
                  Filter
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

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
                  <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-5">
                    <h3 className="text-brand-blue-darker font-bold text-base mb-4">
                      Form Donasi
                    </h3>
                    <DonationForm />
                  </div>

                  <SidebarUpdates />
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Donation;