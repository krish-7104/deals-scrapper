"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
const LZString = require("lz-string");
import { useAuth } from "@/app/context/auth-context";
import Image from "next/image";
import { TbDiscount2 } from "react-icons/tb";
import { Copy, Share, Star } from "lucide-react";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
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
import DealCard from "@/app/components/deal-card";

interface DealData{
  details:string;
  discount:number;
  discount_price:number;
  image:string;
  original_price:number;
  ratings:number;
  reviews:number;
  name:string
}

const Page = () => {
  const { user } = useAuth();
  const id = useParams();
  const [data, setData] =useState<DealData>()
  const originalLink = LZString.decompressFromEncodedURIComponent(id.deal);
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendation] = useState()
  const [tracker, setTracker] = useState<{
    email: string | undefined;
    price: undefined | number;
  }>({ email: user?.email ? user?.email : "", price: undefined });
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleShare = async () => {
    try {
      await navigator.share({ title: 'Share', text:`Go Grab The Deal: ${originalLink}` });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(originalLink);
      console.log('Link Copied!', originalLink);
      toast.success("Link Copied!")
    } catch (error) {
      console.error('Error copying text:', error);
    }
  };

  const GetDataHandler = async () => 
  {
    setLoading(true)
    try {
      let resp;
      if (originalLink.includes("amazon")) {
        resp = await axios.post(`${API_LINK}/details/amazon`, {
          url: originalLink,
        });
      } else if (originalLink.includes("flipkart")) {
        resp = await axios.post(`${API_LINK}/details/flipkart`, {
          url: originalLink,
        });
      } else if (originalLink.includes("ajio")) {
        resp = await axios.post(`${API_LINK}/details/ajio`, {
          url: originalLink,
        });
      } else if (originalLink.includes("myntra")) {
        resp = await axios.post(`${API_LINK}/details/myntra`, {
          url: originalLink,
        });
      }
      setData(resp?.data)
      GetRecommendedProducts(resp?.data.name)
      setLoading(false)
    } catch (error) {
      setLoading(false)

    }
  };

  useEffect(() => {
    GetDataHandler();
  }, [originalLink]);

  const getLogoHandler = useMemo(() => {
    if (originalLink?.includes("myntra")) return "/logos/myntra.png";
    if (originalLink?.includes("amazon")) return "/logos/amazon.png";
    if (originalLink?.includes("flipkart")) return "/logos/flipkart.png";
    if (originalLink?.includes("ajio")) return "/logos/ajio.png";
    if (originalLink?.includes("meesho")) return "/logos/meesho.png";
    return "";
  }, [originalLink]);
  

  const GetRecommendedProducts = async (title:string) => {
    let arr = []
    arr.push(title)
    try {
      setLoading(true)
        const reccom = await axios.post("http://127.0.0.1:5000/recommend", {
          title: arr,
        }); 
        if(reccom.data.includes("NaN"))
        {
          setRecommendation(JSON.parse(reccom.data.replaceAll("NaN",null)))
        }else{
          setRecommendation(reccom.data)

        }
        setLoading(false)
    } catch (error) {
      setRecommendation([])
    }
  };

  return (
    <main className="flex justify-center items-center flex-col">
     {data && <section className="my-10 md:w-[80%] w-[90%] mx-auto flex justify-center md:flex-row flex-col items-center">
      <Image alt="" src={data.image} width={500} height={500} className="object-contain mx-4 md:w-1/3 w-[240px] h-[240px]"/>
      <div className="md:w-2/3">
      {getLogoHandler && (
        <Image
          src={getLogoHandler}
          alt=""
          className="w-10 mt-3"
          height={200}
          width={200}
          loading="lazy"
        />
      )}
        <p className="text-xl font-semibold mt-3">{data.name}</p>
        <div className="flex items-center md:items-end mt-3">
          <p className="font-semibold text-2xl mr-2">
            ₹{data.discount_price}
          </p>
          {data.original_price && (
            <p className="font-medium text-lg line-through">
              ₹{data.original_price}
            </p>
          )}
          <span className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-xs md:text-sm font-medium ml-3 text-center flex justify-center items-center">
            <TbDiscount2 className="text-lg mr-1 group-hover:animate-spin-slow" />
            {data.discount
              ? data.discount
              : (
                  ((data.original_price - data.discount_price) / data.original_price) *
                  100
                ).toFixed(0)}
            %
          </span>
        </div>
        <div className="flex mt-1">
        <div className="flex items-center mt-2 mr-4 bg-primary text-white px-3 py-1 rounded-md">
          <Star size={22}/> <span className="text-lg ml-2">
          {data.reviews}
          </span>
        </div>
        </div>
        <p className="mt-3">{data.details}</p>
        <div className="mt-5 w-[90%] md:w-[70%] flex justify-evenly items-center gap-x-4">
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
                  You will get email notification once price drops below your
                  desired price.
                </DialogDescription>
                <DialogDescription className="text-black font-medium">
                  Current Price: ₹{data.discount_price}
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
            size={"sm"}
            className="w-1/2 bg-black hover:bg-black/90"
            onClick={() => window.open(originalLink)}
          >
            Buy Now
          </Button>
        </div>
      </div>
     <div className="ml-10">
      <Button onClick={handleCopy}  size={"icon"} variant={"outline"}>
      <Copy/>
      </Button>
      <Button onClick={handleShare} size={"icon"}  className="mt-3" variant={"outline"}>
      <Share/>
      </Button>
     </div>
      </section>
      }
       {recommendations?.length > 0 && !loading && (
  <section className="w-[90%] mx-auto my-10">
    <p className="text-xl font-semibold text-left">Related Deals</p>
    <section className="grid grid-cols-3 justify-center w-full mx-auto mt-6 gap-4">
      {recommendations?.map((item) => {
        return <DealCard deal={item} type=""/>;
      })}
    </section>
  </section>
)}
      {loading && <div className="flex justify-center items-center h-[60vh] w-full flex-col">
      <AiOutlineLoading className="animate-spin text-primary text-xl"/>
    </div>}
    </main>
  );
};

export default Page;