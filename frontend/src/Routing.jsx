import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AmazonCategory from "./Deals/AmazonCategory";
import Navbar from "./Components/Navbar";
import Meesho from "./Deals/Mesho";
import Myntra from "./Deals/Myntra";
import Ajio from "./Deals/Ajio";

const Routing = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/amazon/deals" element={<AmazonCategory />} />
        <Route path="/meesho/deals" element={<Meesho />} />
        <Route path="/myntra/deals" element={<Myntra />} />
        <Route path="/ajio/deals" element={<Ajio />} />
      </Routes>
    </Router>
  );
};

export default Routing;
