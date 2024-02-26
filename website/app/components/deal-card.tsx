import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { TbDiscount2 } from "react-icons/tb";
import lzString from "lz-string";
import { AddSearchHandler } from "@/utils/search-store";
import { useAuth } from "../context/auth-context";

interface DealProps {
  title: string;
  image: string;
  link: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

const DealCard = ({ deal }: { deal: DealProps }) => {
  const { user } = useAuth();
  const router = useRouter();
  const getLogoHandler = useMemo(() => {
    if (deal.link.includes("myntra")) return "/logos/myntra.png";
    if (deal.link.includes("amazon")) return "/logos/amazon.png";
    if (deal.link.includes("flipkart")) return "/logos/flipkart.png";
    if (deal.link.includes("ajio")) return "/logos/ajio.png";
    if (deal.link.includes("meesho")) return "/logos/meesho.png";
    return "";
  }, [deal.link]);

  const { title, image, original_price, discount_price, link, discount } = deal;

  const ClickHandler = () => {
    const compressedTitle = lzString.compressToEncodedURIComponent(title);
    user && AddSearchHandler(user?.email ? user.email : "", title);
    router.push(`/details/${compressedTitle}`);
  };

  return (
    <div
      className="bg-white border p-4 rounded-md flex cursor-pointer md:h-[160px] group w-full overflow-hidden"
      key={title}
      onClick={ClickHandler}
    >
      <Image
        src={image}
        className="w-1/3 h-28 md:h-32 object-contain mr-4 py-2 group-hover:scale-105 transition-animate"
        height={200}
        width={200}
        alt=""
        loading="lazy"
      />
      <div className="flex flex-col justify-start items-start w-2/3">
        <div className="flex justify-between items-end w-full mb-2">
          <div className="flex items-center md:items-end">
            <p className="font-semibold md:text-xl mr-2">₹{discount_price}</p>
            {original_price && (
              <p className="font-medium text-xs md:text-base line-through">
                ₹{original_price}
              </p>
            )}
          </div>
          {original_price && discount_price && (
            <span className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-xs md:text-sm font-medium ml-auto text-center flex justify-center items-center">
              <TbDiscount2 className="text-lg mr-1 group-hover:animate-spin-slow" />
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
        <p className="line-clamp-3 text-xs w-full md:text-sm">{title}</p>
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
    </div>
  );
};

export default DealCard;
