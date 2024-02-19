import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { TbDiscount2 } from "react-icons/tb";
import DealCard from "../deal-card";

interface Deal {
  title: string;
  image: string;
  link: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

interface DealDataProp {
  company: string;
  best: Deal;
  data: Deal[];
}

const CompareView = ({ data }: { data: DealDataProp }) => {
  return (
    <section className="mb-10 w-[85%] mx-auto">
      <p className="font-semibold text-lg mb-1">Best Match Result</p>
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
            <Image
              src={`/logos/${data.company}.png`}
              width={30}
              height={30}
              alt={data.company}
            />
          </span>
        </div>
        <Image
          src={data.best.image}
          className={`${
            data.company === "myntra" || data.company === "ajio"
              ? "h-[250px]"
              : "h-[180px]"
          } w-auto object-contain `}
          height={200}
          width={200}
          alt="product"
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
        <div className="mt-5 w-full flex justify-evenly items-center gap-x-4">
          <Button size={"sm"} className="w-full">
            Add Price Tracker
          </Button>
          <Button
            size={"sm"}
            className="w-full bg-black hover:bg-black/90"
            onClick={() => window.open(data.best.link)}
          >
            Buy Now
          </Button>
        </div>
      </div>
      <p className="font-semibold text-lg mb-1 mt-5">Other Results</p>
      {data?.data?.slice(0, 8).map((item) => {
        return (
          <DealCard deal={item} key={item.discount_price + item.discount} />
        );
      })}
    </section>
  );
};

export default CompareView;
