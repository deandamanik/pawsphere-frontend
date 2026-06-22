import { motion } from "framer-motion";
import { LuStar, LuClock, LuMapPin, LuChevronRight } from "react-icons/lu";

const DoctorCard = ({ doctor, onBookClick, onCardClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 hover:shadow-lg transition-all cursor-pointer"
      onClick={onCardClick}
    >
      <div className="flex items-start gap-4">
        {/* Doctor Avatar */}
        <div className="relative shrink-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-blue-light"
          />
          {doctor.isOnline && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-800 truncate flex items-center gap-2">
                {doctor.name}
                <LuChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </h3>
              <p className="text-xs text-slate-500 mb-2">{doctor.specialty}</p>
            </div>
            <span className="text-brand-blue-normal font-bold text-sm shrink-0">
              Rp {doctor.price.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Rating, Experience, Location */}
          <div className="flex items-center gap-3 mb-3 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <LuStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold">{doctor.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <LuClock className="w-3.5 h-3.5" />
              <span>{doctor.experience} Tahun</span>
            </div>
            <div className="flex items-center gap-1">
              <LuMapPin className="w-3.5 h-3.5" />
              <span className="truncate">{doctor.location}</span>
            </div>
          </div>

          {/* Specialties Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {doctor.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-brand-blue-light text-brand-blue-dark text-[10px] font-semibold rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Book Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookClick();
            }}
            className="w-full bg-brand-blue-normal hover:bg-brand-blue-normal-hover text-white text-sm font-bold py-2 rounded-xl transition-colors"
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
