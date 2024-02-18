"use client";
import axios from "axios";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { API_LINK } from "./utils/base-api";
import CompareView from "./components/Home Page/CompareView";
import isClothingProduct from "./utils/cloth-checker";

interface DealDataProp {
  company: string;
  best: Deal;
  data: Deal[];
}

interface Deal {
  title: string;
  image: string;
  link: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

const Home = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<DealDataProp[]>([]);
  const [compareView, setShowCompareView] = useState(false);

  const searchProductHandler = async (e: any) => {
    e.preventDefault();
    try {
      setShowCompareView(false);
      let formattedData;
      if (isClothingProduct(search)) {
        const ajioResp = await axios(`${API_LINK}/search/ajio?q=${search}`);
        const myntraResp = await axios(`${API_LINK}/search/myntra?q=${search}`);
        formattedData = [
          { company: "ajio", ...ajioResp.data },
          { company: "myntra", ...myntraResp.data },
        ].sort((a: any, b: any) => a.discount - b.discount);
      } else {
        const amazonResp = await axios(`${API_LINK}/search/amazon?q=${search}`);
        const flipkartResp = await axios(
          `${API_LINK}/search/flipkart?q=${search}`
        );
        formattedData = [
          { company: "amazon", ...amazonResp.data },
          { company: "flipkart", ...flipkartResp.data },
        ].sort((a: any, b: any) => a.discount - b.discount);
      }
      setData(formattedData);
      setShowCompareView(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <section className="mt-20 mb-14 w-full flex justify-center flex-col items-center">
        <p className="mb-3 font-medium text-xl">
          Search Product and We Will Find Best Deals
        </p>
        <form
          className="w-[40%] shadow-md border flex bg-white rounded-md"
          onSubmit={searchProductHandler}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full relative py-3 px-5 outline-none"
            placeholder="Enter Product Name..."
          />
          <button
            type="button"
            className="text-2xl mr-3 cursor-pointer"
            onClick={searchProductHandler}
          >
            <AiOutlineSearch />
          </button>
        </form>
      </section>
      {compareView && data && (
        <section className="grid grid-cols-2 justify-center w-[80%] mx-auto">
          {data.map((item) => {
            return <CompareView key={item.company} data={item} />;
          })}
        </section>
      )}
    </main>
  );
};

export default Home;
