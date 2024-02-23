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
  const [data, setData] = useState();
  const { user } = useAuth();

  const FetchTracker = async () => {
    try {
      toast.loading("Loading Trackers...");
      const resp = await axios.get(
        `${API_LINK}/user/userTracker/${user?.email}`
      );
      setData(resp.data);
      toast.dismiss();
      toast.success(resp.data.message);
    } catch (error) {
      toast.dismiss();
      console.log("Fetch Tracker Error", error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    FetchTracker();
  }, [user]);

  return (
    <main className="h-[90vh] w-full flex justify-start items-center flex-col">
      <p className="mb-6 mt-10 text-center font-semibold text-2xl">
        Your Price Trackers
      </p>
      <section className="w-[70%]">
        {data && <DataTable columns={columns} data={data} />}
      </section>
    </main>
  );
};

export default MyTrackers;
