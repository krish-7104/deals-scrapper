import React from "react";
import { TbDiscount2 } from "react-icons/tb";

const DealCard = ({ deal }) => {
  const getLogoHandler = () => {
    if (deal.link.includes("myntra")) return "myntra.png";
    if (deal.link.includes("amazon")) return "amazon.png";
    if (deal.link.includes("flipkart")) return "flipkart.png";
    if (deal.link.includes("ajio")) return "ajio.png";
  };
  const { title, image, original_price, discount_price, link, discount } = deal;
  return (
    <a
      className="bg-white shadow-md p-4 rounded-md flex cursor-pointer h-[160px]"
      href={link}
      target="_blank"
      rel="noreferrer"
    >
      <img src={image} alt="" className="w-1/3 h-32 object-contain mr-4 py-2" />
      <div className="flex flex-col justify-start items-start w-2/3">
        <div className="flex justify-between items-end w-full mb-2">
          <div className="flex items-end">
            <p className="font-semibold text-xl mr-2">₹{discount_price}</p>
            <p className="font-medium line-through">₹{original_price}</p>
          </div>
          <span className="border-red-600 text-red-600 border-2 px-2 py-[2px] rounded-2xl text-sm font-medium ml-auto text-center flex justify-center items-center">
            <TbDiscount2 className="animate-spin-slow text-lg mr-1" />
            {discount
              ? discount
              : (
                  ((original_price - discount_price) / original_price) *
                  100
                ).toFixed(0)}
            %
          </span>
        </div>
        <p className="line-clamp-3 text-sm">{title}</p>
        <img src={getLogoHandler()} alt="" className="w-6 mt-3" />
      </div>
    </a>
  );
};

export default DealCard;
