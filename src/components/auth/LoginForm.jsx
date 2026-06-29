import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AuthInput from './AuthInput';
import AuthPasswordInput from './AuthPasswordInput';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { homeForRole } from '../../config/roles';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // One login endpoint for every role. The backend returns the user
      // (with their role), and we decide where to send them next.
      const user = await login(email, password);

      // If the guard bounced them here, return to the page they wanted.
      const from = location.state?.from?.pathname;
      navigate(from || homeForRole(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal masuk. Coba lagi.');
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
      <h2 className="text-3xl font-bold text-brand-blue-normal mb-1">Selamat Datang</h2>
      <p className="text-brand-blue-normal/90 text-sm mb-7">Masuk ke akun PawSphere kamu</p>

      {error && (
        <div className="mb-5 rounded-xl bg-brand-red-light border border-brand-red-light-active px-4 py-3 text-sm text-brand-red-dark font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthInput
          label="Alamat Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kamu@gmail.com"
          required
        />

        <AuthPasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
        />

        <Button
          type="submit"
          className={`w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover py-3 rounded-xl text-sm font-semibold mt-2 ${
            submitting ? 'opacity-70 pointer-events-none' : ''
          }`}
        >
          {submitting ? 'Memproses…' : 'Login'}
        </Button>

        <p className="text-center text-sm text-brand-blue-normal">
          Belum punya akun?{' '}
          <Link to="/register" className="text-brand-orange font-bold hover:underline transition-all">
            Daftar Gratis
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

export default LoginForm;