"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
const LZString = require("lz-string");
import { useAuth } from "@/app/context/auth-context";
import Image from "next/image";
import { TbDiscount2 } from "react-icons/tb";
import { Star } from "lucide-react";
import { AiOutlineLoading } from "react-icons/ai";

interface DealData{
  details:string;
  discount:number;
  discount_price:number;
  image:string;
  original_price:number;
  ratings:number;
  reviews:number;
  name:string
}

const Page = () => {
  const { user } = useAuth();
  const id = useParams();
  const [data, setData] =useState<DealData>()
  const originalLink = LZString.decompressFromEncodedURIComponent(id.deal);
  const [loading, setLoading] = useState(false)
  const GetDataHandler = async () => 
  {
    setLoading(true)
    try {
      let resp;
      if (originalLink.includes("amazon")) {
        resp = await axios.post(`${API_LINK}/details/amazon`, {
          url: originalLink,
        });
      } else if (originalLink.includes("flipkart")) {
        resp = await axios.post(`${API_LINK}/details/flipkart`, {
          url: originalLink,
        });
      } else if (originalLink.includes("ajio")) {
        resp = await axios.post(`${API_LINK}/details/ajio`, {
          url: originalLink,
        });
      } else if (originalLink.includes("myntra")) {
        resp = await axios.post(`${API_LINK}/details/myntra`, {
          url: originalLink,
        });
      }
      setData(resp?.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)

    }
  };

  useEffect(() => {
    GetDataHandler();
  }, [originalLink]);

  const getLogoHandler = useMemo(() => {
    if (originalLink?.includes("myntra")) return "/logos/myntra.png";
    if (originalLink?.includes("amazon")) return "/logos/amazon.png";
    if (originalLink?.includes("flipkart")) return "/logos/flipkart.png";
    if (originalLink?.includes("ajio")) return "/logos/ajio.png";
    if (originalLink?.includes("meesho")) return "/logos/meesho.png";
    return "";
  }, [originalLink]);
  

  return (
    <main className="flex justify-center items-center flex-col">
     {data && <section className="my-10 w-[80%] mx-auto flex justify-center">
      <Image alt="" src={data.image} width={500} height={500} className="object-contain mx-4 w-1/3"/>
      <div className="w-2/3">
      {getLogoHandler && (
        <Image
          src={getLogoHandler}
          alt=""
          className="w-10 mt-3"
          height={200}
          width={200}
          loading="lazy"
        />
      )}
        <p className="text-xl font-semibold mt-3">{data.name}</p>
        <div className="flex items-center md:items-end mt-3">
          <p className="font-semibold text-2xl mr-2">
            ₹{data.discount_price}
          </p>
          {data.original_price && (
            <p className="font-medium text-lg line-through">
              ₹{data.original_price}
            </p>
          )}
          <span className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-xs md:text-sm font-medium ml-3 text-center flex justify-center items-center">
            <TbDiscount2 className="text-lg mr-1 group-hover:animate-spin-slow" />
            {data.discount
              ? data.discount
              : (
                  ((data.original_price - data.discount_price) / data.original_price) *
                  100
                ).toFixed(0)}
            %
          </span>
        </div>
        <div className="flex mt-1">
        <div className="flex items-center mt-2 mr-4 bg-primary text-white px-3 py-1 rounded-md">
          <Star size={22}/> <span className="text-lg ml-2">
          {data.reviews}
          </span>
        </div>
        </div>
        <p className="mt-3">{data.details}</p>
      </div>
      </section>
      }
      {loading && <div className="flex justify-center items-center h-[60vh] w-full flex-col">
      <AiOutlineLoading className="animate-spin text-primary text-xl"/>
    </div>}
      {!data && !loading && <div className="flex justify-center items-center h-[60vh] w-full flex-col">
      <p>Aap Galat Rah Pur Chal Rahe Ho</p>
      
    </div>}
    </main>
  );
};

export default Page;