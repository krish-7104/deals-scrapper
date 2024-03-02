"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth-context";

const Register = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [router, user]);

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Registering...");
      const resp = await axios.post(`${API_LINK}/user/register`, data);
      toast.dismiss();
      toast.success(resp.data.message);
      router.push("login");
    } catch (error: any) {
      toast.dismiss();
      console.log("Register Error", error);
      toast.error(
        error?.response?.data?.message
          ? error.response.data.message
          : "Something Went Wrong"
      );
    }
  };

  return (
    <main className="h-[90vh] w-full flex justify-center items-center flex-col">
      <p className="mb-5 text-center font-semibold text-xl md:text-2xl">
        Welcome To Deal Scrapper
      </p>
      <form className="w-[90%] md:w-[35%] border px-8 py-6 rounded-md">
        <div className="w-full">
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>
        <div className="mt-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className="mt-2 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <Button className="block mt-6 mb-3 w-full" onClick={registerHandler}>
          Register
        </Button>
        <Link href={"/login"} className="block text-right font-medium text-sm">
          Already Have An Account? Login
        </Link>
      </form>
    </main>
  );
};

export default Register;
