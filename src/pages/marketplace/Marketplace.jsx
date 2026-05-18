import React, { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { productsData } from '../../data/product';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const categories = ['Semua', 'Obat', 'Vitamin', 'Makanan'];
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const navigate = useNavigate();

  const filteredProducts = selectedCategory === 'Semua' 
    ? productsData 
    : productsData.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#ffffff]">

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

      {/* MAIN CONTENT */}
      <main className="max-w-360 mx-auto px-4 sm:px-6 pb-10 relative">
        
        {/* ACTION BAR (SEARCH & FILTER) */}

        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 mb-6 sm:mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 shadow-sm">
          
          <div className="relative grow w-full max-w-2xl">
            <img 
              src="/src/assets/marketplace/Search-Icon.svg" 
              alt="Search" 
              className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 object-contain opacity-50" 
            />
            <input 
              type="text" 
              placeholder="Cari produk, obat, merek..." 
              className="w-full pl-12 sm:pl-14 pr-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-100 rounded-full text-sm text-[#858585] focus:ring-2 focus:ring-[#91D5FF] focus:border-[#91D5FF] outline-none"
            />
          </div>

          <button className="flex items-center justify-center gap-2.5 text-sm font-semibold text-gray-700 px-6 py-3.5 sm:py-4 border border-gray-200 rounded-full hover:bg-gray-50 w-full sm:w-auto whitespace-nowrap">
            <img 
              src="/src/assets/marketplace/filter-icon.svg" 
              alt="Filter" 
              className="w-5 h-5 object-contain" 
            />
            Filter
            <span className="text-gray-400 ml-1">▼</span>
          </button>
        </section>
        
        {/* CATEGORY TABS & INFO BADGE */}
        
        <section className="mb-8 sm:mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <div className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 sm:p-2 rounded-full border border-gray-100 shadow-sm w-max">
              {categories.map(category => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-[#2C6E91] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

  
          <div className="w-full lg:w-auto bg-[#FFFBE6] border border-[#FFE58F] text-[#D48806] text-sm font-medium px-5 py-3.5 rounded-xl flex items-center justify-center lg:justify-start gap-2.5 whitespace-nowrap">
            <img 
              src="/src/assets/marketplace/Resep-icon.svg" 
              alt="Resep" 
              className="w-5 h-5 object-contain" 
            />
            Resep Digital Diterima
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section>
       
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 sm:py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 mx-4 sm:mx-0">
              <span className="text-4xl sm:text-5xl mb-4 block">📦</span>
              Tidak ada produk di kategori {selectedCategory}.
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Marketplace;