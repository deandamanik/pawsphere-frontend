import { motion } from 'framer-motion';

const features = [
  'AI chat diagnosa gejala awal',
  'Konsultasi dokter hewan terpercaya',
  'Rescue, adopsi, dan donasi shelter',
];

const AuthFeatures = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 text-center md:text-left flex flex-col items-center md:items-start w-full"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-blue-normal leading-tight mb-0 md:mb-5">
        Permudah Perawatan <br className="hidden sm:block" />
        Kesehatan Hewan <br className="hidden sm:block" />
        Anda
      </h1>

      <p className="hidden md:block text-brand-blue-normal text-base leading-relaxed mb-8 max-w-md">
        Akses AI chat diagnosa, konsultasi dokter hewan, laporan rescue darurat,
        adopsi, dan donasi shelter dalam satu platform terintegrasi.
      </p>

      <div className="hidden md:flex flex-col gap-3">
        {features.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 border border-brand-blue-normal/30 rounded-full px-5 py-2.5 w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue-normal shrink-0" />
            <span className="text-brand-blue-normal text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AuthFeatures;