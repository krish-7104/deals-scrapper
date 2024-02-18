import axios from "axios";
import DealCard from "../DealCard";
import { FaChevronUp } from "react-icons/fa6";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import LoadingCard from "../LoadingCard";
import { API_LINK } from "../../utils/baseApi";
import { useEffect, useState } from "react";

const DealsView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComp, setSelectedCompany] = useState("all");
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [search, setSearch] = useState();
  const [searchVisible, setSearchVisible] = useState(true);
  const companies = ["all", "amazon", "flipkart", "myntra", "ajio", "meesho"];

  const getAllProductHandler = async () => {
    try {
      setLoading(true);
      const resp = await axios(`${API_LINK}/show/deals`);
      const data = resp.data.data;
      setData(data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getAllProductHandler();

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getCategoryDataHandler = async (company) => {
    if (company === "all" && selectedComp !== company) {
      getAllProductHandler();
    } else if (selectedComp !== company) {
      try {
        setLoading(true);
        const resp = await axios(`${API_LINK}/show/deals?company=${company}`);
        const data = resp.data.data;
        setData(data);
        setLoading(false);
      } catch (error) {}
    }
  };

  const getSearchDataHandler = async (e) => {
    e.preventDefault();
    if (!search) {
      setSearchVisible(true);
      getAllProductHandler();
    } else {
      setSearchVisible(false);
      try {
        setLoading(true);
        const resp = await axios(`${API_LINK}/show/deals?search=${search}`);
        const data = resp.data.data;
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search data:", error);
        setLoading(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchVisible(true);
    getAllProductHandler();
    setSearch("");
  };

  return (
    <main className="bg-slate-100 min-h-[100vh] w-full flex flex-col items-center">
      <section className="flex justify-between items-center w-[95%] mt-8 mb-2">
        <ul className="flex w-[60%]">
          {companies.map((comp) => (
            <li
              key={comp}
              className={`${
                selectedComp === comp && "border-primary border-2"
              } py-[4px] px-6 rounded-full w-[120px] text-center cursor-pointer tranisiton-animate bg-white mr-5 select-none shadow`}
              onClick={() => {
                setSelectedCompany(comp);
                getCategoryDataHandler(comp);
              }}
            >
              {comp.charAt(0).toUpperCase() + comp.slice(1)}
            </li>
          ))}
        </ul>
        <form
          className="w-[40%] flex justify-end items-center"
          onSubmit={getSearchDataHandler}
        >
          <input
            type="text"
            className="py-2 px-4 rounded-lg outline-none shadow w-[60%]"
            placeholder="Search Deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searchVisible && (
            <button className="text-2xl ml-3" onClick={getSearchDataHandler}>
              <AiOutlineSearch />
            </button>
          )}
          {!searchVisible && (
            <button className="text-xl ml-3" onClick={clearSearch}>
              <AiOutlineClose />
            </button>
          )}
        </form>
      </section>
      {!loading && (
        <section className="bg-slate-100 min-h-[100vh] grid grid-cols-3 gap-6 my-6 w-[95%] mx-auto">
          {!loading &&
            data &&
            data.map((deal) => {
              return <DealCard key={deal.id} deal={deal} />;
            })}
        </section>
      )}
      {loading && (
        <section className="bg-slate-100 min-h-[100vh] grid grid-cols-3 gap-6 my-6 w-[95%] mx-auto">
          {Array(12)
            .fill()
            .map((_, index) => {
              return <LoadingCard />;
            })}
        </section>
      )}
      <button
        className={`fixed bottom-10 right-10 bg-primary p-3 text-white text-base rounded-full transition-all ease-linear duration-200
          ${showScrollUp ? "scale-100" : "scale-0"}
        `}
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      >
        <FaChevronUp />
      </button>
    </main>
  );
};

export default DealsView;
