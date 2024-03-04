"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AiOutlineClose,
  AiOutlineLoading,
  AiOutlineSearch,
} from "react-icons/ai";
import { API_LINK } from "../utils/base-api";
import CompareView from "@/app/components/Home Page/compare-view";
import isClothingProduct from "@/utils/cloth-checker";
import CompareLoader from "@/app/components/Home Page/compare-loader";
import DealCard from "./components/deal-card";
import { AddSearchHandler } from "@/utils/search-store";
import { useAuth } from "./context/auth-context";
import toast from "react-hot-toast";
import Recommendations from "./components/Home Page/recommend";
import { RiFireLine } from "react-icons/ri";

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
  const { user } = useAuth();
  const clearSearch = () => {
    setSearchTerm("");
    setIsComparing(false);
    setShowCompareView(false);
    setDealsData([]);
  };

  useEffect(() => {
    GetUserSearches();
  }, [user]);

  useEffect(() => {
    if (searchTerm === "") {
      clearSearch();
    }
  }, [searchTerm]);

  const searchProduct = async (e: React.FormEvent) => {
    user && AddSearchHandler(user?.userId ? user.userId : "", searchTerm);
    e.preventDefault();
    try {
      setShowCompareView(false);
      setIsComparing(true);
      let formattedData: DealData[] = [];

      if (isClothingProduct(searchTerm)) {
        const ajioPromise = axios(`${API_LINK}/search/ajio?q=${searchTerm}`);
        const myntraPromise = axios(
          `${API_LINK}/search/myntra?q=${searchTerm}`
        );

        const [ajioResp, myntraResp] = await Promise.allSettled([
          ajioPromise,
          myntraPromise,
        ]);

        ajioResp.status === "fulfilled" &&
          formattedData.push({
            company: "Ajio",
            best: ajioResp.value.data.best,
            data: ajioResp.value.data.data,
          });

        myntraResp.status === "fulfilled" &&
          formattedData.push({
            company: "Myntra",
            best: myntraResp.value.data.best,
            data: myntraResp.value.data.data,
          });
      } else {
        const amazonPromise = axios(
          `${API_LINK}/search/amazon?q=${searchTerm}`
        );
        const flipkartPromise = axios(
          `${API_LINK}/search/flipkart?q=${searchTerm}`
        );

        const [amazonResp, flipkartResp] = await Promise.allSettled([
          amazonPromise,
          flipkartPromise,
        ]);

        amazonResp.status === "fulfilled" &&
          formattedData.push({
            company: "Amazon",
            best: amazonResp.value.data.best,
            data: amazonResp.value.data.data,
          });

        flipkartResp.status === "fulfilled" &&
          formattedData.push({
            company: "Flipkart",
            best: flipkartResp.value.data.best,
            data: flipkartResp.value.data.data,
          });
      }

      setDealsData(
        formattedData.sort((a, b) => a.best.discount - b.best.discount)
      );
      setShowCompareView(true);
      setIsComparing(false);
    } catch (error) {
      console.error(error);
      setIsComparing(false);
      setShowCompareView(false);
      toast.error("Error In Finding Products!");
    }
  };

  const GetUserSearches = async () => {
    try {
      const resp = await axios.get(
        `${API_LINK}/userSearch/getUserSearch/${user?.userId}`
      );

      GetRecommendationhandler(resp.data.searches);
    } catch (error) {
      GetRecommendationhandler([]);
    }
  };

  const GetRecommendationhandler = async (userSearch: string[]) => {
    try {
      const resp = await axios.post("http://127.0.0.1:5000/recommend", {
        title: userSearch,
      });
      console.log(resp);
    } catch (error) {}
  };

  return (
    <main>
      <section className="mt-20 mb-14 w-full flex justify-center flex-col items-center">
        <p className="mb-5 font-medium text-lg md:text-xl text-center w-[90%]">
          Search for a product and we&apos;ll find the best deals for you
        </p>
        <form
          className="md:w-[40%] w-[90%] shadow-md border flex bg-white rounded-md"
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
        <section className="w-[90%] md:w-[80%] mx-auto mb-10">
          <p className="font-semibold text-xl mb-2 mr-auto md:mt-0 mt-6 flex items-center">
            <RiFireLine className="text-primary mr-2 text-2xl" /> Best Match
            Result
          </p>
          <div className="grid grid-cols-2 gap-x-4">
            {dealsData.map((item: DealData, index) => (
              <div
                className="flex justify-center items-center flex-col"
                key={item.company + index}
              >
                <CompareView key={index} data={item} />
              </div>
            ))}
          </div>
          <p className="font-semibold text-xl my-4 mr-auto md:mt-0 mt-6 flex items-center">
            <RiFireLine className="text-primary mr-2 text-2xl" /> Other Results
          </p>
          <div className="grid grid-cols-2 gap-x-4">
            {dealsData.map((item: DealData, index) => (
              <div className="flex w-full flex-col" key={index}>
                {item.data.slice(0, 8).map((item: Deal) => {
                  return (
                    <DealCard
                      deal={item}
                      key={item.discount_price + item.discount}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* {!showCompareView && isComparing && (
        <section className="grid grid-cols-2 justify-center w-[80%] mx-auto">
          {Array(2)
            .fill("")
            .map((_, index) => (
              <CompareLoader key={index} />
            ))}
        </section>
      )} */}
    </main>
  );
};

export default Home;
