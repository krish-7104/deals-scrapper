import React from "react";
import DealLoader from "../deal-loader";

const CompareLoader = () => {
  return (
    <section className="mb-10 w-[85%] mx-auto">
      <p className="font-semibold text-lg mb-1">Best Match Result</p>
      <div className="w-full shadow-sm flex justify-center items-center flex-col rounded border p-6">
        <div className="flex justify-between items-center w-full mb-5 h-[30px]">
          <div className="bg-slate-200 w-1/4 animate-pulse h-[30px] rounded-3xl"></div>
          <div className="bg-slate-200 w-1/4 animate-pulse h-[30px] rounded-3xl"></div>
        </div>
        <div className="h-[220px] w-[60%] bg-slate-200 animate-pulse"></div>
        <div className="w-full mt-3 h-[70px]">
          <p className="bg-slate-200 animate-pulse h-[40px] mt-1"></p>
        </div>
        <div className="w-full flex justify-evenly items-center gap-x-4">
          <div className="bg-slate-200 w-1/2 animate-pulse h-[40px]"></div>
          <div className="bg-slate-200 w-1/2 animate-pulse h-[40px]"></div>
        </div>
      </div>
      <p className="font-semibold text-lg mb-1 mt-5">Other Results</p>
      {Array(5)
        .fill("")
        .map((item, index) => {
          return <DealLoader key={index} />;
        })}
    </section>
  );
};

export default CompareLoader;
