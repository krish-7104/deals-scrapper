"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { TbDiscount2 } from "react-icons/tb";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const navigate = useRouter();
  const handleButtonClick = (buttonName: string) => {
    setActive(buttonName);
  };

  return (
    <nav className="flex justify-between items-center px-4 py-3 shadow border-b">
      <div className="flex justify-center items-center">
        <TbDiscount2 className="text-primary animate-spin-slow text-3xl mr-2" />
        <p className="font-semibold text-lg">Deals Scrapper</p>
      </div>
      <ul className="flex justify-center items-center gap-x-4">
        <Button
          onClick={() => {
            handleButtonClick("home");
            navigate.push("/");
          }}
          variant={active === "home" ? "outline" : "ghost"}
        >
          Home
        </Button>

        <Button
          onClick={() => {
            handleButtonClick("hot-deals");
            navigate.push("/deals");
          }}
          variant={active === "hot-deals" ? "outline" : "ghost"}
        >
          Hot Deals
        </Button>
        <Button
          onClick={() => {
            handleButtonClick("track-product");
            navigate.push("/track-product");
          }}
          variant={active === "track-product" ? "outline" : "ghost"}
        >
          Track Product
        </Button>
        <Button
          onClick={() => {
            handleButtonClick("register");
            navigate.push("/register");
          }}
          className={active === "register" ? "active ml-2" : "ml-2"}
        >
          Register
        </Button>
        <li className="mx-4 hidden">My Account</li>
      </ul>
    </nav>
  );
};

export default Navbar;
