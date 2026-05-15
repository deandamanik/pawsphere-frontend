import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  to, 
  variant = 'blue', 
  className = '', 
  onClick 
}) => {
const variants = {
  blue: 'bg-brand-blue-normal hover:bg-brand-blue-normal-hover shadow-lg shadow-brand-blue-normal/20',
  orange: 'bg-brand-orange hover:opacity-90 shadow-lg shadow-brand-orange/20',
  red: 'bg-brand-red-normal hover:bg-brand-red-normal-hover',
};

  const baseStyles = `px-8 py-3 rounded-2xl text-white font-bold transition-all duration-300 flex items-center justify-center text-center active:scale-95 ${variants[variant]} ${className}`;

  if (to) {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
        <Link to={to} className={baseStyles}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button 
      whileHover={{ y: -2 }} 
      whileTap={{ scale: 0.95 }}
      onClick={onClick} 
      className={baseStyles}
    >
      {children}
    </motion.button>
  );
};

export default Button;