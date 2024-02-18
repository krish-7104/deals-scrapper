"use client";
import axios from "axios";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { API_LINK } from "./utils/base-api";

const Home = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({});

  const searchProductHandler = async (e: any) => {
    e.preventDefault();
    try {
      const amazonResp = await axios(`${API_LINK}/search/amazon?q=${search}`);
      const flipkartResp = await axios(
        `${API_LINK}/search/flipkart?q=${search}`
      );
      const formattedData = [
        { company: "amazon", ...amazonResp.data },
        { company: "flipkart", ...flipkartResp.data },
      ].sort((a: any, b: any) => a.discount - b.discount);
      setData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <section className="h-[400px] w-full flex justify-center flex-col items-center">
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
    </main>
  );
};

export default Home;
