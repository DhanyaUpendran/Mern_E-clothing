import React from 'react';
import bannerImage from '../assets/Fashion-Sale-Banner.jpg';  

const Banner = () => {
  return (
    <div className="relative w-full h-64">
      <img
        src={bannerImage} 
        alt="Banner" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center  ">
        <h1 className="text-white text-3xl font-bold">WELCOME TO SHOPSYII</h1>
      </div>
    </div>
  );
};

export default Banner;

