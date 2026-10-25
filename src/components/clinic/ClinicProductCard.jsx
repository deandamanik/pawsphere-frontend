import React from 'react';

export default function ClinicProductCard({ product }) {
  return (
    <div className="border border-slate-200/90 rounded-2xl p-4 md:p-5 flex items-center gap-4 bg-white">
      <div className="w-20 h-20 rounded-xl bg-[#E6EFF5] overflow-hidden shrink-0 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="text-base md:text-lg font-bold text-[#1E3A4C]">
          {product.name}
        </h4>
        <p className="text-sm text-slate-400 mt-0.5 mb-1.5">{product.meta}</p>
        <p className="text-base md:text-lg font-bold text-[#1E3A4C]">
          {product.price}
        </p>
      </div>
    </div>
  );
}