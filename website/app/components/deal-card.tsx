import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { TbDiscount2 } from "react-icons/tb";

interface DealProps {
  title: string;
  image: string;
  link: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

const DealCard = ({ deal }: { deal: DealProps }) => {
  const getLogoHandler = useMemo(() => {
    if (deal.link.includes("myntra")) return "/logos/myntra.png";
    if (deal.link.includes("amazon")) return "/logos/amazon.png";
    if (deal.link.includes("flipkart")) return "/logos/flipkart.png";
    if (deal.link.includes("ajio")) return "/logos/ajio.png";
    if (deal.link.includes("meesho")) return "/logos/meesho.png";
    return "";
  }, [deal.link]);

  const { title, image, original_price, discount_price, link, discount } = deal;

  return (
    <Link
      className="bg-white border p-4 rounded-md flex cursor-pointer h-[160px]"
      href={link}
      target="_blank"
      rel="noreferrer"
      key={title}
    >
      <Image
        src={image}
        className="w-1/3 h-32 object-contain mr-4 py-2"
        height={200}
        width={200}
        alt=""
        loading="lazy"
      />
      <div className="flex flex-col justify-start items-start w-2/3">
        <div className="flex justify-between items-end w-full mb-2">
          <div className="flex items-end">
            <p className="font-semibold text-xl mr-2">₹{discount_price}</p>
            {original_price && (
              <p className="font-medium line-through">₹{original_price}</p>
            )}
          </div>
          {original_price && discount_price && (
            <span className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-sm font-medium ml-auto text-center flex justify-center items-center">
              <TbDiscount2 className="text-lg mr-1" />
              {discount
                ? discount
                : (
                    ((original_price - discount_price) / original_price) *
                    100
                  ).toFixed(0)}
              %
            </span>
          )}
        </div>
        <p className="line-clamp-3 text-sm">{title}</p>
        {getLogoHandler && (
          <Image
            src={getLogoHandler}
            alt=""
            className="w-6 mt-3"
            height={30}
            width={30}
            loading="lazy"
          />
        )}
      </div>
    </Link>
  );
};

export default DealCard;
