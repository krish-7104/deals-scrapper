import React from "react";

const LoadingCard = () => {
  return (
    <div className="bg-white shadow-md p-4 rounded-md flex cursor-pointer h-[160px]">
      <div className="w-1/3 h-32 object-contain mr-4 py-2 bg-slate-200 animate-pulse"></div>
      <div className="w-2/3">
        <div className="w-full bg-slate-200 animate-pulse h-[20%]"></div>
        <div className="w-full bg-slate-200 animate-pulse h-[40%] mt-4"></div>
      </div>
    </div>
  );
};

export default LoadingCard;
