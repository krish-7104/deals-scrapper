import React, { useEffect, useState } from "react";
import AmazonDeals from "./Components/HomePage/AmazonDeals";
import { API_LINK } from "./utils/baseApi";
import axios from "axios";
import CommonDeal from "./Components/HomePage/CommonDeal";

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
        const [amazonResp, ajioResp, myntraResp, meeshoResp] =
          await Promise.all([
            axios.get(`${API_LINK}/amazon/deals-category`),
            axios.get(`${API_LINK}/ajio/deals`),
            axios.get(`${API_LINK}/myntra/deals`),
            axios.get(`${API_LINK}/meesho/deals`),
          ]);

        setData({
          amazon: amazonResp.data.data,
          ajio: ajioResp.data.data,
          myntra: myntraResp.data.data,
          meesho: meeshoResp.data.data,
        });
      } catch (error) {
        console.log("Deals Fetch Error: ", error);
      }
    };
    getAllDealsHandler();
  }, []);

  return (
    <main className="max-w-7xl mx-auto">
      {data?.amazon && <AmazonDeals data={data.amazon} />}
      {data?.ajio && (
        <CommonDeal title={"Ajio Hot Deals"} data={data.ajio} slug="ajio" />
      )}
      {data?.myntra && (
        <CommonDeal
          title={"Myntra Hot Deals"}
          data={data.myntra}
          slug="myntra"
        />
      )}
      {data?.meesho && (
        <CommonDeal
          title={"Meesho Hot Deals"}
          data={data.meesho}
          slug="meesho"
        />
      )}
    </main>
  );
};

export default Home;
