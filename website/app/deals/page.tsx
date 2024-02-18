"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_LINK } from "../utils/base-api";
import DealCard from "../components/deal-card";
import DealLoader from "../components/deal-loader";
import { FaChevronUp } from "react-icons/fa";

interface Deal {
  title: string;
  image: string;
  original_price: number;
  discount_price: number;
  discount: number;
  link: string;
}

const Page = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollUp, setShowScrollUp] = useState(false);

  const GetDealsHandler = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_LINK}/show/deals`);
      setDeals(resp.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error In Loading Deals");
    }
  };

  useEffect(() => {
    GetDealsHandler();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <section className="min-h-[100vh] grid grid-cols-3 gap-6 my-6 w-[95%] mx-auto">
        {!loading &&
          deals?.map((deal) => {
            return (
              <DealCard
                key={deal?.discount + deal?.discount_price}
                deal={deal}
              />
            );
          })}
        {loading &&
          Array(21)
            .fill("")
            .map((_, index) => {
              return <DealLoader key={index + "loading"} />;
            })}
      </section>
      <button
        className={`fixed bottom-10 right-10 bg-primary p-3 text-white text-base rounded-full transition-all ease-linear duration-200
          ${showScrollUp ? "scale-100" : "scale-0"}
        `}
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      >
        <FaChevronUp />
      </button>
    </main>
  );
};

export default Page;
