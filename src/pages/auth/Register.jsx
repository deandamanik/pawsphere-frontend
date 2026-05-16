import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { HiArrowLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';

const features = [
  'AI chat diagnosa gejala awal',
  'Konsultasi dokter hewan terpercaya',
  'Rescue, adopsi, dan donasi shelter',
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle register logic
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins flex flex-col">

      {/* ── Top Tab Toggle ── */}
      <div className="flex justify-center pt-8 pb-2">
        <div className="flex bg-white rounded-full p-1 shadow-sm border border-brand-blue-light-active">
          <Link
            to="/login"
            className="px-8 py-2 rounded-full text-brand-blue-darker font-semibold text-sm hover:bg-brand-blue-light transition-colors"
          >
            Login
          </Link>
          {/* Register = active */}
          <span className="px-8 py-2 rounded-full bg-brand-blue-darker text-white font-semibold text-sm cursor-default select-none">
            Register
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 items-center justify-between max-w-6xl mx-auto w-full px-8 py-8 gap-12">

        {/* Left – Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <h1 className="text-5xl font-bold text-brand-blue-darker leading-tight mb-5">
            Permudah Perawatan <br />
            Kesehatan Hewan <br />
            Anda
          </h1>
          <p className="text-brand-blue-darker/70 text-base leading-relaxed mb-8 max-w-md">
            Akses AI chat diagnosa, konsultasi dokter hewan, laporan rescue darurat,
            adopsi, dan donasi shelter dalam satu platform terintegrasi.
          </p>

          <div className="flex flex-col gap-3">
            {features.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border border-brand-blue-darker/30 rounded-full px-5 py-2.5 w-fit"
              >
                <span className="w-2 h-2 rounded-full bg-brand-blue-darker shrink-0" />
                <span className="text-brand-blue-darker text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right – Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-card p-8 w-full max-w-md shrink-0"
        >
          <h2 className="text-2xl font-bold text-brand-blue-darker mb-1">Buat Akun Baru</h2>
          <p className="text-brand-blue-darker/55 text-sm mb-7">Daftarkan diri kamu ke PawSphere</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-blue-darker">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama kamu"
                className="w-full px-4 py-3 rounded-xl bg-brand-blue-light border border-brand-blue-normal/30
                           text-brand-blue-darker placeholder:text-brand-blue-normal/40
                           focus:outline-none focus:border-brand-blue-normal text-sm transition-colors"
              />
            </div>

            {/* Nomor Handphone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-blue-darker">
                Nomor Handphone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 rounded-xl bg-brand-blue-light border border-brand-blue-normal/30
                           text-brand-blue-darker placeholder:text-brand-blue-normal/40
                           focus:outline-none focus:border-brand-blue-normal text-sm transition-colors"
              />
            </div>

            {/* Alamat Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-blue-darker">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="kamu@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-brand-blue-light border border-brand-blue-normal/30
                           text-brand-blue-darker placeholder:text-brand-blue-normal/40
                           focus:outline-none focus:border-brand-blue-normal text-sm transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-blue-darker">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-brand-blue-light border border-brand-blue-normal/30
                             text-brand-blue-darker placeholder:text-brand-blue-normal/40
                             focus:outline-none focus:border-brand-blue-normal text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-blue-normal hover:text-brand-blue-dark transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-blue-darker">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-brand-blue-light border border-brand-blue-normal/30
                             text-brand-blue-darker placeholder:text-brand-blue-normal/40
                             focus:outline-none focus:border-brand-blue-normal text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-blue-normal hover:text-brand-blue-dark transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <hr className="border-brand-blue-light-active mt-1" />

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover text-white
                         font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Register
            </motion.button>

            {/* Login link */}
            <p className="text-center text-sm text-brand-blue-darker">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-brand-orange font-bold hover:opacity-80 transition-opacity">
                Masuk
              </Link>
            </p>

            {/* Back to home */}
            <div className="flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <HiArrowLeft size={14} />
                Back to home
              </Link>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;