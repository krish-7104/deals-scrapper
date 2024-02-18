"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { TbDiscount2 } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname === "/deals") {
      setActive("deals");
    } else if (pathname === "/track-product") {
      setActive("track-product");
    } else if (pathname === "/register") {
      setActive("register");
    }
  }, [pathname]);

  const handleButtonClick = (buttonName: string) => {
    setActive(buttonName);
    router.push(`/${buttonName === "home" ? "" : buttonName}`);
  };

  return (
    <nav className="flex justify-between items-center px-4 py-3 shadow border-b">
      <div className="flex justify-center items-center">
        <TbDiscount2 className="text-primary animate-spin-slow text-3xl mr-2" />
        <p className="font-semibold text-lg">Deals Scrapper</p>
      </div>
      <ul className="flex justify-center items-center gap-x-4">
        <Button
          onClick={() => handleButtonClick("home")}
          variant={active === "home" ? "outline" : "ghost"}
        >
          Home
        </Button>

        <Button
          onClick={() => handleButtonClick("deals")}
          variant={active === "deals" ? "outline" : "ghost"}
        >
          Hot Deals
        </Button>
        <Button
          onClick={() => handleButtonClick("track-product")}
          variant={active === "track-product" ? "outline" : "ghost"}
        >
          Track Product
        </Button>
        <Button
          onClick={() => handleButtonClick("register")}
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
