import React from 'react';
import { useNavigate } from 'react-router-dom';

const Selesai = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      
      <section className="bg-[#C2D4DF] w-full mb-6 sm:mb-10">
        
        <div className="max-w-360 mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A mb-2">
              Pet Care Marketplace
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Apotek & Toko Hewan Digital Terpercaya
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Success Message Card */}
      <main className="max-w-360 mx-auto px-6 pb-20 flex justify-center">
        <div className="w-full max-w-3xl bg-white border border-gray-100 rounded-[40px] shadow-sm p-12 sm:p-20 flex flex-col items-center text-center">
          

          <div className="w-24 h-24 bg-white  rounded-full flex items-center justify-center mb-10">
            <img 
                src="/src/assets/marketplace/selesai-icon.svg" 
                alt="Success" 
                className="w-24 h-24 object-contain" 
            />
        </div>


          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-6">
            Pesanan Anda berhasil dilakukan
          </h2>


          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-12">
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
            Donec volutpat mattis sollicitudin diam.
          </p>

          {/* Tombol Kembali */}
          <button 
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-3 px-10 py-4 border-2 border-[#2C566C] text-[#2C566C] rounded-2xl font-bold hover:bg-[#2C566C] hover:text-white transition-all duration-300"
          >
          {/* Icon Centang Hijau */}
          <div className="w-5 h-5  flex items-center  ">
            <img 
                src="/src/assets/marketplace/ke home-icon.svg" 
                alt="Success" 
                className="w-5 h-5 object-contain" 
            />
        </div>
            KEMBALI KE HALAMAN
          </button>
        </div>
      </main>

    </div>
  );
};

export default Selesai;