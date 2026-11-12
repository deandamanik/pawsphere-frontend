// src/components/auth/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import { LuPawPrint, LuStethoscope, LuBuilding2, LuSiren } from 'react-icons/lu';
import Mascot from '../ui/Mascot';

/**
 * Layout split-screen untuk halaman Login & Register.
 * Kiri  : hero maskot + branding PawSphere (tampil di layar lg ke atas)
 * Kanan : form (LoginForm / RegisterForm)
 *
 * Dipakai dua cara, keduanya didukung:
 *   <AuthLayout><LoginForm /></AuthLayout>      // lewat children
 *   <Route element={<AuthLayout />}> ... </Route> // lewat <Outlet/>
 */
export default function AuthLayout({ children }) {
  const features = [
    { icon: LuStethoscope, label: 'Konsultasi' },
    { icon: LuBuilding2, label: 'Klinik' },
    { icon: LuSiren, label: 'Paw Alert' },
  ];

  return (
    <div className="min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 bg-[#F4F8FB] font-sans">
      {/* ================= KIRI: HERO MASKOT ================= */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#16303F] via-[#1E3A4C] to-[#2C5E7A] p-10 xl:p-14 text-white">
        {/* Lingkaran dekoratif */}
        <div className="pointer-events-none absolute -left-28 top-6 h-[460px] w-[460px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -left-12 top-24 h-[320px] w-[320px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-[360px] w-[360px] rounded-full bg-[#FF6B00]/10 blur-2xl" />

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <LuPawPrint className="w-5 h-5 text-[#FFB27A]" />
          </div>
          <div className="leading-none">
            <div className="font-display text-lg font-extrabold tracking-tight">PawSphere</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
              Pet Healthcare
            </div>
          </div>
        </div>

        {/* Maskot + Headline */}
        <div className="relative flex flex-col items-center text-center my-6">
          <Mascot state="auth" size={240} />
          <h2 className="font-display text-3xl xl:text-[40px] font-extrabold leading-[1.1] mt-7">
            Rawat hewan kesayangan.
            <br />
            <span className="text-[#FFB27A]">Semua dalam satu tempat.</span>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mt-4 max-w-sm">
            Konsultasi dokter, klinik terdekat, diagnosis AI, sampai Paw Alert —
            PawSphere menemani setiap langkah perawatan hewanmu.
          </p>
        </div>

        {/* Chip fitur */}
        <div className="relative flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur px-4 py-3 w-fit">
          <div className="flex -space-x-2">
            {features.map(({ icon: Icon }, i) => (
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

      {/* ================= KANAN: FORM ================= */}
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

          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
}