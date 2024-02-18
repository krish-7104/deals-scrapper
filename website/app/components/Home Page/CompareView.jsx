import React from "react";
import { TbDiscount2 } from "react-icons/tb";

const CompareView = ({ data }) => {
  return (
    <section>
      <div className="w-full shadow-sm flex justify-center items-center flex-col rounded border p-6">
        <div className="flex justify-between items-center w-full mb-5">
          <span className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-sm font-medium text-center flex justify-center items-center ">
            <TbDiscount2 className="animate-spin-slow text-lg mr-1" />
            {(
              ((data.best.original_price - data.best.discount_price) /
                data.best.original_price) *
              100
            ).toFixed(0)}
            %
          </span>
          <span className="">
            <img
              src={`${data.company}.png`}
              width={30}
              height={30}
              alt={data.best.company}
            />
          </span>
        </div>
        <img
          src={data.best.image}
          height={200}
          alt="product"
          className="h-[200px]"
        />
        <div className="w-full mt-6 h-[70px]">
          <span className="font-bold text-xs">PRODUCT TITLE</span>
          <p className="line-clamp-2">{data.best.title}</p>
        </div>
        <div className="flex items-end w-full mt-2">
          <p className="font-semibold text-xl mr-2">
            ₹{data.best.discount_price}
          </p>
          <p className="font-medium line-through">
            ₹{data.best.original_price}
          </p>
        </div>
        <button
          className="ml-auto mt-2 bg-black text-white px-2 py-1 rounded"
          onClick={() => window.open(data.best.link)}
        >
          Buy Now
        </button>
      </div>
    </section>
  );
};

export default CompareView;
