import { motion } from "framer-motion";
import { LuCalendar } from "react-icons/lu";
import { PiWarningCircleFill } from "react-icons/pi";

const ScheduledConsultationCard = ({ consultation }) => {
  const isExpiringSoon = consultation.expiresInHours <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
    >
      <div className="flex items-start gap-3">
        <img
          src={consultation.doctor.avatar}
          alt={consultation.doctor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-slate-800 truncate">
            {consultation.doctor.name}
          </h4>
          <p className="text-xs text-slate-500 mb-2">
            {consultation.doctor.specialty}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
            <LuCalendar className="w-3.5 h-3.5" />
            <span>{consultation.date}</span>
          </div>

          {isExpiringSoon && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
              <PiWarningCircleFill className="w-3.5 h-3.5" />
              <span className="font-semibold">
                Chat dibuka {consultation.expiresInHours} jam{" "}
                {consultation.expiresInMinutes} lagi
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduledConsultationCard;
