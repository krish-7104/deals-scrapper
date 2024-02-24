"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { AiOutlineDelete } from "react-icons/ai";
import { dateFormatter } from "@/utils/date-formatter";

interface TrackerData {
  _id: string;
  price: string;
  email: string;
  productUrl: string;
  createdAt: string;
}

const getCompanyName = (link: string) => {
  if (link.includes("myntra")) return "/logos/myntra.png";
  if (link.includes("amazon")) return "/logos/amazon.png";
  if (link.includes("flipkart")) return "/logos/flipkart.png";
  if (link.includes("ajio")) return "/logos/ajio.png";
  if (link.includes("meesho")) return "/logos/meesho.png";
};

const MyTrackers = () => {
  const router = useRouter();
  const [data, setData] = useState<TrackerData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const FetchTracker = async () => {
      try {
        toast.loading("Loading Trackers...");
        const resp = await axios.get(
          `${API_LINK}/user/userTracker/${user?.email}`
        );
        setData(resp.data.userTrackers);
        toast.dismiss();
      } catch (error: any) {
        toast.dismiss();
        console.log("Fetch Tracker Error", error);
        if (error?.response?.data) {
          toast.error(error?.response?.data?.message);
        } else toast.error("Something Went Wrong");
      }
    };
    user?.email && FetchTracker();
  }, [user]);

  const FetchTracker = async () => {
    try {
      toast.loading("Loading Trackers...");
      const resp = await axios.get(
        `${API_LINK}/user/userTracker/${user?.email}`
      );
      setData(resp.data.userTrackers);
      toast.dismiss();
    } catch (error: any) {
      toast.dismiss();
      console.log("Fetch Tracker Error", error);
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message);
      } else toast.error("Something Went Wrong");
    }
  };

  const deleteTrackerHandler = async (id: string) => {
    try {
      toast.loading("Deleting Trackers...");
      const resp = await axios.delete(`${API_LINK}/user/deleteTracker/${id}`);
      toast.dismiss();
      toast.success("Tracker Deleted!");
      FetchTracker();
    } catch (error) {
      toast.dismiss();
      console.log("Fetch Tracker Error", error);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <main className="h-[90vh] w-full flex justify-start items-center flex-col">
      <p className="mb-6 mt-10 text-center font-semibold text-2xl">
        Your Price Trackers
      </p>
      <section className="w-[70%]">
        <div className="w-full relative shadow rounded border p-4 mb-4 flex justify-between items-center">
          <p className="font-semibold w-[10%] flex justify-center items-center">
            ID
          </p>
          <div className="font-semibold w-[15%] flex justify-center items-center">
            Image
          </div>
          <p className="font-semibold w-[15%] text-center">Price</p>
          <div className="font-semibold w-[20%] flex justify-center items-center">
            View Product
          </div>
          <p className="font-semibold w-[30%] text-center">Created Date</p>
        </div>
        {data &&
          data?.map((item, index) => {
            return (
              <div
                key={item._id}
                className="w-full relative shadow rounded border p-4 mb-4 flex justify-between items-center"
              >
                <p className="w-[10%] flex justify-center items-center">
                  {index + 1}.
                </p>
                <div className="w-[15%] flex justify-center items-center">
                  <Image
                    src={getCompanyName(item.productUrl) || "/logos/myntra.png"}
                    className=""
                    alt="logo"
                    height={40}
                    width={40}
                  />
                </div>
                <p className="w-[15%] text-center">₹{item.price}</p>
                <div className="w-[20%] flex justify-center items-center">
                  <Button
                    variant={"secondary"}
                    onClick={() => window.open(item.productUrl)}
                  >
                    View Product{" "}
                    <span>
                      <LinkIcon size={16} className="ml-2" />
                    </span>
                  </Button>
                </div>
                <p className="w-[30%] text-center">
                  {dateFormatter(item.createdAt)}
                </p>
                <div className="w-1/5 flex justify-end absolute -right-4">
                  <Button
                    size={"icon"}
                    onClick={() => deleteTrackerHandler(item._id)}
                  >
                    <span>
                      <AiOutlineDelete size={18} />
                    </span>
                  </Button>
                </div>
              </div>
            );
          })}
        {data && data.length === 0 && (
          <div className="flex justify-center items-center flex-col">
            <p className="mt-4 font-medium text-center">
              No Price Tracker Found!
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/track-product")}
            >
              Add Tracker
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyTrackers;
