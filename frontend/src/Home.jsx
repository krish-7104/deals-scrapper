import React, { useState } from "react";
import DealsView from "./Components/Home Page/DealsView";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { API_LINK } from "./utils/baseApi";
import CompareView from "./Components/Home Page/CompareView";

const Home = () => {
  const [search, setSearch] = useState("");
  const [dealsVisible, setDealsVisible] = useState(true);
  const [compareSectionShow, setCompareSectionShow] = useState(false);
  const [data, setData] = useState({
    amazon: {},
    flipkart: {},
  });
  const clearSearchHandler = (e) => {
    e.preventDefault();
    setDealsVisible(true);
    setSearch("");
    setCompareSectionShow(false);
  };

  const searchProductHandler = async (e) => {
    e.preventDefault();
    setDealsVisible(false);
    setCompareSectionShow(false);
    try {
      const amazonResp = await axios(`${API_LINK}/search/amazon?q=${search}`);
      const flipkartResp = await axios(
        `${API_LINK}/search/flipkart?q=${search}`
      );
      const formattedData = [
        { company: "amazon", ...amazonResp.data },
        { company: "flipkart", ...flipkartResp.data },
      ].sort((a, b) => a.discount > b.discount);
      console.log(formattedData);
      setData(formattedData);
      setCompareSectionShow(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <section
        className={`w-full ${
          dealsVisible ? "h-[300px]  bg-slate-100" : "my-10"
        } relative top-0 left-0 flex justify-center items-center flex-col overflow-y`}
      >
        <p className="mb-3 font-medium text-xl">
          Search Product and We Will Find Best Deals
        </p>
        <form
          className="w-[40%] shadow-md border flex bg-white rounded-md"
          onSubmit={!dealsVisible ? clearSearchHandler : searchProductHandler}
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
            onClick={!dealsVisible ? clearSearchHandler : searchProductHandler}
          >
            {!dealsVisible ? (
              <AiOutlineClose className="text-xl" />
            ) : (
              <AiOutlineSearch />
            )}
          </button>
        </form>
      </section>
      {compareSectionShow && (
        <section className="pb-10">
          <section className="grid grid-cols-2 mx-auto w-[70%] gap-10">
            {data.map((deal) => {
              return <CompareView data={deal} />;
            })}
          </section>
        </section>
      )}
      {dealsVisible && <DealsView />}
    </main>
  );
};

export default Home;
