import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LuSearch, LuFilter, LuCalendar, LuMessageCircle } from "react-icons/lu";
import DoctorCard from "../../components/vet-connect/DoctorCard";
import DoctorDetailModal from "../../components/vet-connect/DoctorDetailModal";
import BookingSuccessModal from "../../components/vet-connect/BookingSuccessModal";
import ActiveChatCard from "../../components/vet-connect/ActiveChatCard";
import ScheduledConsultationCard from "../../components/vet-connect/ScheduledConsultationCard";
import ChatHistoryCard from "../../components/vet-connect/ChatHistoryCard";
import InfoCard from "../../components/vet-connect/InfoCard";
import BookingForm from "../../components/vet-connect/BookingForm";
import ConsultationChat from "../../components/vet-connect/ConsultationChat";
import { useAuth } from "../../context/AuthContext";
import {
  getVets,
  createConsultation,
  getMyConsultations,
} from "../../services/vetConnect.service";

const STATUS_LABEL = {
  pending: "Menunggu",
  active: "Aktif",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const VetConnect = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState("home"); // 'home' | 'booking' | 'chat'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingData, setBookingData] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [activeConsultation, setActiveConsultation] = useState(null);

  const loadConsultations = useCallback(() => {
    if (!isAuthenticated) {
      setConsultations([]);
      return;
    }
    getMyConsultations()
      .then(setConsultations)
      .catch(() => setConsultations([]));
  }, [isAuthenticated]);

  useEffect(() => {
    setLoadingDoctors(true);
    getVets()
      .then(setDoctors)
      .catch(() => setDoctors([]))
      .finally(() => setLoadingDoctors(false));
  }, []);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  // Group consultations by status for the sidebar / scheduled section.
  const pending = consultations.filter((c) => c.status === "pending");
  const active = consultations.filter((c) => c.status === "active");
  const finished = consultations.filter(
    (c) => c.status === "completed" || c.status === "cancelled"
  );

  const handleBookNow = (doctor) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/vet-connect" } } });
      return;
    }
    setSelectedDoctor(doctor);
    setView("booking");
  };

  const handleBookingSuccess = async (data) => {
    try {
      const notes = [
        `Pemilik: ${data.fullName} (${data.phone}${data.email ? ", " + data.email : ""})`,
        data.address ? `Alamat: ${data.address}` : null,
        `Hewan: ${data.petName} - ${data.petType}, usia ${data.petAge}`,
        data.complaint ? `Keluhan: ${data.complaint}` : null,
        `Metode bayar: ${data.paymentMethod}`,
      ]
        .filter(Boolean)
        .join("\n");

      await createConsultation({
        vet_profile_id: selectedDoctor.id,
        method: "chat",
        notes,
      });

      setBookingData(data);
      setIsSuccessModalOpen(true);
      setView("home");
      loadConsultations();
    } catch (err) {
      alert(err.message || "Gagal membuat booking. Coba lagi.");
    }
  };

  const handleCancelBooking = () => {
    setView("home");
    setSelectedDoctor(null);
  };

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailModalOpen(true);
  };

  const openChat = (consultation) => {
    setActiveConsultation(consultation);
    setView("chat");
  };

  const backFromChat = () => {
    setView("home");
    setActiveConsultation(null);
    loadConsultations(); // status may have changed
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ----- Booking view -----
  if (view === "booking") {
    return (
      <BookingForm
        doctor={selectedDoctor}
        onSuccess={handleBookingSuccess}
        onCancel={handleCancelBooking}
      />
    );
  }

  // ----- Chat view -----
  if (view === "chat" && activeConsultation) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConsultationChat
          consultationId={activeConsultation.id}
          title={activeConsultation.doctor.name}
          subtitle={activeConsultation.doctor.specialty}
          avatar={activeConsultation.doctor.avatar}
          status={activeConsultation.status}
          onBack={backFromChat}
        />
      </div>
    );
  }

  // ----- Home view -----
  return (
    <div className="font-poppins bg-slate-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main */}
          <div className="flex-1">
            {/* Scheduled (pending) */}
            {pending.length > 0 && (
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
                  {pending.map((c) => (
                    <div key={c.id} onClick={() => openChat(c)} className="cursor-pointer">
                      <ScheduledConsultationCard
                        consultation={{
                          id: c.id,
                          doctor: c.doctor,
                          date: `Status: ${STATUS_LABEL[c.status]} · ${fmtDate(c.created_at)}`,
                          expiresInHours: 99,
                          expiresInMinutes: 0,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Klik kartu untuk membuka chat. Dokter akan membalas saat tersedia.
                </p>
              </motion.div>
            )}

            {/* Search */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Cari Dokter Hewan</h2>
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

            {/* Doctor list */}
            <div className="space-y-4">
              {loadingDoctors ? (
                <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-12 text-center">
                  <p className="text-slate-500">Memuat daftar dokter...</p>
                </div>
              ) : filteredDoctors.length > 0 ? (
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
                  <p className="text-slate-500">Tidak ada dokter yang ditemukan</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            {/* Active chats */}
            {active.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LuMessageCircle className="w-5 h-5 text-brand-blue-normal" />
                  <h3 className="text-base font-bold text-slate-800">
                    Chat Konsultasi Aktif
                  </h3>
                </div>
                <div className="space-y-3">
                  {active.map((c) => (
                    <ActiveChatCard
                      key={c.id}
                      chat={{
                        id: c.id,
                        doctor: { ...c.doctor, isOnline: true },
                        patientName: "Anda",
                        duration: "Chat aktif",
                        unreadCount: 0,
                      }}
                      onClick={() => openChat(c)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {finished.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3">
                  Riwayat Chat Dokter
                </h3>
                <div className="space-y-3">
                  {finished.map((c) => (
                    <ChatHistoryCard
                      key={c.id}
                      history={{
                        id: c.id,
                        doctor: c.doctor,
                        date: `${STATUS_LABEL[c.status]} · ${fmtDate(c.created_at)}`,
                      }}
                      onClick={() => openChat(c)}
                    />
                  ))}
                </div>
              </div>
            )}

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