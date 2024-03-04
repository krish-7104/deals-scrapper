"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { TbDiscount2 } from "react-icons/tb";
const LZString = require('lz-string');
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/auth-context";
import toast from "react-hot-toast";

const Page = () => {
  const {user} = useAuth()
    const id = useParams()
    const originalLink = LZString.decompressFromEncodedURIComponent(id.deal);
    const [loading, setLoading] =useState(true)
    const [data, setData] =useState()
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tracker, setTracker] = useState<{
      email: string | undefined;
      price: undefined | number;
    }>({ email: user?.email ? user?.email : "", price: undefined });
    const GetDataHandler = async()=>{
      try {
        const resp = await axios.post(`${API_LINK}/show/deals/particular`)
      } catch (error) {
        
      }
    }
    const AddPriceTracker = async () => {
      if (tracker.price) {
        try {
          toast.loading("Adding Tracker...");
          const resp = await axios.post(`${API_LINK}/user/priceToCompare`, {
            productUrl: originalLink,
            ...tracker,
          });
          toast.dismiss();
          toast.success(resp.data.message);
          setDialogOpen(false);
        } catch (error) {
          toast.dismiss();
          console.log("Tracker Adding Error", error);
          toast.error("Something Went Wrong");
        }
      } else {
        toast.error("Please Enter Desired Price");
      }
    };
    const getLogoHandler = useMemo(() => {
      if (originalLink.includes("myntra")) return "/logos/myntra.png";
      if (originalLink.includes("amazon")) return "/logos/amazon.png";
      if (originalLink.includes("flipkart")) return "/logos/flipkart.png";
      if (originalLink.includes("ajio")) return "/logos/ajio.png";
      if (originalLink.includes("meesho")) return "/logos/meesho.png";
      return "";
    }, [originalLink]);

  return (
    <main className="flex justify-center items-center flex-col">
      <section className="my-10 flex justify-center items-start w-[70%]">
        <Image alt="" src={"https://m.media-amazon.com/images/I/71DqqFHYL7L._SX679_.jpg"} height={500} width={350} className="mx-4"/>
        <div className="flex flex-col justify-start items-start mt-4">
        {getLogoHandler && (
        <Image
          src={getLogoHandler}
          alt=""
          className="w-10 mb-4"
          height={50}
          width={50}
          loading="lazy"
        />
      )}
        <p className="text-lg font-medium">boAt Flash Edition Smart Watch with Activity Tracker,Multiple Sports Modes,Full Touch 3.30 cm (1.3") Screen,Gesture, Sleep Monitor,Camera & Music Control,IP68 Dust,Sweat & Splash Resistance(Moon Red)</p>
        <div className="flex items-center md:items-end mt-3">
          <p className="font-semibold text-2xl mr-2">
            {/* ₹{discount_price} */}
            ₹230
          </p>
          {/* {original_price && (
            <p className="font-medium text-xs md:text-base line-through">
              ₹{original_price}
            </p>
          )} */}
           <p className="font-medium text-lg line-through">
              ₹433
            </p>
        </div>
        {/* {original_price && discount_price && (
          <span className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-xs md:text-sm font-medium ml-auto text-center flex justify-center items-center">
            <TbDiscount2 className="text-lg mr-1 group-hover:animate-spin-slow" />
            {discount
              ? discount
              : (
                  ((original_price - discount_price) / original_price) *
                  100
                ).toFixed(0)}
            %
          </span>
        )} */}
        <div className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl font-medium mr-auto text-center flex mt-3 justify-center items-center">
            <TbDiscount2 className="text-xl mr-1 group-hover:animate-spin-slow" />
            54
            %
          </div>
          <div className="flex w-[90%] md:w-[60%] gap-x-4 mt-4 md:mt-6">
              <Dialog
                open={dialogOpen}
                onOpenChange={() => setDialogOpen(!dialogOpen)}
              >
                <DialogTrigger
                  className="w-1/2"
                  onClick={() => setDialogOpen(true)}
                >
                  <Button size={"sm"} className="w-full">
                    Add Price Tracker
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Adding Price Tracker
                    </DialogTitle>
                    <DialogDescription>
                      You will get email notification once price drops below
                      your desired price.
                    </DialogDescription>
                    <DialogDescription className="text-black font-medium">
                      {/* Current Price: ₹{discount_price} */}
                      Current Price: ₹4332
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Input
                      className="mb-3"
                      placeholder="Enter Email"
                      value={tracker.email}
                      type="email"
                      onChange={(e) =>
                        setTracker({ ...tracker, email: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Enter Desired Price"
                      value={tracker.price}
                      type="number"
                      autoFocus={tracker?.email ? true : false}
                      onChange={(e) =>
                        setTracker({
                          ...tracker,
                          price: parseInt(e.target.value),
                        })
                      }
                    />
                    <Button
                      className="mt-5 ml-auto block"
                      onClick={AddPriceTracker}
                    >
                      Add Tracker
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                className="w-1/2 bg-black hover:bg-black/90"
                onClick={() => window.open(originalLink)}
              >
                Buy Now
              </Button>
            </div>

        </div>
       
      </section>
    </main>
  );
};

export default Page;
