import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/marketplace.service';

const Pembayaran = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart: cartItems, subtotal, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('qris');
  const [placing, setPlacing] = useState(false);

  // Form pembeli (otomatis terisi dari akun bila sudah login)
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [catatan, setCatatan] = useState('');

  // Wilayah Indonesia (provinsi -> kabupaten/kota), dimuat dari API publik emsifa.
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [provinsiId, setProvinsiId] = useState('');
  const [provinsiNama, setProvinsiNama] = useState('');
  const [kotaNama, setKotaNama] = useState('');
  const [loadingKota, setLoadingKota] = useState(false);

  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((r) => r.json())
      .then((data) => setProvinces(Array.isArray(data) ? data : []))
      .catch(() => setProvinces([]));
  }, []);

  const handleProvinsiChange = (e) => {
    const id = e.target.value;
    const found = provinces.find((p) => p.id === id);
    setProvinsiId(id);
    setProvinsiNama(found ? found.name : '');
    setKotaNama('');
    setRegencies([]);
    if (!id) return;
    setLoadingKota(true);
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/regencies/' + id + '.json')
      .then((r) => r.json())
      .then((data) => setRegencies(Array.isArray(data) ? data : []))
      .catch(() => setRegencies([]))
      .finally(() => setLoadingKota(false));
  };

  useEffect(() => {
    if (user) {
      setNama(user.name || '');
      setEmail(user.email || '');
      setTelepon(user.phoneNumber || '');
    }
  }, [user]);


  // Perhitungan Harga
  const subTotal = subtotal;
  const discount = 0;
  const tax = 0;
  const total = subTotal - discount + tax;

  const handleCheckout = async () => {
    if (placing) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/marketplace' } } });
      return;
    }
    if (cartItems.length === 0) {
      alert('Keranjang masih kosong.');
      return;
    }
    setPlacing(true);
    try {
      const wilayah = [kotaNama, provinsiNama, kodePos].filter(Boolean).join(', ');
      const shippingAddress =
        [nama, telepon, alamat, wilayah].filter(Boolean).join(' | ') +
        (catatan ? ' | Catatan: ' + catatan : '');
      const order = await createOrder({
        items: cartItems.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        payment_method: selectedPayment,
        shipping_address: shippingAddress || undefined,
      });
      clearCart();
      navigate('/Selesai', { state: { order } });
    } catch (err) {
      alert(err.message || 'Gagal membuat pesanan. Coba lagi.');
    } finally {
      setPlacing(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Daftar Metode Pembayaran
  const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: '/src/assets/marketplace/COD-icon.svg' },
    { id: 'gopay', label: 'Gopay', icon: '/src/assets/marketplace/Gopay-icon.svg' },
    { id: 'dana', label: 'Dana', icon: '/src/assets/marketplace/DANA-icon.svg' },
    { id: 'qris', label: 'QRIS', icon: '/src/assets/marketplace/QRIS-icon.svg' },
    { id: 'transfer', label: 'Transfer Bank', icon: '/src/assets/marketplace/Bank-icon.svg' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      
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
         className="mt-6 sm:mt-0 bg-[#2C6E91] text-white px-8 py-3.5 rounded-full shadow-lg flex items-center gap-3 hover:bg-[#235875] transition-all duration-300">
            <img 
              src="/src/assets/marketplace/Keranjang-Icon.svg" 
              alt="Cart" 
              className="w-5 h-5 object-contain" 
            />
            <span className="font-semibold text-sm">Keranjang</span>
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-360 mx-auto px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Informasi Pembayaran */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="font-bold text-lg text-gray-900 mb-6">Informasi Pembayaran</h2>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#91D5FF] focus:ring-1 focus:ring-[#91D5FF]" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Alamat</label>
                  <input type="text" value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Alamat pengiriman" className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#91D5FF] focus:ring-1 focus:ring-[#91D5FF]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Provinsi</label>
                    <select value={provinsiId} onChange={handleProvinsiChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 outline-none focus:border-[#91D5FF] bg-white">
                      <option value="">Pilih provinsi...</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Kabupaten/Kota</label>
                    <select value={kotaNama} onChange={(e) => setKotaNama(e.target.value)} disabled={!provinsiId || loadingKota} className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 outline-none focus:border-[#91D5FF] bg-white disabled:bg-gray-50 disabled:text-gray-400">
                      <option value="">{!provinsiId ? 'Pilih provinsi dulu' : loadingKota ? 'Memuat...' : 'Pilih kabupaten/kota...'}</option>
                      {regencies.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Kode Pos</label>
                    <input type="text" value={kodePos} onChange={(e) => setKodePos(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#91D5FF] focus:ring-1 focus:ring-[#91D5FF]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#91D5FF] focus:ring-1 focus:ring-[#91D5FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Nomor Telpon</label>
                    <input type="tel" value={telepon} onChange={(e) => setTelepon(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#91D5FF] focus:ring-1 focus:ring-[#91D5FF]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="font-bold text-lg text-gray-900 mb-6">Metode Pembayaran</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className="flex flex-col items-center justify-center p-4 border-r last:border-r-0 border-gray-100 cursor-pointer hover:bg-gray-50 transition"
                  >
                
                    <div className="h-10 mb-3 flex items-center justify-center">
                       <img src={method.icon} alt={method.label} className="max-h-full object-contain" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 text-center mb-4">{method.label}</span>
                    
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-[#FF6B00]' : 'border-gray-300'}`}>
                      {selectedPayment === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="font-bold text-lg text-gray-900 mb-6">Informasi Tambahan</h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Catatan Order <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <textarea 
                  rows="4" 
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Catatan tentang pesanan Anda, misalnya catatan khusus untuk pengiriman" 
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#91D5FF] focus:ring-1 focus:ring-[#91D5FF] resize-none"
                ></textarea>
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Ringkasan Keranjang */}
          <div className="w-full lg:w-1/3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="font-bold text-gray-900 mb-6">Total Keranjang</h2>
            
            {/* List Barang */}
            <div className="flex flex-col gap-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gray-50 rounded border border-gray-100 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-800 line-clamp-1">{item.name}</span>
                    <span className="text-sm text-[#2C6E91] font-semibold">{item.quantity} x {formatRupiah(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* Rincian Harga */}
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

            {/* Total Akhir */}
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-lg text-gray-900">{formatRupiah(total)}</span>
            </div>

            {/* Tombol Checkot*/}
            <button 
              onClick={handleCheckout}
              disabled={placing}
              className="w-full bg-[#2C6E91] disabled:opacity-60 text-white py-4 rounded-xl font-bold hover:bg-[#235875] transition flex items-center justify-center gap-2"
            >
              {placing ? 'MEMPROSES...' : 'CHECKOUT'} <span>&rarr;</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Pembayaran;