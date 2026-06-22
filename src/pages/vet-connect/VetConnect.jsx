import { useState } from "react";
import { motion } from "framer-motion";
import {
  LuSearch,
  LuFilter,
  LuArrowLeft,
  LuSend,
  LuCalendar,
  LuMessageCircle,
} from "react-icons/lu";
import DoctorCard from "../../components/vet-connect/DoctorCard";
import DoctorDetailModal from "../../components/vet-connect/DoctorDetailModal";
import BookingSuccessModal from "../../components/vet-connect/BookingSuccessModal";
import ActiveChatCard from "../../components/vet-connect/ActiveChatCard";
import ScheduledConsultationCard from "../../components/vet-connect/ScheduledConsultationCard";
import ChatHistoryCard from "../../components/vet-connect/ChatHistoryCard";
import ChatMessage from "../../components/vet-connect/ChatMessage";
import InfoCard from "../../components/vet-connect/InfoCard";
import BookingForm from "../../components/vet-connect/BookingForm";

// Mock Data
const MOCK_DOCTORS = [
  {
    id: 1,
    name: "drh. Dini Ayu Lestari",
    specialty: "Veterinarian Specialist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dini",
    rating: 5,
    experience: 10,
    location: "Bogor, Jawa Barat",
    price: 50000,
    tags: ["Cat", "Dog", "Hamster"],
    isOnline: true,
    about:
      "Spesialis kesehatan hewan kecil dengan fokus pada perawatan preventif dan pengobatan penyakit kronis.",
  },
  {
    id: 2,
    name: "drh. Rizki Prabowo",
    specialty: "Emergency Veterinarian",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
    rating: 4.9,
    experience: 8,
    location: "Jakarta Selatan",
    price: 90000,
    tags: ["Cat", "Dog", "Hamster"],
    isOnline: false,
  },
  {
    id: 3,
    name: "drh. Muhammad Iqbal",
    specialty: "Exotic Animal Specialist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Iqbal",
    rating: 4.8,
    experience: 12,
    location: "Bandung, Jawa Barat",
    price: 50000,
    tags: ["Cat", "Dog", "Bird"],
    isOnline: true,
  },
  {
    id: 4,
    name: "drh. Siti Nurhaliza Putri",
    specialty: "Senior Veterinarian",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    rating: 5,
    experience: 15,
    location: "Surabaya, Jawa Timur",
    price: 50000,
    tags: ["Cat", "Dog", "Rabbit"],
    isOnline: true,
  },
];

const MOCK_ACTIVE_CHATS = [
  {
    id: 1,
    doctor: {
      name: "drh. Dini Ayu Lestari",
      specialty: "Veterinarian Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dini",
      isOnline: true,
    },
    patientName: "Luna",
    duration: "30 min",
    unreadCount: 0,
  },
];

const MOCK_SCHEDULED = [
  {
    id: 1,
    doctor: {
      name: "drh. Rizki Prabowo",
      specialty: "Emergency Veterinarian",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
    },
    date: "Jadwal: Minggu, 7 Jun 2026 pukul 00.20",
    expiresInHours: 1,
    expiresInMinutes: 2,
  },
];

const MOCK_CHAT_HISTORY = [
  {
    id: 1,
    doctor: {
      name: "drh. Muhammad Iqbal",
      specialty: "Exotic Animal Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Iqbal",
    },
    date: "31 Mei 2026",
  },
  {
    id: 2,
    doctor: {
      name: "drh. Siti Nurhaliza Putri",
      specialty: "Senior Veterinarian",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    },
    date: "26 Mei 2026",
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    text: "Halo! Ada yang bisa saya bantu dengan Coco hari ini?",
    time: "10:00",
    isOwn: false,
  },
  {
    id: 2,
    text: "Halo dok, Coco saya nafsu makannya menurun dan bulunya mulai rontok",
    time: "10:02",
    isOwn: true,
  },
  {
    id: 3,
    text: "Sudah berapa lama kondisi ini berlangsung?",
    time: "10:03",
    isOwn: false,
  },
  { id: 4, text: "Sekitar 3 hari yang lalu dok", time: "10:04", isOwn: true },
  {
    id: 5,
    text: "Baik, dari gejala yang Anda sebutkan, kemungkinan Coco mengalami stress atau kekurangan nutrisi. Saya akan berikan beberapa rekomendasi.",
    time: "10:06",
    isOwn: false,
  },
];

const VetConnect = () => {
  const [view, setView] = useState("home"); // 'home', 'chat', 'history', 'booking'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(MOCK_MESSAGES);
  const [isHistoryChat, setIsHistoryChat] = useState(false); // Track if viewing history chat

  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setView("booking");
  };

  const handleBookingSuccess = (data) => {
    setBookingData(data);
    setIsSuccessModalOpen(true);
    setView("home");
  };

  const handleCancelBooking = () => {
    setView("home");
    setSelectedDoctor(null);
  };

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailModalOpen(true);
  };

  const handleOpenChat = () => {
    setView("chat");
    setChatInput("");
    setIsHistoryChat(false); // Active chat - allow typing
  };

  const handleBackToHome = () => {
    setView("home");
  };

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now(),
      text: trimmed,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");

    // Simulate AI response after 1 second
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "Terima kasih atas informasinya. Saya akan segera menganalisis kondisi hewan Anda.",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: false,
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenHistoryChat = () => {
    setView("chat");
    setIsHistoryChat(true); // History chat - disable typing
    setChatInput("");
  };

  // Filter doctors based on search
  const filteredDoctors = MOCK_DOCTORS.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Render Booking Form View
  if (view === "booking") {
    return (
      <BookingForm
        doctor={selectedDoctor}
        onSuccess={handleBookingSuccess}
        onCancel={handleCancelBooking}
      />
    );
  }

  // Render Chat View
  if (view === "chat") {
    return (
      <div className="font-poppins bg-slate-50 min-h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-brand-blue-dark px-4 py-4 flex items-center gap-3 shadow-md">
          <button
            onClick={handleBackToHome}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LuArrowLeft className="w-5 h-5 text-white" />
          </button>
          <img
            src={MOCK_ACTIVE_CHATS[0].doctor.avatar}
            alt={MOCK_ACTIVE_CHATS[0].doctor.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm">
              {MOCK_ACTIVE_CHATS[0].doctor.name}
            </h3>
            <p className="text-white/70 text-xs">
              {MOCK_ACTIVE_CHATS[0].doctor.specialty}
            </p>
          </div>
          {isHistoryChat && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white font-semibold">
              Riwayat
            </span>
          )}
        </div>

        {/* Date Divider */}
        <div className="flex justify-center py-4">
          <span className="px-4 py-1.5 bg-white rounded-full text-xs text-slate-600 shadow-sm">
            Minggu, 31 Mei 2026
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {chatMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.isOwn}
            />
          ))}
        </div>

        {/* History Notice or Input */}
        {isHistoryChat ? (
          <div className="bg-slate-100 border-t border-slate-200 px-4 py-4">
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <LuMessageCircle className="w-4 h-4" />
              <p className="text-sm font-medium">
                Ini adalah riwayat percakapan yang sudah selesai
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-brand-blue-normal focus-within:bg-white transition-all">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="Ketik pesan..."
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className={`transition-colors ${
                  chatInput.trim()
                    ? "text-brand-blue-normal hover:text-brand-blue-dark cursor-pointer"
                    : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <LuSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render History View
  if (view === "history") {
    return (
      <div className="font-poppins bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleBackToHome}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <LuArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Riwayat Konsultasi
              </h1>
              <p className="text-sm text-slate-500">
                Lihat percakapan sebelumnya
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_CHAT_HISTORY.map((history) => (
                <ChatHistoryCard
                  key={history.id}
                  history={history}
                  onClick={() => handleOpenHistoryChat()}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Home View
  return (
    <div className="font-poppins bg-slate-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Scheduled Consultations */}
            {MOCK_SCHEDULED.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <LuCalendar className="w-5 h-5 text-brand-blue-normal" />
                  <h2 className="text-lg font-bold text-slate-800">
                    Konsultasi Terjadwal
                  </h2>
                </div>
                <div className="space-y-4">
                  {MOCK_SCHEDULED.map((consultation) => (
                    <ScheduledConsultationCard
                      key={consultation.id}
                      consultation={consultation}
                      onViewDetails={() => {
                        alert(
                          `Detail Konsultasi:\n\nDokter: ${consultation.doctor.name}\nTanggal: ${consultation.date}\nStatus: Chat akan dibuka dalam ${consultation.expiresInHours} jam ${consultation.expiresInMinutes} menit\n\nAnda akan menerima notifikasi saat waktu konsultasi tiba.`,
                        );
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search & Filter */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Cari Dokter Hewan
              </h2>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari dokter hewan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-blue-normal transition-colors text-sm"
                  />
                </div>
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <LuFilter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            {/* Doctor List */}
            <div className="space-y-4">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookClick={() => handleBookNow(doctor)}
                    onCardClick={() => handleDoctorClick(doctor)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-12 text-center">
                  <p className="text-slate-500">
                    Tidak ada dokter yang ditemukan
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            {/* Active Chat */}
            {MOCK_ACTIVE_CHATS.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LuMessageCircle className="w-5 h-5 text-brand-blue-normal" />
                  <h3 className="text-base font-bold text-slate-800">
                    Chat Konsultasi Aktif
                  </h3>
                </div>
                {MOCK_ACTIVE_CHATS.map((chat) => (
                  <ActiveChatCard
                    key={chat.id}
                    chat={chat}
                    onClick={handleOpenChat}
                  />
                ))}
              </div>
            )}

            {/* Chat History */}
            {MOCK_CHAT_HISTORY.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3">
                  Riwayat Chat Dokter
                </h3>
                <div className="space-y-3">
                  {MOCK_CHAT_HISTORY.slice(0, 2).map((history) => (
                    <ChatHistoryCard
                      key={history.id}
                      history={history}
                      onClick={() => handleOpenHistoryChat()}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setView("history")}
                  className="w-full mt-3 text-brand-blue-normal hover:bg-brand-blue-light text-sm font-bold py-2 rounded-lg border border-brand-blue-normal transition-colors"
                >
                  Lihat Selengkapnya
                </button>
              </div>
            )}

            {/* Info Card */}
            <InfoCard />
          </aside>
        </div>
      </div>

      {/* Modals */}
      <DoctorDetailModal
        doctor={selectedDoctor}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBook={() => handleBookNow(selectedDoctor)}
      />

      <BookingSuccessModal
        doctor={selectedDoctor}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        bookingDetails={
          bookingData || {
            patientName: "Luna",
            consultationType: "Chat Consultation",
            duration: "30 min",
            price: selectedDoctor?.price,
          }
        }
      />
    </div>
  );
};

export default VetConnect;
