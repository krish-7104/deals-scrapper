import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { TbDiscount2 } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/app/context/auth-context";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Deal {
  title: string;
  image: string;
  link: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

interface DealDataProp {
  company: string;
  best: Deal;
  data: Deal[];
}

const CompareView = ({ data, best }: { data: DealDataProp, best:string }) => {
  const { user } = useAuth();
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
          productUrl: data.best.link,
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

  return (
    <section className="md:mb-6 mx-auto w-full relative">
      <div className={`w-full shadow-sm flex justify-center items-center flex-col rounded border p-6 ${best==data.best.title && "translate-x-2 shadow-primary shadow-lg"}`}>
        <div className="flex justify-between items-center w-full mb-5">
          <span className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-sm font-medium text-center flex justify-center items-center ">
            <TbDiscount2 className="animate-spin-slow text-lg mr-1" />
            {(
              ((data.best.original_price - data.best.discount_price) /
                data.best.original_price) *
              100
            ).toFixed(0)}
            %
          </span>
          <span className="">
            <Image
              src={`/logos/${data.company}.png`}
              width={30}
              height={30}
              alt={data.company}
            />
          </span>
        </div>
        <Image
          src={data.best.image}
          className={`${
            data.company === "myntra" || data.company === "ajio"
              ? "h-[250px]"
              : "h-[180px]"
          } w-auto object-contain `}
          height={200}
          width={200}
          alt="product"
        />
        <div className="w-full mt-6 h-[70px]">
          <span className="font-bold text-xs">PRODUCT TITLE</span>
          <p className="line-clamp-2">{data.best.title}</p>
        </div>
        <div className="flex items-end w-full mt-2">
          <p className="font-semibold text-xl mr-2">
            ₹{data.best.discount_price}
          </p>
          <p className="font-medium line-through">
            ₹{data.best.original_price}
          </p>
        </div>
        <div className="mt-5 w-full flex justify-evenly items-center gap-x-4">
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
                  Current Price: ₹{data.best.discount_price}
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
            onClick={() => window.open(data.best.link)}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompareView;
