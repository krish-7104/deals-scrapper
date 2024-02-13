import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CommonDeal = ({ title, data, slug }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === data.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, data.length]);

  useEffect(() => {
    if (data.length - currentIndex <= 4) {
      setCurrentIndex(0);
    }
  }, [currentIndex, data.length]);

  return (
    <main className="w-full border-b px-8 my-10">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-2xl">{title}</p>
        <Link to={`/${slug}/deals`}>
          <button className="bg-red-600 text-white px-4 py-2 text-sm rounded transition-animate hover:bg-red-700">
            View All Deals
          </button>
        </Link>
      </div>
      <section className="flex">
        {data &&
          data.slice(currentIndex, currentIndex + 4).map((deal, index) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center border p-4 w-1/4"
                onClick={() => window.open(deal.link)}
              >
                <img
                  src={deal.image}
                  alt={`${slug} deal`}
                  className="w-full h-[220px] hover:scale-105 transition-animate flex-grow object-contain"
                />
                <p className="my-2 text-left block w-full text-medium line-clamp-2">
                  {deal.title}
                </p>
                <div className="w-full flex items-center justify-start">
                  {deal.discount_price && (
                    <p className="bg-red-500 text-white rounded-md block px-2 py-1 text-sm mr-3">
                      {deal.discount}% Off
                    </p>
                  )}
                  <p className="text-lg font-semibold">
                    ₹
                    {deal.discount_price
                      ? deal.discount_price
                      : deal.original_price}
                  </p>
                </div>
                {deal.discount_price && (
                  <p className="text opacity-80 mt-2 block mr-auto">
                    M.R.P ₹
                    <span className="line-through">{deal.original_price}</span>
                  </p>
                )}
              </div>
            );
          })}
      </section>
    </main>
  );
};

export default CommonDeal;
