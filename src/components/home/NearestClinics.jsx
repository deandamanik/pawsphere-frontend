import { useRef } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiHome,
  FiBox,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CLINICS_DATA } from "../../data/clinicsData";

const CLINIC_ROUTE = "/clinic";

const SERVICE_LABELS = {
  hospitalization: "Rawat Inap",
  boarding: "Penitipan",
  consultation: "Konsultasi",
  vaccination: "Vaksinasi",
};

export default function NearestClinics({ clinics = CLINICS_DATA }) {
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const nearest = [...clinics].sort((a, b) => a.distanceKm - b.distanceKm);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  };

  const openClinicPage = () => navigate(CLINIC_ROUTE);

  return (
    <section className="bg-white py-12 md:py-20 border-b border-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-wide text-brand-blue-normal">
              Fitur Unggulan
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">
              Klinik Terdekat dari Anda
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Temukan klinik hewan terbaik di sekitar Anda, lengkap dengan
              ketersediaan rawat inap dan penitipan.
            </p>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Sebelumnya"
              onClick={() => scrollByCard(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Berikutnya"
              onClick={() => scrollByCard(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {nearest.map((c) => (
            <motion.article
              key={c.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:w-[46%] lg:w-[31%]"
            >
              <div className="relative h-32 bg-slate-100">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover"
                />
                <span
                  className={
                    "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold " +
                    (c.isOpenNow
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600")
                  }
                >
                  {c.isOpenNow ? "Buka" : "Tutup"}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-800">{c.name}</h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <FiMapPin size={14} />
                  {c.area}
                  <span className="font-semibold text-brand-blue-normal">
                    {" - " + c.distance}
                  </span>
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <FiClock size={14} />
                  {c.openStatus}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span
                    className={
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium " +
                      (c.hospitalizationFull
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-700")
                    }
                  >
                    <FiHome size={12} />
                    {c.hospitalizationBadge}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <FiBox size={12} />
                    {c.boardingBadge}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.availableServices.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-brand-blue-light px-2.5 py-1 text-xs font-medium text-brand-blue-normal"
                    >
                      {SERVICE_LABELS[s] || s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Mulai{" "}
                    <span className="font-bold text-slate-800">
                      {c.startingPrice}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={openClinicPage}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-blue-normal px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue-normal/90"
                  >
                    Detail
                    <FiArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={openClinicPage}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-blue-normal px-6 py-2.5 text-sm font-semibold text-brand-blue-normal transition hover:bg-brand-blue-normal hover:text-white"
          >
            Lihat Semua Klinik
            <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}