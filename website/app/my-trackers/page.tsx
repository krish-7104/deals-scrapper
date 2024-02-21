"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth-context";
import { DataTable } from "./data-table";
import { columns } from "./columns";
const MyTrackers = () => {
  const router = useRouter();
  // const [data, setData] = useState();
  const { user } = useAuth();

  const FetchTracker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Logging In...");
      const resp = await axios.post(`${API_LINK}/user/priceToCompare`, data);
      toast.dismiss();
      toast.success(resp.data.message);
      localStorage.setItem("token", resp.data.token);
      router.replace("/");
    } catch (error) {
      toast.dismiss();
      console.log("Login Error", error);
      toast.error("Something Went Wrong");
    }
  };

  const data = [
    {
      id: "728ed52f",
      productUrl:
        "https://www.flipkart.com/portronics-por-373-key2-mouse-combo-wireless-laptop-keyboard/p/itm5733b3f97bbf1?pid=ACCFZECVEJFT5BDS&lid=LSTACCFZECVEJFT5BDSIWTUK8&marketplace=FLIPKART&store=6bo%2Fai3%2F3oe&srno=b_1_37&otracker=browse&iid=en_SAcQesTRFP6clgQ0iREMl-GyfiM7knN7iP-GKza8y1bzHekymyjc9VE25rHOG3-1u1sMFW45NFPRNUGvssnLjxXEPQD91ylV5gURIWQMC0Q%3D&ssid=t9snnijls00000001708159631410",
      email: "m@example.com",
      price: 100,
    },
    {
      id: "728ed52f",
      productUrl:
        "https://www.flipkart.com/portronics-por-373-key2-mouse-combo-wireless-laptop-keyboard/p/itm5733b3f97bbf1?pid=ACCFZECVEJFT5BDS&lid=LSTACCFZECVEJFT5BDSIWTUK8&marketplace=FLIPKART&store=6bo%2Fai3%2F3oe&srno=b_1_37&otracker=browse&iid=en_SAcQesTRFP6clgQ0iREMl-GyfiM7knN7iP-GKza8y1bzHekymyjc9VE25rHOG3-1u1sMFW45NFPRNUGvssnLjxXEPQD91ylV5gURIWQMC0Q%3D&ssid=t9snnijls00000001708159631410",
      email: "m@example.com",
      price: 100,
    },
  ];

  return (
    <main className="h-[90vh] w-full flex justify-start items-center flex-col">
      <p className="mb-6 mt-10 text-center font-semibold text-2xl">
        Your Price Trackers
      </p>
      <section className="w-[70%]">
        <DataTable columns={columns} data={data} />
      </section>
    </main>
  );
};

export default MyTrackers;
