import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AuthInput from './AuthInput';
import AuthPasswordInput from './AuthPasswordInput';
import Button from '../ui/Button';

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthInput
          label="Alamat Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kamu@gmail.com"
        />

        <AuthPasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.checked)}
            className="w-4 h-4 accent-brand-blue-normal cursor-pointer rounded border-gray-300"
          />
          <label htmlFor="rememberMe" className="text-sm text-brand-blue-normal cursor-pointer select-none font-medium">
            Remember me
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-blue-darker hover:bg-brand-blue-dark-hover py-3 rounded-xl text-sm font-semibold mt-2"
        >
          Login
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