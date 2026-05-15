import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoPawsphere from '../assets/Logo-Pawsphere.svg';
import warningIcon from '../assets/Warning.svg';

const Navbar = ({ isLoggedIn = false, handleLogout }) => {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const primaryMenus = ['Home', 'AI Diagnosis', 'Vet Connect'];
  const secondaryMenus = ['Marketplace', 'Adoption', 'Donation'];

  return (
    <>
      <nav className={`font-poppins w-full sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-brand-blue-dark/95 backdrop-blur-md py-3 shadow-2xl border-b border-white/5' 
          : 'bg-brand-blue-dark py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="shrink-0">
              <img 
                src={logoPawsphere} 
                alt="Pawsphere Logo" 
                className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => setActiveMenu('Home')}
              />
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {primaryMenus.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveMenu(item)}
                  className={`relative px-6 py-2 rounded-full text-base font-bold transition-colors duration-300 cursor-pointer
                    ${activeMenu === item ? 'text-brand-blue-dark' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  {activeMenu === item && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-white rounded-full shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item}</span>
                </button>
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
                          <button 
                            key={item} 
                            onClick={() => {setActiveMenu(item); setIsDropdownOpen(false);}}
                            className="block w-full text-left px-6 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-blue-dark transition-all cursor-pointer"
                          >
                            {item}
                          </button>
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
                  <button className="px-7 py-2 text-white font-bold text-base hover:opacity-80 transition-all cursor-pointer">
                    Login
                  </button>
                  <button className="px-7 py-2 bg-white text-brand-orange font-bold rounded-full text-base shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
                    Register
                  </button>
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
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white outline-none cursor-pointer">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* PAW ALERT: Hanya muncul jika menu mobile TIDAK sedang terbuka */}
      {!isMobileMenuOpen && (
        <div className="fixed bottom-6 right-4 z-60 flex flex-col items-end group">
          <div className="mb-2 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl translate-x-2 group-hover:translate-x-0 uppercase tracking-widest pointer-events-none">
            Paw Alert
          </div>
          <button className="w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-all duration-300 flex items-center justify-center group-active:scale-90 cursor-pointer">
            <img src={warningIcon} alt="!" className="w-7 h-7 brightness-0 invert animate-pulse" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-49 bg-brand-blue-dark flex flex-col pt-24 px-8 lg:hidden"
          >
            <div className="space-y-6">
              {[...primaryMenus, ...secondaryMenus].map((item) => (
                <button 
                  key={item} 
                  className="block w-full text-left text-xl font-black text-white/90 border-b border-white/5 pb-4 cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-auto mb-12 flex flex-col gap-4">
              {!isLoggedIn ? (
                <>
                  <button className="w-full py-4 bg-brand-orange text-white rounded-2xl font-bold text-lg cursor-pointer">Login</button>
                  <button className="w-full py-4 bg-white text-brand-orange rounded-2xl font-bold text-lg cursor-pointer">Register</button>
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