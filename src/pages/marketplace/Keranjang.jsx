import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Keranjang = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Amoxicillin 250mg Tablet',
      price: 45000,
      oldPrice: 60000,
      quantity: 1,
      image: "/src/assets/product/Amoxicillin.png",
    },
    {
      id: 2,
      name: 'Ivermectin 1% Injection',
      price: 35000,
      oldPrice: null,
      quantity: 3,
      image: "/src/assets/product/Ivermectin.png",
    },
  ]);

  // Fungsi helper format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(number);
  };

  // Fungsi untuk mengubah jumlah barang
  const updateQuantity = (id, delta) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // Minimal 1
        }
        return item;
      })
    );
  };

  // Fungsi untuk menghapus barang
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Perhitungan Ringkasan Belanja
  const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = 15000;
  const tax = 5000;
  const total = subTotal - discount + tax;

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      {/* BANNER SECTION */}
      <section className="bg-[#C2D4DF] w-full mb-6 sm:mb-10">
        <div className="max-w-360 mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-2">
              Pet Care Marketplace
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Apotek & Toko Hewan Digital Terpercaya
            </p>
          </div>

          <button 
            onClick={() => navigate('/keranjang')} 
            className="w-full sm:w-auto justify-center mt-4 sm:mt-0 bg-[#2C6E91] text-white px-8 py-3.5 rounded-full shadow-lg flex items-center gap-3 hover:bg-[#235875] transition-all duration-300"
          >
            <img 
              src="/src/assets/marketplace/Keranjang-Icon.svg" 
              alt="Cart" 
              className="w-5 h-5 object-contain" 
            />
            <span className="font-semibold text-sm">Keranjang</span>
          </button>
        </div>
      </section>

      {/* MAIN CONTENT */}
    
      <main className="max-w-360 mx-auto px-4 sm:px-6 pb-20">
        
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          
          {/* KOLOM KIRI: Tabel Keranjang */}
          <div className="w-full lg:w-2/3 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Keranjang Anda</h2>
            </div>

            {/* Isi Tabel */}
            
            <div className="w-full overflow-x-auto">
             
              <table className="w-full min-w-175 text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-4 sm:px-6 w-[45%]">Produk</th>
                    <th className="py-4 px-4 sm:px-6 w-[20%]">Harga</th>
                    <th className="py-4 px-4 sm:px-6 w-[15%] text-center">Jumlah</th>
                    <th className="py-4 px-4 sm:px-6 w-[20%] text-right">Sub-Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 sm:py-6 px-4 sm:px-6 flex items-center gap-3 sm:gap-4">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <span className="font-medium text-gray-800 line-clamp-2">{item.name}</span>
                      </td>

                      <td className="py-4 sm:py-6 px-4 sm:px-6">
                        {item.oldPrice && (
                          <div className="text-xs text-gray-400 line-through mb-0.5">
                            {formatRupiah(item.oldPrice)}
                          </div>
                        )}
                        <div className="font-medium text-gray-700">
                          {formatRupiah(item.price)}
                        </div>
                      </td>

                      <td className="py-4 sm:py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 w-20 sm:w-24 mx-auto">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-black">
                            &minus;
                          </button>
                          <span className="font-medium text-gray-800">
                            {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-black">
                            &#43;
                          </button>
                        </div>
                      </td>

                      <td className="py-4 sm:py-6 px-4 sm:px-6 text-right font-medium text-gray-800">
                        {formatRupiah(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons Bawah Tabel */}
            
            <div className="p-4 sm:p-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <button 
                onClick={() => navigate('/marketplace')} 
                className="w-full sm:w-auto justify-center bg-white border-2 border-[#2C6E91] text-[#2C6E91] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2"
              >
                <span>&larr;</span> Kembali
              </button>
              <button className="w-full sm:w-auto justify-center bg-[#2C6E91] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#235875] transition">
                Update Keranjang
              </button>
            </div>
            
          </div>

          {/* KOLOM KANAN: Ringkasan Total */}
    
          <div className="w-full lg:w-1/3 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-bold text-gray-900 mb-6 text-lg">Total Keranjang</h2>
            
            <div className="flex flex-col gap-4 text-sm text-gray-600 mb-6">
              <div className="flex justify-between items-center">
                <span>Sub-total</span>
                <span className="font-semibold text-gray-800">{formatRupiah(subTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-semibold text-gray-800">Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <span className="font-semibold text-gray-800">{formatRupiah(discount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax</span>
                <span className="font-semibold text-gray-800">{formatRupiah(tax)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-lg sm:text-xl text-[#2C6E91]">{formatRupiah(total)}</span>
            </div>

            <button 
              onClick={() => navigate('/Pembayaran')}
              className="w-full bg-[#2C6E91] text-white py-4 rounded-xl font-bold hover:bg-[#235875] transition flex items-center justify-center gap-2"
            >
              CHECKOUT <span>&rarr;</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Keranjang;