import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 relative hover:shadow-lg transition-shadow duration-300 justify-between">
      {product.discount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#FF4D4F] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex">
            -{product.discount}%
          </span>
        </div>
      )}

      {product.hasPrescription && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-[#E6F7FF] text-[#1890FF] border border-[#91D5FF] text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            Resep
          </span>
        </div>
      )}
      {/* Image */}
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-xl">
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 grow">
        <p className="text-[11px] text-gray-400 font-medium">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-10">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-yellow-400 text-sm">⭐</span>
          <span className="text-sm font-bold text-gray-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Pricing */}
        <div className="mt-3">
          <p className="text-lg font-extrabold text-[#0F172A]">
            {formatRupiah(product.price)}
          </p>
          {product.oldPrice && (
            <p className="text-xs text-gray-400 line-through mt-0.5">
              {formatRupiah(product.oldPrice)}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button onClick={() => addToCart(product)} className="w-full mt-2 bg-[#2C6E91] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#235875] transition flex items-center justify-center gap-2">
        <span>+</span> Keranjang
      </button>
    </div>
  );
};

export default ProductCard;