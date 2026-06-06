import { motion } from 'framer-motion';
import Button from '../ui/Button';
import homeDog from '../../assets/home/home-dog.png';
import warningIcon from '../../assets/Warning.svg';

const Hero = () => {
  const features = ["AI Triage", "Dokter Terverifikasi", "Donasi Transparan", "Emergency Rescue"];

  return (
    <section className="relative min-h-dvh flex items-center justify-center pt-28 pb-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={homeDog} 
          alt="Hero" 
          className="w-full h-full object-cover object-[center_top]" 
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white text-3xl sm:text-4xl md:text-7xl font-black leading-[1.2] md:leading-[1.1] mb-6 tracking-tight">
            Smart Care For <span className="text-brand-blue-normal">Every</span> <br />
            <span className="text-brand-blue-normal">Pet</span>, Rescue & Shelter.
          </h1>

          <p className="text-white/90 text-sm md:text-xl max-w-4xl mx-auto mb-8 md:mb-10 font-medium leading-relaxed">
            PawSphere menghubungkan pemilik hewan, dokter hewan, shelter, dan 
            relawan dalam satu platform kesehatan digital yang terintegrasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-12 md:mb-16">
            <Button to="/ai-diagnose" variant="blue" className="w-full sm:w-auto px-10 py-3.5 text-lg">
              Mulai AI Diagnosis
            </Button>
            
            <Button to="/paw-alert" variant="orange" className="w-full sm:w-auto px-10 py-3.5 text-lg flex gap-3 justify-center items-center">
              <img src={warningIcon} alt="!" className="w-6 h-6 brightness-0 invert" />
              Laporkan Darurat
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-w-md mx-auto justify-items-center md:flex md:flex-row md:max-w-none md:items-center md:justify-center md:gap-x-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90 w-full justify-start sm:justify-center md:w-auto">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-brand-blue-normal flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-blue-normal rounded-full" />
                </div>
                <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">
                  {feature
                }</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;