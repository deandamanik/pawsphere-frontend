// src/components/auth/AuthLayout.jsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LuStethoscope, LuBuilding2, LuSiren, LuPawPrint } from 'react-icons/lu';
import Mascot from '../ui/Mascot';
import logoPawsphere from '../../assets/Logo-Pawsphere.svg';

/**
 * Layout split-screen untuk halaman Login & Register.
 * Kiri  : hero maskot + branding PawSphere (tampil di layar lg ke atas)
 * Kanan : toggle Login/Register + form
 */
export default function AuthLayout({ children }) {
  const location = useLocation();
  const isLogin = !location.pathname.toLowerCase().includes('register');

  const features = [LuStethoscope, LuBuilding2, LuSiren];

  const tabBase =
    'px-7 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer';
  const tabActive = 'bg-[#2C5E7A] text-white shadow-sm';
  const tabIdle = 'text-slate-500 hover:text-[#1E3A4C]';

  return (
    <div className="min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 bg-[#F4F8FB] font-sans">
      {/* ================= KIRI: HERO MASKOT (background polos) ================= */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#1E3A4C] p-10 xl:p-14 text-white">
        {/* Logo PawSphere */}
        <div className="relative">
          <img
            src={logoPawsphere}
            alt="PawSphere"
            className="h-10 xl:h-11 w-auto"
          />
        </div>

        {/* Maskot + Headline */}
        <div className="relative flex flex-col items-center text-center my-6">
          <Mascot state="auth" size={240} />
          <h2 className="font-display text-3xl xl:text-[40px] font-extrabold leading-[1.1] mt-7">
            Rawat hewan kesayangan.
            <br />
            <span className="text-brand-orange">Semua dalam satu tempat.</span>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mt-4 max-w-sm">
            Konsultasi dokter, klinik terdekat, diagnosis AI, sampai Paw Alert
            PawSphere menemani setiap langkah perawatan hewanmu.
          </p>
        </div>

        {/* Chip fitur (di-center) */}
        <div className="relative mx-auto flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur px-4 py-3 w-fit">
          <div className="flex -space-x-2">
            {features.map((Icon, i) => (
              <span
                key={i}
                className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#2C5E7A] shadow-sm"
              >
                <Icon className="w-5 h-5" />
              </span>
            ))}
          </div>
          <span className="text-xs font-semibold text-white/85">
            Satu aplikasi, semua layanan hewan
          </span>
        </div>
      </div>

      {/* ================= KANAN: TOGGLE + FORM ================= */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Brand versi mobile (hero kiri disembunyikan di HP) */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-[#2C5E7A] flex items-center justify-center text-white">
              <LuPawPrint className="w-5 h-5" />
            </div>
            <span className="font-display text-lg font-extrabold text-[#1E3A4C]">
              PawSphere
            </span>
          </div>

          {/* Toggle Login / Register */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
              <Link
                to="/login"
                className={`${tabBase} ${isLogin ? tabActive : tabIdle}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`${tabBase} ${!isLogin ? tabActive : tabIdle}`}
              >
                Register
              </Link>
            </div>
          </div>

          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
}