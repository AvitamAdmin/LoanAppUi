"use client";
import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  useEffect(() => {
    const token = getCookie("jwtToken");
    if (!token) {
      router.push("/login");
    } 
  }, []);
  return (
    <div
      className="flex w-full p-2 "
      style={{ fontFamily: "SamsungOne, sans-serif" }}
    >
      <div className=" w-full min-h-96 flex flex-col items-center">
      <div className="text-xl">        Welcome to Zero-In
      </div>
      <div className="text-sm">{email}</div>

      </div>
    </div>
  );
};

export default Home;