import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Navbar from "./shared/Navbar";
import AmazonCategory from "./Deals/AmazonCategory";
const Routing = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/amazon/deals" element={<AmazonCategory />} />
      </Routes>
    </Router>
  );
};

export default Routing;
