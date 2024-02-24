"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_LINK } from "../../utils/base-api";
import DealCard from "../components/deal-card";
import DealLoader from "../components/deal-loader";
import { FaChevronUp } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Deal {
  title: string;
  image: string;
  original_price: number;
  discount_price: number;
  discount: number;
  link: string;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Page = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [company, setCompany] = useState("All");

  const debouncedSearch = useDebounce(search, 500);

  const fetchDeals = async (pageNumber: number) => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_LINK}/show/deals?page=${pageNumber}`);
      setDeals(resp.data.data);
      setTotalPages(resp.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error In Loading Deals");
    }
  };

  useEffect(() => {
    const companyFetchDeals = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          `${API_LINK}/show/deals?company=${company}`
        );
        setDeals(resp.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error In Searching Deals");
      }
    };

    if (company === "All") {
      fetchDeals(1);
    } else {
      companyFetchDeals();
    }
  }, [company]);

  useEffect(() => {
    const searchFetchDeals = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`${API_LINK}/show/deals?search=${search}`);
        setDeals(resp.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error In Searching Deals");
      }
    };
    if (debouncedSearch) {
      searchFetchDeals();
    } else {
      fetchDeals(page);
    }
  }, [debouncedSearch, page, search]);

  useEffect(() => {
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

  const handlePaginationClick = (pageNumber: number) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const isAndroid =
      typeof window !== "undefined" &&
      /Android/i.test(window.navigator.userAgent);
    const adjacentPages = 1;
    let pagesToShow = 2 * adjacentPages + 1;
    const paginationItems: JSX.Element[] = [];
    if (isAndroid) {
      pagesToShow = 1 * adjacentPages + 1;
    }
    let startPage = Math.max(1, page - adjacentPages);
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    if (startPage > 1) {
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => handlePaginationClick(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        paginationItems.push(<PaginationEllipsis key="startEllipsis" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => handlePaginationClick(i)}
            isActive={i === page}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationItems.push(<PaginationEllipsis key="endEllipsis" />);
      }
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => handlePaginationClick(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  return (
    <main className="flex justify-center items-center flex-col">
      <section className="flex justify-center flex-col md:justify-between md:flex-row-reverse items-center mt-10 mb-6 w-[90%]">
        <div className="md:w-[30%] flex w-full mb-3 md:mb-0">
          <Input
            type="text"
            placeholder="Search Deal.."
            className="focus-visible:ring-0 focus-visible:outline-none outline-none focus-visible:ring-offset-0 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select onValueChange={(text: string) => setCompany(text)}>
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Company Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="All" defaultChecked>
                All Deals
              </SelectItem>
              <SelectItem value="Amazon">Amazon</SelectItem>
              <SelectItem value="Flipkart">Flipkart</SelectItem>
              <SelectItem value="Myntra">Myntra</SelectItem>
              <SelectItem value="Ajio">Ajio</SelectItem>
              <SelectItem value="Meesho">Meesho</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      {!loading && search && deals.length === 0 && (
        <p className="text-center w-full mt-10 text-xl font-medium">
          No Result Found!!
        </p>
      )}
      <section className="flex justify-center items-center flex-col md:grid md:grid-cols-3 gap-6 my-6 w-[90%] md:w-[95%] mx-auto">
        {!loading &&
          deals?.map((deal) => {
            return (
              <DealCard
                key={deal?.discount + deal?.discount_price}
                deal={deal}
              />
            );
          })}
        {loading &&
          Array(21)
            .fill("")
            .map((_, index) => {
              return <DealLoader key={index + "loading"} />;
            })}
      </section>
      <button
        className={`fixed md:block bottom-24 md:bottom-10 hidden right-10 bg-primary p-3 text-white text-base rounded-full transition-all ease-linear duration-200
          ${showScrollUp ? "scale-100" : "scale-0"}
        `}
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      >
        <FaChevronUp />
      </button>
      {company === "All" && !search && (
        <Pagination className="mt-4 mb-10">
          <PaginationContent>
            <PaginationPrevious
              className="cursor-pointer select-none"
              onClick={() => handlePaginationClick(Math.max(1, page - 1))}
            />
            {renderPaginationItems()}
            <PaginationNext
              className="cursor-pointer select-none"
              onClick={() =>
                handlePaginationClick(Math.min(totalPages, page + 1))
              }
            />
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
};

export default Page;
