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
import DealCard from "./components/deal-card";
import { AddSearchHandler } from "@/utils/search-store";
import { useAuth } from "./context/auth-context";
import toast from "react-hot-toast";
import { RiFireLine } from "react-icons/ri";
const { getJson } = require("serpapi");

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
  const [recommendations, setRecommendation] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [betterChoice, setBetterChoice] = useState("")
  const [autoSuggestion, setAutoSuggestion] =useState()
  const { user } = useAuth();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const clearSearch = () => {
    setSearchTerm("");
    setIsComparing(false);
    setShowCompareView(false);
    setDealsData([]);
    setBetterChoice("")
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      GetAutoSuggestion(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

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
      GetHighlightHandler(formattedData[0].best, formattedData[1].best)
    } catch (error) {
      console.error(error);
      setIsComparing(false);
      setShowCompareView(false);
      toast.error("Error In Finding Products!");
    }
  };

  const GetUserSearches = async () => {
    try {
      setLoading(true)
      if(user?.userId)
      {
        const resp = await axios.get(
          `${API_LINK}/userSearch/getUserSearch/${user?.userId}`
        );
          const reccom = await axios.post("http://127.0.0.1:5000/recommend", {
            title: resp.data.searches,
          }); 
          if(reccom.data.includes("NaN"))
          {
            setRecommendation(JSON.parse(reccom.data.replaceAll("NaN",null)))
          }else{
            setRecommendation(reccom.data)
  
          }
          setLoading(false)
      }else{
        const reccom = await axios.post("http://127.0.0.1:5000/recommend", {
          title: [],
        }); 
        if(reccom.data.includes("NaN"))
        {
          setRecommendation(JSON.parse(reccom.data.replaceAll("NaN",null)))
        }else{
          setRecommendation(reccom.data)
  
        }
      }
    
    } catch (error) {
      const reccom = await axios.post("http://127.0.0.1:5000/recommend", {
        title: [],
      }); 
      if(reccom.data.includes("NaN"))
      {
        setRecommendation(JSON.parse(reccom.data.replaceAll("NaN",null)))
      }else{
        setRecommendation(reccom.data)

      }
    }
  };
 const GetHighlightHandler=(product1:Deal, product2:Deal)=>{
  const product1DiscountedPrice = product1.original_price - (product1.original_price * product1.discount / 100);
  const product2DiscountedPrice = product2.original_price - (product2.original_price * product2.discount / 100);

  if (product1DiscountedPrice < product2DiscountedPrice) {
    setBetterChoice(product1.title)
  } else if (product2DiscountedPrice < product1DiscountedPrice) {
    setBetterChoice(product2.title)
  } else {
    setBetterChoice('Both products have the same price.')
}
 }

 const selectedSearchHandler = (text:string)=>{
  setSearchTerm(text)
 }

 const GetAutoSuggestion = async(search:string)=>{
 try {
  const resp = await axios.get(`http://localhost:4000/autocomplete?q=${search}`)
  setAutoSuggestion(resp.data.suggestions)
 } catch (error) {
  
 }

 }

 const handleKeyDown = async (e: any) => {
  if (e.key === " ") {
    await GetAutoSuggestion(searchTerm);
  }
};
  return (
    <main>
      <section className="mt-20 mb-14 w-full flex justify-center flex-col items-center">
        <p className="mb-5 font-medium text-lg md:text-xl text-center w-[90%]">
          Search for a product and we&apos;ll find the best deals for you
        </p>
        <form
          className="md:w-[40%] w-[90%] shadow-md border flex bg-white rounded-md relative"
          onSubmit={searchProduct}
        >
             {<ul className="absolute w-full mt-14">
              {autoSuggestion && autoSuggestion?.splice(0,5).map((item)=>{
                return <li className="bg-white w-full shadow p-2 cursor-pointer hover:bg-slate-50" onClick={()=>selectedSearchHandler(item.value)}>{item.value}</li>
              })}
             
              
          </ul>}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value)}}
            className="w-full relative py-3 px-5 outline-none"
            placeholder="Enter Product Name..."
            onKeyDown={handleKeyDown}
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
      {/* {betterChoice && <p className="text-center mb-6 font-medium bg-primary text-white py-4">{betterChoice}</p>} */}
      {showCompareView && dealsData && (
        <section className="w-[90%] md:w-[80%] mx-auto mb-10">
          <p className="font-semibold text-xl mb-2 mr-auto md:mt-0 mt-6 flex items-center">
            <RiFireLine className="text-primary mr-2 text-2xl" /> Best Match
            Result
          </p>
          <div className="grid md:grid-cols-2 gap-x-3 md:gap-x-4">
            {dealsData.map((item: DealData, index) => (
              <div
                className="flex justify-center items-center flex-col"
                key={item.company + index}
              >
                <CompareView key={index} data={item} best={betterChoice} />
              </div>
            ))}
          </div>
          <p className="font-semibold text-xl my-4 mr-auto md:mt-0 mt-6 flex items-center">
            <RiFireLine className="text-primary mr-2 text-2xl" /> Other Results
          </p>
          <div className="grid md:grid-cols-2 gap-x-4">
            {dealsData.map((item: DealData, index) => (
              <div className="flex w-full flex-col" key={index}>
                {item.data.slice(0, 8).map((item: Deal) => {
                  return (
                    <DealCard
                      type=""
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
     {/* {recommendations.length > 0 && !loading && (
  <section className="w-[90%] mx-auto my-10">
    <p className="text-xl font-semibold text-left">Suggested Deals</p>
    <section className="grid grid-cols-3 justify-center w-full mx-auto mt-6 gap-4">
      {recommendations?.map((item) => {
        return <DealCard deal={item} type="deal"/>;
      })}
    </section>
  </section>
)} */}

    </main>
  );
};

export default Home;
