import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AuthInput from './AuthInput';
import AuthPasswordInput from './AuthPasswordInput';
import Button from '../ui/Button';

const RegisterForm = () => {
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
    console.log(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-3xl shadow-card p-8 w-full max-w-md shrink-0 border border-brand-blue-light-active/50"
    >
      <h2 className="text-2xl font-bold text-brand-blue-normal mb-1">Buat Akun Baru</h2>
      <p className="text-brand-blue-normal/90 text-sm mb-7">Daftarkan diri kamu ke PawSphere</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Nama Lengkap"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama kamu"
        />

        <AuthInput
          label="Nomor Handphone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="08xxxxxxxxxx"
        />

        <AuthInput
          label="Alamat Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="kamu@gmail.com"
        />

        <AuthPasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••••"
        />

        <AuthPasswordInput
          label="Konfirmasi Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••••"
        />

        <Button
          type="submit"
          className="w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover py-3 rounded-xl text-sm font-semibold mt-2"
        >
          Register
        </Button>

        <p className="text-center text-sm text-brand-blue-normal">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-brand-orange font-bold hover:underline transition-all">
            Masuk
          </Link>
        </p>

        <div className="flex justify-center mt-1">
          <Link to="/" className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold hover:underline transition-all">
            <HiArrowLeft size={14} />
            Back to home
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterForm;