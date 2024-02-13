import React, { useEffect, useState } from "react";
import AmazonDeals from "./components/AmazonDeals";
import { API_LINK } from "./utils/baseApi";
import axios from "axios";
const Home = () => {
  const [data, setData] = useState({
    amazon: [],
    flikart: [],
    myntra: [],
    meesho: [],
    ajio: [],
  });

  useEffect(() => {
    const getAllDealsHandler = async () => {
      try {
        const amazonResp = await axios.get(`${API_LINK}/amazon/deals-category`);
        setData({ ...data, amazon: amazonResp.data.data });
      } catch (error) {
        console.log("Deals Fetch Error: ", error);
      }
    };
    getAllDealsHandler();
  }, []);

  return <main>{data?.amazon && <AmazonDeals data={data.amazon} />}</main>;
};

export default Home;
