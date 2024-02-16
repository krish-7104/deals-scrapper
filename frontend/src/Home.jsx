import React, { useEffect, useState } from "react";
import axios from "axios";
import DealCard from "./Components/DealCard";
const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState("all");
  const getAllProductHandler = async () => {
    try {
      setLoading(true);
      const resp = await axios("http://localhost:4000/api/v1/show/deals");
      const data = resp.data.data;
      setData(data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getAllProductHandler();
  }, []);

  const getCategoryDataHandler = async (company) => {
    try {
      setLoading(true);
      const resp = await axios(
        `http://localhost:4000/api/v1/show/deals?company=${company}`
      );
      const data = resp.data.data;
      setData(data);
      setLoading(false);
    } catch (error) {}
  };

  return (
    <main className="bg-slate-200 min-h-[100vh] w-full flex flex-col justify-center items-center">
      <ul className="flex mt-8 mb-4 w-[50%] mx-auto justify-evenly items-center">
        <li
          className={`${
            company === "all" && "border-red-600 border-2"
          } py-[4px] px-6 rounded-lg w-[120px] text-center cursor-pointer tranisiton-animate bg-white`}
          onClick={() => {
            setCompany("all");
            getAllProductHandler();
          }}
        >
          All
        </li>
        <li
          className={`${
            company === "amazon" && "border-red-600 border-2"
          } py-[4px] px-6 rounded-lg w-[120px] text-center cursor-pointer tranisiton-animate bg-white`}
          onClick={() => {
            setCompany("amazon");
            getCategoryDataHandler("amazon");
          }}
        >
          Amazon
        </li>
        <li
          className={`${
            company === "flipkart" && "border-red-600 border-2"
          } py-[4px] px-6 rounded-lg w-[120px] text-center cursor-pointer tranisiton-animate bg-white`}
          onClick={() => {
            setCompany("flipkart");
            getCategoryDataHandler("flipkart");
          }}
        >
          Flipkart
        </li>
        <li
          className={`${
            company === "myntra" && "border-red-600 border-2"
          } py-[4px] px-6 rounded-lg w-[120px] text-center cursor-pointer tranisiton-animate bg-white`}
          onClick={() => {
            setCompany("myntra");
            getCategoryDataHandler("myntra");
          }}
        >
          Myntra
        </li>
      </ul>
      <section className="bg-slate-200 min-h-[100vh] w-full flex justify-evenly items-center flex-wrap pt-6">
        {!loading &&
          data &&
          data.map((deal) => {
            return <DealCard deal={deal} />;
          })}
      </section>
    </main>
  );
};

export default Home;
