import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthToggle = ({ activePage }) => {
  return (
    <div className="flex justify-center pt-8 pb-2">
      <div className="flex bg-white rounded-full p-1 shadow-sm border border-brand-blue-light-active">
      
        <Link
          to="/login"
          className={`relative px-8 py-2 rounded-full font-bold text-sm transition-colors duration-300 select-none
            ${activePage === 'login' ? 'text-white' : 'text-brand-blue-normal hover:bg-brand-blue-light/50'}`}
        >
          {activePage === 'login' && (
            <motion.div
              layoutId="authToggleIndicator"
              initial={false}
              className="absolute inset-0 bg-brand-blue-normal rounded-full shadow-md"
              transition={{ 
                type: "spring", 
                bounce: 0.18, 
                duration: 0.5 
              }}
            />
          )}
          <span className="relative z-10">Login</span>
        </Link>
        
        <Link
          to="/register"
          className={`relative px-8 py-2 rounded-full font-bold text-sm transition-colors duration-300 select-none
            ${activePage === 'register' ? 'text-white' : 'text-brand-blue-normal hover:bg-brand-blue-light/50'}`}
        >
          {activePage === 'register' && (
            <motion.div
              layoutId="authToggleIndicator"
              initial={false}
              className="absolute inset-0 bg-brand-blue-normal rounded-full shadow-md"
              transition={{ 
                type: "spring", 
                bounce: 0.18, 
                duration: 0.5 
              }}
            />
          )}
          <span className="relative z-10">Register</span>
        </Link>

      </div>
    </div>
  );
};

export default AuthToggle;