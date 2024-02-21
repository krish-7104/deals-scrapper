import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

const loading = () => {
  return (
    <main className="flex justify-center items-center h-[90vh] w-full">
      <AiOutlineLoading className="animate-spin text-5xl text-primary" />
    </main>
  );
};

export default loading;
