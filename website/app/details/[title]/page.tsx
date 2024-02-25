"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import lzString from "lz-string";

interface Deal {
  title: string;
  image: string;
  original_price: number;
  discount_price: number;
  discount: number;
  link: string;
}

const Details = () => {
  const params = useParams();
  const title = lzString.decompressFromEncodedURIComponent(
    params.title as string
  );
  const [data, setData] = useState<Deal>();
  useEffect(() => {
    const searchProductHandler = async () => {
      try {
        const resp = await axios.post(`${API_LINK}/show/deals/particular`, {
          title,
        });
        setData(resp.data.data[0]);
      } catch (error) {
        console.log("Error In Getting Deal Data: ", error);
        toast.error("Error In Loading Deal Data");
      }
    };
    searchProductHandler();
  }, [title]);

  return <div>{data && <p>{data.discount_price}</p>}</div>;
};

export default Details;
