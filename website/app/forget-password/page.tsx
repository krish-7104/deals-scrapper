"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
const ForgetPassword = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
  });
  const sendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Sending Reset Link...");
      const resp = await axios.post(`${API_LINK}/user/forgotPassword`, data);
      toast.dismiss();
      toast.success(resp.data.message);
      // router.push("login");
    } catch (error) {
      toast.dismiss();
      console.log("Forget Password Error", error);
      toast.error("Something Went Wrong");
    }
  };
  return (
    <main className="h-[90vh] w-full flex justify-center items-center flex-col">
      <p className="mb-5 text-center font-semibold text-2xl">Forget Password</p>
      <form className="w-[35%] border px-8 py-6 rounded-md">
        <div className="mt-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <Button className="block mt-6 mb-3 w-full" onClick={sendResetLink}>
          Send Reset Link
        </Button>
      </form>
    </main>
  );
};

export default ForgetPassword;
