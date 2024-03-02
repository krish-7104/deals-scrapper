"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { TbDiscount2 } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { API_LINK } from "@/utils/base-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../context/auth-context";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { RiCoupon2Line, RiFireLine } from "react-icons/ri";
import { CgTrack } from "react-icons/cg";
import { GoHome } from "react-icons/go";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const router = useRouter();
  const pathname = usePathname();
  const { user, login, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname === "/deals") {
      setActive("deals");
    } else if (pathname === "/track-product") {
      setActive("track-product");
    } else if (pathname === "/coupons") {
      setActive("coupons");
    }
  }, [pathname]);

  const logoutHandler = () => {
    localStorage.clear();
    logout();
  };

  const handleButtonClick = (buttonName: string) => {
    setActive(buttonName);
    router.push(`/${buttonName === "home" ? "" : buttonName}`);
    setShowMenu(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const config = {
            headers: {
              Authorization: "Bearer " + token,
            },
          };
          const resp = await axios.post(
            `${API_LINK}/user/get-user`,
            {},
            config
          );
          if (resp.data.success) {
            login(
              resp.data.data._id,
              resp.data.data.email,
              resp.data.data.name
            );
          }
        }
      } catch (error) {}
    };

    checkUser();
  }, []);

  return (
    <nav className="flex justify-between items-center px-4 py-3 shadow border-b">
      <Link href={"/"}>
        <div className="flex justify-center items-center cursor-pointer">
          <TbDiscount2 className="text-primary animate-spin-slow text-3xl mr-2" />
          <p className="font-semibold text-lg">Deals Scrapper</p>
        </div>
      </Link>
      <div className="flex">
        <ul
          className={`${
            showMenu ? "flex" : "hidden"
          } md:flex justify-center md:justify-center items-center gap-x-4 bg-white h-[100vh] w-full absolute top-0 flex-col md:flex-row md:static md:h-auto md:w-auto left-0 mr-0 md:mr-3 z-20`}
        >
          <Button
            onClick={() => handleButtonClick("home")}
            variant={active === "home" ? "outline" : "ghost"}
            className="text-lg md:text-sm mb-6 md:mb-0"
          >
            <GoHome
              className={`mr-2 text-xl ${active === "home" && "text-primary"}`}
            />
            Home
          </Button>

          <Button
            onClick={() => handleButtonClick("deals")}
            variant={active === "deals" ? "outline" : "ghost"}
            className="text-lg md:text-sm mb-6 md:mb-0"
          >
            <RiFireLine
              className={`mr-2 text-xl ${active === "deals" && "text-primary"}`}
            />
            Hot Deals
          </Button>
          <Button
            onClick={() => handleButtonClick("track-product")}
            variant={active === "track-product" ? "outline" : "ghost"}
            className="text-lg md:text-sm mb-6 md:mb-0"
          >
            <CgTrack
              className={`mr-2 text-xl ${
                active === "track-product" && "text-primary"
              }`}
            />
            Track Product
          </Button>
          <Button
            onClick={() => handleButtonClick("coupons")}
            variant={active === "coupons" ? "outline" : "ghost"}
            className="text-lg md:text-sm mb-6 md:mb-0"
          >
            <RiCoupon2Line
              className={`mr-2 text-lg ${
                active === "coupons" && "text-primary"
              }`}
            />
            Coupons
          </Button>
          {!user && (
            <Button
              className="text-lg md:text-sm"
              onClick={() =>
                handleButtonClick(pathname === "/login" ? "register" : "login")
              }
            >
              {pathname === "/login" ? "Register" : "Login"}
            </Button>
          )}
        </ul>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer select-none">
                <AvatarFallback>
                  {user?.name?.split(" ")[0].slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={"/my-trackers"}>
                  <DropdownMenuItem>My Trackers</DropdownMenuItem>
                </Link>
                <a href="mailto:krishjotaniya71@gmail.com">
                  <DropdownMenuItem>Feedback</DropdownMenuItem>
                </a>
                <DropdownMenuItem onClick={logoutHandler}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!showMenu && (
          <Button
            size={"icon"}
            className="ml-3 md:hidden flex"
            onClick={() => setShowMenu(!showMenu)}
          >
            <AiOutlineMenu size={22} />
          </Button>
        )}
        {showMenu && (
          <Button
            size={"icon"}
            className="ml-3 relative z-40 md:hidden flex"
            onClick={() => setShowMenu(!showMenu)}
          >
            <AiOutlineClose size={22} />
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
