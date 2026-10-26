import React from 'react';

export default function ClinicGallery({ images = [], clinicName }) {
  const [mainImage, secondImage, thirdImage] = images;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
      <div className="md:col-span-8 h-72 md:h-[380px] rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
        {mainImage && (
          <img
            src={mainImage}
            alt={clinicName}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="md:col-span-4 grid grid-rows-2 gap-4 h-72 md:h-[380px]">
        <div className="rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
          {secondImage && (
            <img
              src={secondImage}
              alt={`${clinicName} 2`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
          {thirdImage && (
            <img
              src={thirdImage}
              alt={`${clinicName} 3`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}