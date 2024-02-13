import React, { useState } from "react";
import { TbDiscount2 } from "react-icons/tb";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState("home");
  return (
    <section className="w-full shadow border-b">
      <nav className="flex justify-between items-center px-10 py-3 max-w-7xl mx-auto">
        <Link to={"/"} onClick={() => setActive("home")}>
          <div className="flex justify-center items-center">
            <TbDiscount2 className="mr-2 text-3xl animate-spin-slow text-red-600" />
            <p className="font-semibold text-xl">Deal Scrapper</p>
          </div>
        </Link>
        <ul className="flex justify-center items-center">
          <Link
            to={"/"}
            className={`cursor-pointer px-4 py-1 rounded-md mx-3 ${
              active === "home" && "text-red-600 bg-red-100 transition-animate"
            }`}
            onClick={() => setActive("home")}
          >
            Home
          </Link>
          <Link
            to={"/search"}
            className={`cursor-pointer px-4 py-1 rounded-md mx-3 ${
              active === "search" &&
              "text-red-600 bg-red-100 transition-animate"
            }`}
            onClick={() => setActive("search")}
          >
            Search
          </Link>
          <Link
            to={"/track"}
            className={`cursor-pointer px-4 py-1 rounded-md mx-3 ${
              active === "track" && "text-red-600 bg-red-100 transition-animate"
            }`}
            onClick={() => setActive("track")}
          >
            Track
          </Link>
        </ul>
      </nav>
    </section>
  );
};

export default Navbar;
