import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiFilter, FiHeart, FiUsers, FiClock,
  FiCheckCircle, FiChevronLeft, FiImage, FiAlertTriangle,
} from 'react-icons/fi';

// ─── Data ───────────────────────────────────────────────────────────────────

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

const AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

const shelterUpdates = [
  {
    date: '3 Mei',
    text: 'Rex berhasil melewati operasi dan dalam pemulihan',
    hasPhoto: true,
  },
  {
    date: '1 Mei',
    text: 'Operasi dijadwalkan oleh drh. Sari Dewi',
    hasPhoto: false,
  },
  {
    date: '29 Apr',
    text: 'Dana operasi terkumpul 75%, terima kasih!',
    hasPhoto: true,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}jt`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}rb`
    : `${n}`;

// ─── Sub-components ─────────────────────────────────────────────────────────

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

const CampaignCard = ({ campaign, onDetail }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl overflow-hidden shadow-card border border-brand-blue-light-active"
  >
    {/* Image */}
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

    {/* Body */}
    <div className="p-5">
      <p className="text-brand-blue-normal text-xs font-semibold mb-1">{campaign.shelter}</p>
      <h3 className="text-brand-blue-darker font-bold text-base leading-snug mb-3">
        {campaign.title}
      </h3>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-brand-blue-darker/60 font-medium">Terkumpul</span>
        <span className="text-brand-blue-normal font-bold">{campaign.progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-brand-blue-light-active rounded-full mb-3">
        <div
          className="h-1.5 rounded-full bg-brand-blue-normal transition-all duration-700"
          style={{ width: `${campaign.progress}%` }}
        />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-bold text-brand-blue-darker text-sm">{campaign.collected}</span>
          <span className="text-brand-blue-darker/50 text-xs"> / {campaign.target}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs text-brand-blue-darker/60 flex items-center gap-1">
            <FiUsers size={11} /> {campaign.donors} donatur
          </span>
          <span
            className={`text-xs flex items-center gap-1 font-medium ${
              campaign.urgent ? 'text-red-500' : 'text-brand-blue-darker/60'
            }`}
          >
            <FiClock size={11} /> {campaign.daysLeft} hari lagi
          </span>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onDetail(campaign)}
        className="w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white
                   font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
      >
        <FiHeart size={15} />
        Donasi Sekarang
      </motion.button>
    </div>
  </motion.div>
);

// ─── Donation Form ───────────────────────────────────────────────────────────

const DonationForm = ({ compact = false }) => {
  const [tab, setTab] = useState('uang');
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const total = selected ?? (custom ? parseInt(custom.replace(/\D/g, ''), 10) || 0 : 0);

  return (
    <div>
      {/* Tab */}
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
            {/* Amount grid */}
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

            {/* Custom */}
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

            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama (opsional, boleh anonim)"
              className="w-full px-4 py-2.5 border border-brand-blue-light-active rounded-lg text-sm
                         text-brand-blue-darker placeholder:text-brand-blue-darker/40
                         focus:outline-none focus:border-brand-blue-normal bg-white"
            />

            {/* Message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pesan dukungan..."
              rows={compact ? 2 : 3}
              className="w-full px-4 py-2.5 border border-brand-blue-light-active rounded-lg text-sm
                         text-brand-blue-darker placeholder:text-brand-blue-darker/40
                         focus:outline-none focus:border-brand-blue-normal bg-white resize-none"
            />

            {/* Submit */}
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

// ─── Campaign Detail View ────────────────────────────────────────────────────

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

    {/* Hero Image */}
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

    {/* Detail Card */}
    <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-6 mb-6">
      <p className="text-brand-blue-normal text-sm font-semibold mb-1">{campaign.shelter}</p>
      <h2 className="text-brand-blue-darker font-bold text-xl leading-snug mb-3">
        {campaign.title}
      </h2>
      <p className="text-brand-blue-darker/65 text-sm leading-relaxed mb-5">
        {campaign.description}
      </p>

      {/* Progress */}
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

    {/* Donation Form */}
    <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-6">
      <h3 className="text-brand-blue-darker font-bold text-lg text-center mb-5">
        Formulir Donasi
      </h3>
      <DonationForm compact />
    </div>
  </motion.div>
);

// ─── Main Donation Page ──────────────────────────────────────────────────────

const Donation = () => {
  const [search, setSearch] = useState('');
  const [detailCampaign, setDetailCampaign] = useState(null);

  const filtered = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.shelter.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-brand-blue-light to-white pt-10 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-blue-darker text-white text-xs font-semibold px-4 py-2 rounded-full mb-5">
          <FiHeart size={13} className="text-red-300" />
          Donasi Transparan &amp; Terpercaya
        </div>

        <h1 className="text-4xl font-bold text-brand-blue-darker mb-3">Care Funding</h1>
        <p className="text-brand-blue-darker/65 text-sm max-w-md mx-auto leading-relaxed mb-8 px-4">
          Bantu hewan yang membutuhkan. Setiap donasi dilaporkan secara
          transparan dengan bukti dan pembaruan langsung dari shelter.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 flex-wrap px-4">
          {[
            { value: 'Rp 2.1 Miliar+', label: 'Dana Tersalurkan' },
            { value: '12,400+', label: 'Donatur Aktif' },
            { value: '180+', label: 'Kampanye Selesai' },
            { value: '100%', label: 'Laporan Transparan' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-brand-blue-darker font-bold text-lg">{value}</p>
              <p className="text-brand-blue-normal text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content ── */}
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
              {/* Search + Filter */}
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

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

                {/* ── Left: Campaign List ── */}
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

                {/* ── Right: Sidebar ── */}
                <div className="flex flex-col gap-5 sticky top-24">

                  {/* Form Donasi */}
                  <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-5">
                    <h3 className="text-brand-blue-darker font-bold text-base mb-4">
                      Form Donasi
                    </h3>
                    <DonationForm />
                  </div>

                  {/* Ledger Transparansi */}
                  <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-brand-blue-darker font-bold text-sm">
                        Ledger Transparansi
                      </h3>
                      <button className="text-brand-blue-normal text-xs font-semibold hover:opacity-70 transition-opacity">
                        Tampilkan
                      </button>
                    </div>
                    <div className="bg-brand-blue-darker rounded-xl p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <FiCheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
                        <p className="text-white text-xs font-semibold leading-snug">
                          Semua pengeluaran tercatat &amp; diverifikasi
                        </p>
                      </div>
                      <p className="text-white/60 text-xs pl-5">
                        3 pembaruan transaksi terbaru tersedia
                      </p>
                    </div>
                  </div>

                  {/* Update Terbaru Shelter */}
                  <div className="bg-white rounded-2xl shadow-card border border-brand-blue-light-active p-5">
                    <h3 className="text-brand-blue-darker font-bold text-sm mb-4">
                      Update Terbaru Shelter
                    </h3>
                    <div className="flex flex-col gap-4">
                      {shelterUpdates.map((upd, i) => (
                        <div key={i} className="flex gap-3">
                          {/* Timeline dot */}
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full bg-brand-blue-light flex items-center justify-center shrink-0">
                              <FiHeart size={12} className="text-brand-blue-normal" />
                            </div>
                            {i < shelterUpdates.length - 1 && (
                              <div className="w-px flex-1 bg-brand-blue-light-active mt-1" />
                            )}
                          </div>
                          {/* Content */}
                          <div className="pb-4">
                            <p className="text-brand-blue-darker/50 text-xs mb-0.5">{upd.date}</p>
                            <p className="text-brand-blue-darker text-xs font-medium leading-snug">
                              {upd.text}
                            </p>
                            {upd.hasPhoto && (
                              <button className="mt-1 text-brand-blue-normal text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity">
                                <FiImage size={11} />
                                Foto tersedia
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

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