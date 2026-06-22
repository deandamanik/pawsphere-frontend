import { motion } from "framer-motion";
import { LuMessageCircle } from "react-icons/lu";

const ActiveChatCard = ({ chat, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img
            src={chat.doctor.avatar}
            alt={chat.doctor.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {chat.doctor.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-slate-800 truncate">
            {chat.doctor.name}
          </h4>
          <p className="text-xs text-slate-500 truncate">
            {chat.doctor.specialty}
          </p>
        </div>
        {chat.unreadCount > 0 && (
          <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {chat.unreadCount}
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Pasien:</span>
          <span className="font-semibold text-slate-700">
            {chat.patientName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Durasi:</span>
          <span className="font-semibold text-slate-700">{chat.duration}</span>
        </div>
      </div>

      <button className="w-full mt-3 bg-brand-blue-normal hover:bg-brand-blue-normal-hover text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
        <LuMessageCircle className="w-3.5 h-3.5" />
        Buka Chat
      </button>
    </motion.div>
  );
};

export default ActiveChatCard;
