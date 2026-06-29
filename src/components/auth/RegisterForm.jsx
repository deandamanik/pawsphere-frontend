import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AuthInput from './AuthInput';
import AuthPasswordInput from './AuthPasswordInput';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { homeForRole, REGISTERABLE_ROLES } from '../../config/roles';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setSubmitting(true);
    try {
      // Map the form to the backend's expected field names.
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone_number: form.phone || undefined,
        role: form.role,
      });
      navigate(homeForRole(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
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

      {error && (
        <div className="mb-5 rounded-xl bg-brand-red-light border border-brand-red-light-active px-4 py-3 text-sm text-brand-red-dark font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Nama Lengkap"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama kamu"
          required
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
          required
        />

        {/* Role picker — this is what lets one Register page create the
            different account types. "admin" is not offered here on purpose. */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-brand-blue-normal">
            Daftar sebagai
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-brand-blue-light border border-brand-blue-normal/30
                      text-brand-blue-normal focus:outline-none focus:border-brand-blue-normal
                      text-base md:text-sm transition-colors cursor-pointer"
          >
            {REGISTERABLE_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

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
          className={`w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover py-3 rounded-xl text-sm font-semibold mt-2 ${
            submitting ? 'opacity-70 pointer-events-none' : ''
          }`}
        >
          {submitting ? 'Memproses…' : 'Register'}
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