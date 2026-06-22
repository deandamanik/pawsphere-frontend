import { motion } from "framer-motion";
import { LuCalendar } from "react-icons/lu";

const ChatHistoryCard = ({ history, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <img
          src={history.doctor.avatar}
          alt={history.doctor.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-slate-800 truncate">
            {history.doctor.name}
          </h4>
          <p className="text-xs text-slate-500 truncate">
            {history.doctor.specialty}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
        <LuCalendar className="w-3.5 h-3.5" />
        <span>{history.date}</span>
      </div>
    </motion.div>
  );
};

export default ChatHistoryCard;
