import React from 'react';

export const GoogleSlidesLogo = () => (
  <div className="w-10 h-12 bg-[#F4B400] relative flex items-center justify-center shadow-sm rounded-sm overflow-hidden">
    {/* The white shape representing slides */}
    <div className="relative w-6 h-6">
      <div className="absolute top-0 left-0 w-5 h-4 border-2 border-white rounded-[1px]"></div>
      <div className="absolute bottom-0 right-0 w-5 h-4 bg-white/30 rounded-[1px]"></div>
      <div className="absolute bottom-0 right-0 w-5 h-4 border-2 border-white rounded-[1px] bg-[#F4B400]"></div>
    </div>
  </div>
);
