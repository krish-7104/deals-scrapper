import React from "react";
import { TbDiscount2 } from "react-icons/tb";

const DealCard = ({ deal }) => {
  const { title, image, original_price, discount_price, link, discount } = deal;
  return (
    <section
      className="w-[30%] bg-white shadow-md p-4 rounded-md mb-6 flex cursor-pointer"
      onClick={() => window.open(link)}
    >
      <img src={image} alt="" className="w-1/3 h-32 object-contain mr-4 py-2" />
      <div className="flex flex-col justify-start items-start w-2/3">
        <div className="flex justify-between items-end w-full mb-2">
          <div className="flex items-end">
            <p className="font-semibold text-xl mr-2">₹{discount_price}</p>
            <p className="font-medium line-through">₹{original_price}</p>
          </div>
          <span className="bg-red-600 text-white px-3 py-1 rounded-2xl text-sm font-medium ml-auto text-center flex justify-center items-center">
            <TbDiscount2 className="animate-spin-slow text-lg mr-1" />
            {discount}%
          </span>
        </div>
        <p className="line-clamp-3">{title}</p>
      </div>
    </section>
  );
};

export default DealCard;
