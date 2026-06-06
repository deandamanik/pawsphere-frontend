import { useEffect, useRef, useState } from 'react';
import { animate, useInView, motion } from 'framer-motion';

const Counter = ({ value, isInView }) => {
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    const numericRaw = value.replace(/[^0-9]/g, '');
    const numericValue = parseInt(numericRaw, 10);
    
    if (isNaN(numericValue)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentValue(value);
      return;
    }

    const prefix = value.match(/^[^0-9]+/)?.[0] || '';
    const suffix = value.match(/[^0-9]+$/)?.[0] || '';

    if (isInView) {
      // PERBAIKAN: Durasi dipercepat jadi 1 detik agar angka cepat sampai target
      const controls = animate(0, numericValue, {
        duration: 1,
        ease: 'easeOut',
        onUpdate: (latest) => {
          let formattedNumber = Math.floor(latest).toLocaleString('en-US');
          
          if (prefix.includes('Rp')) {
            formattedNumber = latest.toFixed(1).replace('.', ',');
          }

          setCurrentValue(`${prefix}${formattedNumber}${suffix}`);
        },
      });

      return () => controls.stop();
    }
  }, [value, isInView]);

  return <span>{currentValue || value}</span>;
};

const Stats = () => {
  const statsData = [
    { label: "Hewan Diselamatkan", value: "12,500+" },
    { label: "Dokter Terverifikasi", value: "350+" },
    { label: "Shelter Partner", value: "180+" },
    { label: "Dana Tersalurkan", value: "Rp 2.1M" },
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 }, 
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, 
        ease: "easeOut"
      },
    },
  };

  return (
    <section className="bg-white py-12 md:py-24 border-b border-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 sm:gap-x-8"
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={`flex flex-col items-center text-center px-2
                ${index % 2 === 0 ? 'border-r border-slate-100 md:border-r-0' : ''} 
                ${index < 3 ? 'md:border-r md:border-slate-100' : ''}`}
            >
              <h2 className="text-brand-blue-normal text-3xl sm:text-4xl md:text-5xl font-black mb-2 tabular-nums">
                <Counter value={stat.value} isInView={isInView} />
              </h2>
              <p className="text-brand-blue-normal/80 font-bold text-xs sm:text-sm md:text-base max-w-37.5 md:max-w-none leading-snug">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Stats;