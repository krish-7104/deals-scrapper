"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AiOutlineCiCircle,
  AiOutlineClose,
  AiOutlineLoading,
  AiOutlineSearch,
} from "react-icons/ai";
import { API_LINK } from "./utils/base-api";
import CompareView from "@/app/components/Home Page/compare-view";
import isClothingProduct from "@/app/utils/cloth-checker";
import CompareLoader from "@/app/components/Home Page/compare-loader";

interface DealData {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [dealsData, setDealsData] = useState<DealData[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showCompareView, setShowCompareView] = useState(false);

  const clearSearch = () => {
    setSearchTerm("");
    setIsComparing(false);
    setShowCompareView(false);
    setDealsData([]);
  };

  useEffect(() => {
    if (searchTerm === "") {
      clearSearch();
    }
  }, [searchTerm]);

  const searchProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setShowCompareView(false);
      setIsComparing(true);
      let formattedData: DealData[] = [];
      if (isClothingProduct(searchTerm)) {
        const ajioResp = await axios(`${API_LINK}/search/ajio?q=${searchTerm}`);
        const myntraResp = await axios(
          `${API_LINK}/search/myntra?q=${searchTerm}`
        );
        formattedData = [
          {
            company: "Ajio",
            best: ajioResp.data.best,
            data: ajioResp.data.data,
          },
          {
            company: "Myntra",
            best: myntraResp.data.best,
            data: myntraResp.data.data,
          },
        ].sort((a, b) => a.best.discount - b.best.discount);
      } else {
        const amazonResp = await axios(
          `${API_LINK}/search/amazon?q=${searchTerm}`
        );
        const flipkartResp = await axios(
          `${API_LINK}/search/flipkart?q=${searchTerm}`
        );
        formattedData = [
          {
            company: "Amazon",
            best: amazonResp.data.best,
            data: amazonResp.data.deals,
          },
          {
            company: "Flipkart",
            best: flipkartResp.data.best,
            data: flipkartResp.data.deals,
          },
        ].sort((a, b) => a.best.discount - b.best.discount);
      }
      setDealsData(formattedData);
      setShowCompareView(true);
      setIsComparing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <section className="mt-20 mb-14 w-full flex justify-center flex-col items-center">
        <p className="mb-5 font-medium text-xl">
          Search for a product and we&apos;ll find the best deals for you
        </p>
        <form
          className="w-[40%] shadow-md border flex bg-white rounded-md"
          onSubmit={searchProduct}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full relative py-3 px-5 outline-none"
            placeholder="Enter Product Name..."
          />
          {!isComparing && !showCompareView && (
            <button
              type="button"
              className="text-2xl mr-3 cursor-pointer"
              onClick={searchProduct}
            >
              <AiOutlineSearch />
            </button>
          )}
          {isComparing && (
            // loading
            <button
              type="button"
              className="text-xl mr-3 cursor-pointer animate-spin"
              disabled
            >
              <AiOutlineLoading />
            </button>
          )}
          {showCompareView && dealsData && !isComparing && (
            <button
              type="button"
              className="text-xl mr-3 cursor-pointer"
              onClick={clearSearch}
            >
              <AiOutlineClose />
            </button>
          )}
        </form>
      </section>
      {showCompareView && dealsData && (
        <section className="grid grid-cols-2 justify-center w-[80%] mx-auto">
          {dealsData.map((item, index) => (
            <CompareView key={index} data={item} />
          ))}
        </section>
      )}
      {!showCompareView && isComparing && (
        <section className="grid grid-cols-2 justify-center w-[80%] mx-auto">
          {Array(2)
            .fill("")
            .map((_, index) => (
              <CompareLoader key={index} />
            ))}
        </section>
      )}
    </main>
  );
};

export default Home;
