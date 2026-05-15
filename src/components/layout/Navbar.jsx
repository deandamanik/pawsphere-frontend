import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logoPawsphere from '../../assets/Logo-Pawsphere.svg';
import warningIcon from '../../assets/Warning.svg';

const Navbar = ({ isLoggedIn = false, handleLogout }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('Home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPawAlert, setShowPawAlert] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const primaryMenus = [
    { name: 'Home', path: '/' },
    { name: 'AI Diagnosis', path: '/ai-diagnose' },
    { name: 'Vet Connect', path: '/vet-connect' }
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const secondaryMenus = [
    { name: 'Adoption', path: '/adoption' },
    { name: 'Donation', path: '/donation' },
    { name: 'Marketplace', path: '/marketplace' }
  ];

  useEffect(() => {
    const allMenus = [...primaryMenus, ...secondaryMenus];
    const currentMenu = allMenus.find(menu => menu.path === location.pathname);
    
    if (currentMenu) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveMenu(currentMenu.name);
    } else if (location.pathname === '/paw-alert') {
      setActiveMenu('PawAlert'); 
    } else {
      setActiveMenu(''); 
    }
  }, [location, primaryMenus, secondaryMenus]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowPawAlert(!entry.isIntersecting),
      { threshold: 0.1 }
    );

    const footer = document.querySelector('footer');
    if (footer) observer.observe(footer);

    return () => { if (footer) observer.unobserve(footer); };
  }, []);

  return (
    <>
      <nav className={`font-poppins w-full sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-brand-blue-dark backdrop-blur-md py-3' 
          : 'bg-brand-blue-dark py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="shrink-0">
              <Link to="/">
                <img 
                  src={logoPawsphere} 
                  alt="Pawsphere Logo" 
                  className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform" 
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {primaryMenus.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-6 py-2 rounded-full text-base font-bold transition-colors duration-300 cursor-pointer
                    ${activeMenu === item.name ? 'text-brand-blue-dark' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  {activeMenu === item.name && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-white rounded-full shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}

              <div 
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="px-6 py-2 text-white/70 group-hover:text-white font-bold text-base flex items-center gap-1 transition-all rounded-full hover:bg-white/10 cursor-pointer">
                  Layanan
                  <svg className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 pt-4"
                    >
                      <div className="w-52 bg-white rounded-2xl shadow-2xl py-2 border border-slate-100 overflow-hidden">
                        {secondaryMenus.map((item) => (
                          <Link 
                            key={item.name} 
                            to={item.path}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block w-full text-left px-6 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-blue-dark transition-all cursor-pointer"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="hidden lg:flex items-center">
              {!isLoggedIn ? (
                <div className="flex items-center bg-brand-orange rounded-full p-1 border border-brand-orange shadow-lg">
                  <Link to="/login" className="px-7 py-2 text-white font-bold text-base hover:opacity-80 transition-all cursor-pointer">
                    Login
                  </Link>
                  <Link to="/register" className="px-7 py-2 bg-white text-brand-orange font-bold rounded-full text-base shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
                    Register
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="px-8 py-2.5 bg-white text-brand-orange border border-brand-orange font-bold rounded-full text-base hover:bg-slate-50 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white outline-none z-50 relative cursor-pointer">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

  <AnimatePresence>
    {!isMobileMenuOpen && showPawAlert && (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 20 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className="fixed bottom-6 right-4 z-60"
      >
        <Link 
          to="/paw-alert" 
          className="flex flex-col items-end group cursor-pointer"
        >
          <div className="mb-2 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl translate-x-2 group-hover:translate-x-0 uppercase tracking-widest pointer-events-none">
            Paw Alert
          </div>

          <div className="w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-all duration-300 flex items-center justify-center group-active:scale-90">
            <img 
              src={warningIcon} 
              alt="!" 
              className="w-7 h-7 brightness-0 invert animate-pulse" 
            />
          </div>
        </Link>
      </motion.div>
    )}
  </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className={`fixed inset-0 z-40 bg-brand-blue-dark flex flex-col px-8 lg:hidden transition-all duration-500 ${
              scrolled ? 'pt-28' : 'pt-32'
            }`}
          >
            <div className="space-y-6">
              {[...primaryMenus, ...secondaryMenus].map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-xl font-black text-white/90 border-b border-white/5 pb-4 cursor-pointer"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-auto mb-12 flex flex-col gap-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-brand-orange text-white rounded-2xl font-bold text-center text-lg">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-white text-brand-orange rounded-2xl font-bold text-center text-lg">Register</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold text-lg border border-white/10 cursor-pointer">Logout</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;