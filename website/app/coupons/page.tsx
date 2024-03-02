"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiCoupon2Line } from "react-icons/ri";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";

interface AJIO {
  title: string;
  description: string;
  text: string;
}

interface AMAZON {
  title: string;
  description: string;
  image: string;
  link: string;
}

const Coupons = () => {
  const [amazon, setAmazon] = useState<AMAZON[]>([]);
  const [ajio, setAjio] = useState<AJIO[]>([]);

  const GetAmazonCoupon = async () => {
    try {
      const resp = await axios.get(`${API_LINK}/coupon/amazonCoupon`);
      setAmazon(resp.data.coupons);
    } catch (error) {
      console.log("Amazon Coupon Error");
    }
  };

  const GetAjioCoupon = async () => {
    try {
      const resp = await axios.get(`${API_LINK}/coupon/ajioCoupon`);
      setAjio(resp.data.coupons);
    } catch (error) {
      console.log("Ajio Coupon Error");
    }
  };

  useEffect(() => {
    GetAjioCoupon();
    GetAmazonCoupon();
  }, []);

  return (
    <main className="flex justify-center items-center flex-col">
      {amazon && (
        <section>
          <p className="my-7 text-center font-semibold text-2xl">
            Amazon Coupons
          </p>
          <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            {amazon.map((item) => {
              return (
                <div
                  key={item.title}
                  className="bg-white border-2 border-dashed border-primary p-3 rounded-md cursor-pointer flex flex-col justify-center items-center"
                  onClick={() => {
                    window.open(item.link);
                  }}
                >
                  <Image src={item.image} height={300} width={200} alt="" />
                  <div>
                    <p className="font-medium mb-1">{item.title}</p>
                    {<p className="text-sm line-clamp-2">{item.description}</p>}
                    <p className="text font-semibold flex justify-start mt-1 items-center">
                      <RiCoupon2Line className="text-primary text-lg mr-2" />
                      Click to Avail
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {ajio && (
        <section>
          <p className="my-7 text-center font-semibold text-2xl">
            AJIO Coupons
          </p>
          <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {ajio.map((item) => {
              return (
                <CopyToClipboard key={item.text} text={item.text}>
                  <div
                    className="bg-white border-2 border-dashed border-primary p-3 rounded-md cursor-pointer"
                    onClick={() => {
                      toast.success("Coupon Code Copied!");
                    }}
                  >
                    <p className="font-medium text-sm">{item.title}</p>
                    {item.description !== "NA" &&
                      item.title !== item.description && (
                        <p>{item.description}</p>
                      )}
                    <p className="text font-semibold flex justify-start mt-1 items-center">
                      <RiCoupon2Line className="text-primary text-lg mr-2" />
                      {item.text}
                    </p>
                  </div>
                </CopyToClipboard>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};

export default Coupons;
