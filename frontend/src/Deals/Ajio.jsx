import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_LINK } from "../utils/baseApi";

const Ajio = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllDealsHandler = async () => {
      try {
        const ajioResp = await axios.get(`${API_LINK}/ajio/deals`);
        setDeals(ajioResp.data.data);
        setLoading(false);
      } catch (error) {
        console.log("Deals Fetch Error: ", error);
        setLoading(false);
      }
    };
    getAllDealsHandler();
  }, []);

  return (
    <main className="flex flex-col items-center">
      <p className="text-3xl font-semibold my-10">All AJIO Hot Deals</p>
      {!loading && deals && (
        <section className="w-full flex flex-wrap">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center border p-4 w-1/4 cursor-pointer"
              onClick={() => window.open(deal.link)}
            >
              <img
                src={deal.image}
                alt={`ajio deal`}
                className="w-full h-[220px] hover:scale-105 transition-animate flex-grow object-contain"
              />
              <p className="my-2 text-left block w-full text-medium line-clamp-2">
                {deal.title}
              </p>
              <div className="w-full flex items-center justify-start">
                {deal.discount && (
                  <p className="bg-red-500 text-white rounded-md block px-2 py-1 text-sm mr-3">
                    {deal.discount}% Off
                  </p>
                )}
                <p className="text-lg font-semibold">₹{deal.discount_price}</p>
              </div>
              {deal.original_price && (
                <p className="text opacity-80 mt-2 block mr-auto">
                  M.R.P ₹
                  <span className="line-through">{deal.original_price}</span>
                </p>
              )}
            </div>
          ))}
        </section>
      )}
      {loading && (
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

export default Ajio;
