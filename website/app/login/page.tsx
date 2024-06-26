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
const Login = () => {
  const { user, login } = useAuth();
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

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Logging In...");
      const resp = await axios.post(`${API_LINK}/user/login`, data);
      toast.dismiss();
      toast.success(resp.data.message);
      localStorage.setItem("token", resp.data.token);
      checkUser(resp.data.token);
      router.replace("/");
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message
          ? error.response.data.message
          : "Something Went Wrong"
      );
    }
  };

  const checkUser = async (token: string) => {
    try {
      if (token) {
        const config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        const resp = await axios.post(`${API_LINK}/user/get-user`, {}, config);
        if (resp.data.success) {
          login(resp.data.data._id, resp.data.data.email, resp.data.data.name);
          router.replace("/");
        }
        console.log(resp.data.data);
      }
    } catch (error) {}
  };

  return (
    <main className="h-[90vh] w-full flex justify-center items-center flex-col">
      <p className="mb-5 text-center font-semibold text-2xl">
        Login To Your Account
      </p>
      <form className="w-[90%] md:w-[35%] border px-8 py-6 rounded-md">
        <div className="mt-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className="my-2 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <Link
          href={"/forget-password"}
          className="font-medium text-sm block text-right"
        >
          Forget Password?
        </Link>
        <Button className="block mt-6 mb-3 w-full" onClick={loginHandler}>
          Login
        </Button>
        <Link
          href={"/register"}
          className="text-right block font-medium text-sm"
        >
          Don&apos;t Have An Account? Create One
        </Link>
      </form>
    </main>
  );
};

export default Login;
