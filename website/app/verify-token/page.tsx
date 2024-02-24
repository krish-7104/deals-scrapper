"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
const VerifyToken = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
    token: token ? token : "",
  });
  const updatePasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.password === data.confirmPassword) {
      try {
        toast.loading("Updating Password...");
        const resp = await axios.post(`${API_LINK}/user/updatePassword`, {
          password: data.password,
          token: token ? token : "",
        });
        toast.dismiss();
        toast.success(resp.data.message);
        router.push("login");
      } catch (error: any) {
        toast.dismiss();
        console.log("Update Password Error", error?.response?.data?.message);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something Went Wrong");
        }
      }
    } else {
      toast.error("Both Password Are Different");
    }
  };
  return (
    <main className="h-[90vh] w-full flex justify-center items-center flex-col">
      <p className="mb-5 text-center font-semibold text-2xl">Reset Password</p>
      <form className="w-[35%] border px-8 py-6 rounded-md">
        <div className="mt-2 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <div className="mt-2 w-full">
          <Label htmlFor="confPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confPassword"
            value={data.confirmPassword}
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
          />
        </div>
        <Button
          className="block mt-6 mb-3 w-full"
          onClick={updatePasswordHandler}
        >
          Update Password
        </Button>
      </form>
    </main>
  );
};

export default VerifyToken;
