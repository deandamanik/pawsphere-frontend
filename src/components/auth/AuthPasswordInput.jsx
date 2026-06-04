import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const AuthPasswordInput = ({ label, name, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-brand-blue-normal">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 md:py-3 pr-11 rounded-xl bg-white border border-brand-blue-normal/20
                    text-brand-blue-normal placeholder:text-brand-blue-normal/30
                    focus:outline-none focus:border-brand-blue-normal 
                    text-base md:text-sm transition-colors shadow-sm"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-blue-normal/60 hover:text-brand-blue-dark transition-colors"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default AuthPasswordInput;