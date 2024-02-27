import { useAuth } from "@/app/context/auth-context";
import { API_LINK, RECOMMEND_API } from "@/utils/base-api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DealCard from "../deal-card";

const Recommendations = () => {
  const [userSearch, setUserSearch] = useState();
  const [recommendation, setRecommendations] = useState();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const GetUserSearched = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(
          `${API_LINK}/userSearch/getUserSearch/${user?.userId}`
        );
        console.log(resp.data.searches);
        setUserSearch(resp.data.searches);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    user && GetUserSearched();
  }, [user]);

  const getRecommendedProducts = async () => {
    setLoading(true);
    try {
      const resp = await axios.post(`${RECOMMEND_API}`);
      console.log(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <main>
      {user && user.userId && recommendation && !loading && (
        <section>
          {recommendation.map((item) => {
            return <DealCard />;
          })}
        </section>
      )}
    </main>
  );
};

export default Recommendations;
