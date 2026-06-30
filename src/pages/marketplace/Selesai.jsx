import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Selesai = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || null;
  const fmtRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

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


          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-6">
            Terima kasih! Pesanan Anda telah kami terima dan sedang diproses oleh Apotek PawSphere.
          </p>

          {order && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-12 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">ID Pesanan</span>
                <span className="font-semibold text-gray-800">{String(order.id).slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-emerald-600">Dibayar</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-gray-900">{fmtRp(order.total_amount)}</span>
              </div>
            </div>
          )}

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