import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_LINK } from "../utils/baseApi";

const AmazonCategory = () => {
  const [category, setCategory] = useState([]);
  const [deals, setDeals] = useState([]);
  const [showDeals, setShowDeals] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(false);

  useEffect(() => {
    const getAllDealsHandler = async () => {
      try {
        const amazonResp = await axios.get(`${API_LINK}/amazon/deals-category`);
        setCategory(amazonResp.data.data);
        setLoadingCategory(false);
      } catch (error) {
        console.log("Deals Fetch Error: ", error);
        setLoadingCategory(false);
      }
    };
    getAllDealsHandler();
  }, []);

  const getParticularDealData = async (url) => {
    try {
      setShowDeals(true);
      setLoadingDeals(true);
      const amazonResp = await axios.post(`${API_LINK}/amazon/deals`, {
        url: url,
      });
      setDeals(amazonResp.data.data);
      setLoadingDeals(false);
    } catch (error) {
      console.log("Deals Fetch Error: ", error);
      setLoadingDeals(false);
    }
  };

  return (
    <main className="flex flex-col items-center">
      <p className="text-3xl font-semibold my-10">All Amazon Hot Deals</p>
      {!showDeals && !loadingCategory && (
        <section className="w-full flex flex-wrap">
          {category.map((cat, index) => (
            <div
              key={index}
              onClick={() => getParticularDealData(cat.deal_link)}
              className="flex flex-col justify-center items-center border p-4 w-1/4 cursor-pointer"
            >
              <img
                src={cat.image}
                alt="amazon category deal"
                className="w-full h-[180px] object-contain p-4 hover:scale-105 transition-animate flex-grow"
              />
              <p className="mt-4 text-xs bg-red-500 text-white px-2 py-1 rounded-md block mr-auto">
                {cat.discount}
              </p>
              <p className="mt-2 text-left block w-full text-medium h-[50px] line-clamp-2">
                {cat.title}
              </p>
            </div>
          ))}
        </section>
      )}
      {showDeals && !loadingDeals && (
        <section className="w-full flex flex-wrap cursor-pointer">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center border p-4 w-1/4"
              onClick={() => window.open(deal.link)}
            >
              <img
                src={deal.image}
                alt="amazon category deal"
                className="w-full h-[220px] hover:scale-105 transition-animate flex-grow object-contain"
              />
              <p className="mb-2 text-left block w-full text-medium h-[50px] line-clamp-2">
                {deal.title}
              </p>
              <div className="w-full flex items-center justify-start">
                <p className="bg-red-500 text-white rounded-md block px-2 py-1 text-sm">
                  {deal.discount}% Off
                </p>
                <p className="ml-3 text-lg font-semibold">
                  ₹{deal.discount_price}
                </p>
              </div>
              <p className="text opacity-80 mt-2 block mr-auto">
                M.R.P ₹
                <span className="line-through">{deal.original_price}</span>
              </p>
            </div>
          ))}
        </section>
      )}
      {(loadingCategory || loadingDeals) && (
        <section className="w-full flex flex-wrap">
          {Array(8)
            .fill()
            .map((_, index) => (
              <div
                key={"loadingamazon" + index}
                className="flex flex-col justify-center items-center border p-4 w-1/4"
              >
                <div className="w-full h-[220px] px-6 bg-gray-200 animate-pulse object-contain hover:scale-105 transition-animate flex-grow"></div>
                <p className="mb-2 text-left block w-full text-medium h-[60px] line-clamp-2 mt-4 bg-gray-200 animate-pulse"></p>
              </div>
            ))}
        </section>
      )}
    </main>
  );
};

export default AmazonCategory;
