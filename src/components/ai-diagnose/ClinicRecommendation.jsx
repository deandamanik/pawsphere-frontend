// src/components/ai-diagnose/ClinicRecommendation.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuStethoscope,
  LuMapPin,
  LuChevronRight,
  LuLocateFixed,
} from "react-icons/lu";
import { CLINICS_DATA } from "../../data/clinicsData";

const haversineKm = (a, b) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

/**
 * Kartu rekomendasi klinik — muncul setelah AI memberi diagnosa.
 * Menutup alur: diagnosa → tindakan nyata (buat janji ke klinik).
 *
 * Props:
 *  - userLocation?: {lat,lng}  (opsional; kalau kosong, komponen minta GPS sendiri)
 *  - max?: number              (jumlah klinik ditampilkan, default 3)
 */
export default function ClinicRecommendation({ userLocation = null, max = 3 }) {
  const [loc, setLoc] = useState(userLocation);
  const [asking, setAsking] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (userLocation) setLoc(userLocation);
  }, [userLocation]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setDenied(true);
      return;
    }
    setAsking(true);
    setDenied(false);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLoc({ lat: p.coords.latitude, lng: p.coords.longitude });
        setAsking(false);
      },
      () => {
        setDenied(true);
        setAsking(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Minta lokasi otomatis sekali saat kartu muncul (kalau belum ada).
  useEffect(() => {
    if (!loc && !userLocation) detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clinics = useMemo(() => {
    const list = CLINICS_DATA.map((c) => {
      let distanceKm = null;
      if (loc && Array.isArray(c.coordinates)) {
        distanceKm = haversineKm(loc, {
          lat: c.coordinates[0],
          lng: c.coordinates[1],
        });
      }
      return { ...c, distanceKm };
    });
    if (loc) list.sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
    return list.slice(0, max);
  }, [loc, max]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-md">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-9 h-9 rounded-xl bg-brand-blue-light flex items-center justify-center text-brand-blue-normal shrink-0">
          <LuStethoscope className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-brand-blue-darker leading-tight">
            Perlu diperiksa langsung?
          </p>
          <p className="text-xs text-slate-500">
            {loc
              ? "Klinik terdekat dari lokasimu"
              : "Klinik mitra PawSphere di Bali"}
          </p>
        </div>
      </div>

      {!loc && denied && (
        <button
          type="button"
          onClick={detectLocation}
          className="w-full mb-3 inline-flex items-center justify-center gap-2 text-xs font-bold text-brand-blue-normal bg-brand-blue-light hover:bg-brand-blue-light-active/60 rounded-xl py-2.5 transition-colors"
        >
          <LuLocateFixed className="w-4 h-4" />
          Aktifkan lokasi untuk urutkan terdekat
        </button>
      )}
      {asking && (
        <p className="text-xs text-slate-400 mb-3">Mendeteksi lokasimu…</p>
      )}

      <div className="space-y-2">
        {clinics.map((c) => (
          <Link
            key={c.id}
            to={`/clinic/${c.id}`}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-brand-blue-normal hover:bg-brand-blue-light/40 transition-colors group"
          >
            <img
              src={c.image}
              alt=""
              className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">
                {c.name}
              </p>
              <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                <LuMapPin className="w-3 h-3 shrink-0" />
                {c.shortArea || c.area}
                {c.distanceKm != null && (
                  <> · {c.distanceKm.toFixed(1).replace(".", ",")} km</>
                )}
                {typeof c.isOpenNow === "boolean" && (
                  <>
                    {" · "}
                    <span className={c.isOpenNow ? "text-emerald-600" : "text-red-500"}>
                      {c.isOpenNow ? "Buka" : "Tutup"}
                    </span>
                  </>
                )}
              </p>
            </div>
            <span className="text-xs font-bold text-brand-blue-normal inline-flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
              Buat janji
              <LuChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/clinic"
        className="block text-center text-xs font-semibold text-brand-blue-normal hover:underline mt-3"
      >
        Lihat semua klinik →
      </Link>

      <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed">
        Diagnosa AI bersifat bantuan awal, bukan pengganti pemeriksaan dokter hewan.
      </p>
    </div>
  );
}