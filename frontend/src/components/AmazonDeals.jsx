import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DealSection = ({ title, data }) => {
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
        <p className="font-bold text-2xl">Amazon Hot Deals</p>
        <Link to={"/amazon/deals"}>
          <button className="bg-red-600 text-white px-4 py-2 text-sm rounded transition-animate hover:bg-red-700">
            View All Deals
          </button>
        </Link>
      </div>
      <section className="flex justify-center items-center">
        {data &&
          data.slice(currentIndex, currentIndex + 4).map((item, index) => {
            return (
              <Link
                key={index}
                to={"/"}
                className="flex flex-col justify-center items-center border p-4 w-1/4"
              >
                <img
                  src={item.image}
                  alt="amazon category deal"
                  className="w-full h-[180px] object-contain p-4 hover:scale-105 transition-animate flex-grow"
                />
                <p className="mt-4 text-xs bg-red-500 text-white px-2 py-1 rounded-md block mr-auto">
                  {item.discount}
                </p>
                <p className="mt-2 text-left block w-full text-medium h-[50px] line-clamp-2">
                  {item.title}
                </p>
              </Link>
            );
          })}
      </section>
    </main>
  );
};

export default DealSection;
