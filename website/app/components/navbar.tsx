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

const Navbar = () => {
  const [active, setActive] = useState("home");
  const router = useRouter();
  const pathname = usePathname();
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname === "/deals") {
      setActive("deals");
    } else if (pathname === "/track-product") {
      setActive("track-product");
    }
  }, [pathname]);

  const logoutHandler = () => {
    localStorage.clear();
    logout();
  };

  const handleButtonClick = (buttonName: string) => {
    setActive(buttonName);
    router.push(`/${buttonName === "home" ? "" : buttonName}`);
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
          console.log(resp.data.data);
        }
      } catch (error) {}
    };

    checkUser();
  }, [login]);

  return (
    <nav className="flex justify-between items-center px-4 py-3 shadow border-b">
      <Link href={"/"}>
        <div className="flex justify-center items-center cursor-pointer">
          <TbDiscount2 className="text-primary animate-spin-slow text-3xl mr-2" />
          <p className="font-semibold text-lg">Deals Scrapper</p>
        </div>
      </Link>
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
        {!user && (
          <Button
            onClick={() =>
              handleButtonClick(pathname === "/login" ? "register" : "login")
            }
          >
            {pathname === "/login" ? "Register" : "Login"}
          </Button>
        )}
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
      </ul>
    </nav>
  );
};

export default Navbar;
