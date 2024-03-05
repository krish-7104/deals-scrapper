import Image from "next/image";
import React, { useMemo, useState } from "react";
import { TbDiscount2 } from "react-icons/tb";
import { AddSearchHandler } from "@/utils/search-store";
import { useAuth } from "../context/auth-context";
const LZString = require('lz-string');

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineClose } from "react-icons/ai";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DealProps {
  title: string;
  image: string;
  link: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

const DealCard = ({ deal, type }: { deal: DealProps, type:string }) => {
  const { user } = useAuth();
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tracker, setTracker] = useState<{
    email: string | undefined;
    price: undefined | number;
  }>({ email: user?.email ? user?.email : "", price: undefined });

  const AddPriceTracker = async () => {
    if (tracker.price) {
      try {
        toast.loading("Adding Tracker...");
        const resp = await axios.post(`${API_LINK}/user/priceToCompare`, {
          productUrl: link,
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
    if (deal.link.includes("myntra")) return "/logos/myntra.png";
    if (deal.link.includes("amazon")) return "/logos/amazon.png";
    if (deal.link.includes("flipkart")) return "/logos/flipkart.png";
    if (deal.link.includes("ajio")) return "/logos/ajio.png";
    if (deal.link.includes("meesho")) return "/logos/meesho.png";
    return "";
  }, [deal.link]);

  const { title, image, original_price, discount_price, link, discount } = deal;

  const ClickHandler = () => {
    user && AddSearchHandler(user?.userId ? user?.userId : "", title);
    // window.open(link);
    if(type === "deal")
    {
      const compress = LZString.compressToEncodedURIComponent(link)
    router.push(`/deals/${compress}`)
    }
  };

  return (
    // <Drawer>
    //   <DrawerTrigger>
   
    //   </DrawerTrigger>
    //   <DrawerContent>
    //     <DrawerClose className="flex justify-end items-center mr-6">
    //       <Button size={"icon"}>
    //         <AiOutlineClose />
    //       </Button>
    //     </DrawerClose>
    //     <DrawerDescription className="w-[90%] md:w-[80%] mx-auto flex justify-evenly items-center md:flex-row flex-col">
    //       <Image
    //         src={image}
    //         width={300}
    //         height={300}
    //         alt=""
    //         className="mx-10 w-[160px] h-[240px] md:h-[300px] md:w-[300px] object-contain"
    //       />
    //       <div className="flex flex-col justify-start items-start">
    //         {getLogoHandler && (
    //           <Image
    //             src={getLogoHandler}
    //             alt=""
    //             className="w-8 mb-4"
    //             height={40}
    //             width={40}
    //             loading="lazy"
    //           />
    //         )}
    //         <p className="font-semibold text-black text-lg md:text-xl">
    //           {title}
    //         </p>
    //         <div className="border-primary text-primary border-2 px-2 py-[2px] rounded-2xl text-xs md:text-sm font-medium text-center flex justify-center items-center mt-4">
    //           <TbDiscount2 className="text-lg mr-1 group-hover:animate-spin-slow" />
    //           {discount
    //             ? discount
    //             : (
    //                 ((original_price - discount_price) / original_price) *
    //                 100
    //               ).toFixed(0)}
    //           %
    //         </div>
    //         <div className="flex items-end mt-4 md:mt-6">
    //           <p className="font-medium text-black text-2xl md:text-3xl text-primary">
    //             ₹{discount_price}
    //           </p>
    //           <p className="font-medium text-black text-xl md:text-2xl ml-3 line-through">
    //             ₹{original_price}
    //           </p>
    //         </div>
    //         <div className="flex w-[90%] md:w-[60%] gap-x-4 mt-4 md:mt-6">
    //           <Dialog
    //             open={dialogOpen}
    //             onOpenChange={() => setDialogOpen(!dialogOpen)}
    //           >
    //             <DialogTrigger
    //               className="w-1/2"
    //               onClick={() => setDialogOpen(true)}
    //             >
    //               <Button size={"sm"} className="w-full">
    //                 Add Price Tracker
    //               </Button>
    //             </DialogTrigger>
    //             <DialogContent>
    //               <DialogHeader>
    //                 <DialogTitle className="text-xl">
    //                   Adding Price Tracker
    //                 </DialogTitle>
    //                 <DialogDescription>
    //                   You will get email notification once price drops below
    //                   your desired price.
    //                 </DialogDescription>
    //                 <DialogDescription className="text-black font-medium">
    //                   Current Price: ₹{discount_price}
    //                 </DialogDescription>
    //               </DialogHeader>
    //               <div>
    //                 <Input
    //                   className="mb-3"
    //                   placeholder="Enter Email"
    //                   value={tracker.email}
    //                   type="email"
    //                   onChange={(e) =>
    //                     setTracker({ ...tracker, email: e.target.value })
    //                   }
    //                 />
    //                 <Input
    //                   placeholder="Enter Desired Price"
    //                   value={tracker.price}
    //                   type="number"
    //                   autoFocus={tracker?.email ? true : false}
    //                   onChange={(e) =>
    //                     setTracker({
    //                       ...tracker,
    //                       price: parseInt(e.target.value),
    //                     })
    //                   }
    //                 />
    //                 <Button
    //                   className="mt-5 ml-auto block"
    //                   onClick={AddPriceTracker}
    //                 >
    //                   Add Tracker
    //                 </Button>
    //               </div>
    //             </DialogContent>
    //           </Dialog>
    //           <Button
    //             className="w-1/2 bg-black hover:bg-black/90"
    //             onClick={() => window.open(link)}
    //           >
    //             Buy Now
    //           </Button>
    //         </div>
    //       </div>
    //     </DrawerDescription>
    //     <DrawerFooter>{/* <Button>Submit</Button> */}</DrawerFooter>
    //   </DrawerContent>
    // </Drawer>
    <div
    className="bg-white border p-4 rounded-md flex cursor-pointer md:h-[160px] group w-full overflow-hidden"
    onClick={ClickHandler}
  >
    <Image
      src={image}
      className="w-1/3 h-28 md:h-32 object-contain mr-4 py-2 group-hover:scale-105 transition-animate"
      height={200}
      width={200}
      alt=""
      loading="lazy"
    />
    <div className="flex flex-col justify-start items-start w-2/3">
      <div className="flex justify-between items-end w-full mb-2">
        <div className="flex items-center md:items-end">
          <p className="font-semibold md:text-xl mr-2">
            ₹{discount_price}
          </p>
          {original_price && (
            <p className="font-medium text-xs md:text-base line-through">
              ₹{original_price}
            </p>
          )}
        </div>
        {original_price && discount_price && (
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
        )}
      </div>
      <p className="line-clamp-3 w-full md:text-sm text-left">{title}</p>
      {getLogoHandler && (
        <Image
          src={getLogoHandler}
          alt=""
          className="w-6 mt-3"
          height={30}
          width={30}
          loading="lazy"
        />
      )}
    </div>
  </div>
  );
};

export default DealCard;
