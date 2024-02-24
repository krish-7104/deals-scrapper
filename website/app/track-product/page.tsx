"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth-context";
const TrackProduct = () => {
  const router = useRouter();
  const [data, setData] = useState<{
    productUrl: string;
    email: string;
    price: number | undefined;
  }>({
    productUrl: "",
    price: undefined,
    email: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setData({ ...data, email: user.email ? user.email : "" });
    }
  }, [user]);

  const addTrackerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Adding Tracker...");
      const resp = await axios.post(`${API_LINK}/user/priceToCompare`, data);
      toast.dismiss();
      toast.success(resp.data.message);
      router.push("/my-trackers");
    } catch (error) {
      toast.dismiss();
      console.log("Tracker Adding Error", error);
      toast.error("Something Went Wrong");
    }
  };
  return (
    <main className="h-[90vh] w-full flex justify-center items-center flex-col">
      <p className="mb-5 text-center font-semibold text-2xl">
        Add Tracker to a Product
      </p>
      <form className="w-[35%] border px-8 py-6 rounded-md">
        <div className="mb-2 w-full">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className="mb-2 w-full">
          <Label htmlFor="link">Product Link</Label>
          <Input
            type="text"
            id="link"
            value={data.productUrl}
            onChange={(e) => setData({ ...data, productUrl: e.target.value })}
          />
          <p className="text-xs mt-2 font-medium opacity-80">
            Link should be of Amazon, Flipkart, Myntra, Ajio or Meesho
          </p>
        </div>
        <div className="my-2 w-full">
          <Label htmlFor="price">Desired Price</Label>
          <Input
            type="number"
            id="price"
            value={data.price}
            onChange={(e) =>
              setData({ ...data, price: parseInt(e.target.value) })
            }
          />
        </div>
        <Button className="block mt-6 mb-3 w-full" onClick={addTrackerHandler}>
          Add Tracker
        </Button>
      </form>
    </main>
  );
};

export default TrackProduct;
