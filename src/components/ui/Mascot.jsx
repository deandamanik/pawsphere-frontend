import { motion } from 'framer-motion';

import mascotLoading from '../../assets/mascot/mascot-loading.png';
import mascotSearch from '../../assets/mascot/mascot-search.png';
import mascotSuccess from '../../assets/mascot/mascot-success.png';
import mascotError from '../../assets/mascot/mascot-error.png';
import mascotConfirm from '../../assets/mascot/mascot-confirm.png';
import mascotAuth from '../../assets/mascot/mascot-login-regist.png';
import mascotPin from '../../assets/mascot/mascot-pin.png';

const MASCOTS = {
  loading: mascotLoading,
  search: mascotSearch,
  success: mascotSuccess,
  error: mascotError,
  confirm: mascotConfirm,
  auth: mascotAuth,
  pin: mascotPin,
};

// Maskot dengan animasi mengambang (naik-turun) halus & berulang.
export default function Mascot({
  state = 'loading',
  size = 120,
  float = true,
  wobble = false,      // sedikit goyang untuk state loading/search
  className = '',
  alt = 'PawSphere',
}) {
  const src = MASCOTS[state] || mascotLoading;

  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      style={{ width: size, height: 'auto' }}
      className={`select-none pointer-events-none ${className}`}
      initial={{ y: 0 }}
      animate={float ? { y: [0, -10, 0], rotate: wobble ? [0, -3, 3, 0] : 0 } : {}}
      transition={float ? { duration: wobble ? 2.4 : 3, repeat: Infinity, ease: 'easeInOut' } : {}}
    />
  );
}