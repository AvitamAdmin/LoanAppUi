"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {  FaUser } from "react-icons/fa";
import { IoClose, IoExitOutline, IoMenu } from "react-icons/io5";
import { deleteCookie, getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import logo from "../../assests/logo.png";
import { useDispatch } from "react-redux";
import { setToolkitRoutePath } from "../src/Redux/Slice/slice";
import toast, { Toaster } from "react-hot-toast";
import "tailwind-scrollbar"
import { Button } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';

const ResSidebar = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [activeChild, setActiveChild] = useState(null);
  const [activeParent, setActiveParent] = useState(null); // State to track the currently open parent node
  const [menuData, setMenuData] = useState([]);
  const [token, setToken] = useState("");
  const pathname = usePathname(); // Get current path

  // Fetch token and then dropdown items

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    // console.log(jwtToken, "from sidenavbar token");
  }, []);

  // Call fetchMenuData only when token is set
  useEffect(() => {
    const storedData = localStorage.getItem("menuData");
    if (storedData) {
      setMenuData(JSON.parse(storedData));
    }
  }, []);

 

  // Toggle the active parent node
  const toggleParent = (parentId) => {
    if (activeParent === parentId) {
      // If the clicked parent is already active, close it
      setActiveParent(null);
    } else {
      // Otherwise, set the clicked parent as active and close others
      setActiveParent(parentId);
    }
  };

  const handleLogout = () => {
    window.location.href = "/";
    deleteCookie('jwtToken');
  };

 
  const dispatch = useDispatch();

  const handleChildClick = (path, childId) => {
    const fullPath = `/cheil${path}`;

    // Set the path in the browser's address bar
    window.history.pushState({}, '', fullPath);
    if (path.includes("toolkit")) { 
      // Extract the part after "toolkit/"
      const extractedPath = path.split("toolkit/")[1];
      dispatch(setToolkitRoutePath(extractedPath));
  
      console.log("extractedPath file redirected",extractedPath);
      toast.success(`Dropdown toolkit/${extractedPath} has been selected`,{className:"text-xs"});
      
      // Redirect to the reports path
      router.push(`/cheil/toolkit/reports`);
    } else {
      router.push(`/cheil/${path}`);
      setActiveChild(childId);
    setShow(false);
    }
  
    console.log(`/cheil/${path}`);
    setActiveChild(childId);
  };

  return (
    <div
      className="flex w-[100%] mt-0 justify-end items-end flex-col  lg:hidden scrollbar-thumb-transparent scrollbar-track-transparent"
      style={{ fontFamily: "SamsungOne, sans-serif" }}
    >
      <Toaster />
      <div className="flex justify-end items-end flex-col  bg-black  lg:hidden relative w-full">
        <div
          className="bg-black p-2 text-white relative w-full flex flex-row justify-between items-center"
          style={{ fontFamily: "SamsungOne, sans-serif" }}
        >
          <div onClick={()=>{
   router.push(`/cheil`);
}} className=" flex items-center justify-center ">
            <Image priority
              src={logo}
              alt="Logo"
              width={90}
              height={45}
            />
          </div>
          <div className="cursor-pointer"
            onClick={() => {
              setShow(!show);
            }}
          >
            {show ? <IoClose size={20} /> : <IoMenu size={20} />}
          </div>
        </div>
        {show && (
          <nav className=" w-[60%] md:w-[35%] bg-black top-12 p-2 right-0 h-screen z-50 overflow-y-scroll scrollbar-none rounded-bl-md absolute bottom-0 animate__animated animate__fadeInRight">
            <div className="flex flex-col gap-2 p-2">
              <div className=" flex flex-row items-center justify-center w-full gap-3">
                <div className="flex items-center justify-center w-8 h-8  hover:cursor-pointer">
                  <FaUser className="text-white " size={20} />
                </div>
                <div className="text-white text-sm">{email}</div>
              </div>
              <div className="flex flex-row gap-4 w-full justify-between items-center">
                <div
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 w-28 bg-red-700 transition-all  text-white rounded-md"
                >
                  <div className="text-xs text-white cursor-pointer">Logout</div>
                  <IoExitOutline className="ml-2 text-md text-white" />
                </div>
                <div className="flex items-center cursor-pointer text-xs justify-center p-2 bg-white w-28 text-white rounded-md">
                  <div className="text-black">Profile</div>
                </div>
              </div>
            </div>
            <div className="p-2 gap-3 flex flex-col">
              {menuData.map((parentNode, parentId) => (
                <div key={parentId} className=" gap-3 flex flex-col ">
                  {/* Render Parent Node */}
                  <div
                    className={` cursor-pointer p-1 flex flex-row w-full justify-between items-center  rounded-sm ${
                      pathname.split("/")[2] === parentNode.path.split("/")[1] ? "bg-[#641212]"
                        : "bg-[#2b2b2b]"
                    } hover:bg-[#641212]`}
                    onClick={() => toggleParent(parentId)} // Toggle child visibility on click
                  >
                <Button startIcon={<DashboardIcon />} className="capitalize text-white w-full flex flex-row justify-start items-center">{parentNode.identifier}</Button>
                <div>
                      {activeParent === parentId ? (
                        <MdOutlineArrowDropDown className="text-white" />
                      ) : (
                        <MdOutlineArrowDropUp className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Render Child Nodes if this parent is the active one */}
                  {activeParent === parentId &&
                    parentNode.childNodes &&
                    parentNode.childNodes.length > 0 && (
                      <div className="rounded-sm animate__animated animate__fadeIn bg-[#2b2b2b]  gap-2 flex flex-col">
                        {parentNode.childNodes.map((childNode, childId) => (
                          <div
                            onClick={() =>
                              handleChildClick(childNode.path, childId)
                            }
                            key={`${parentId}-${childId}`}
                            className={`pl-4 p-2 text-white hover:bg-[#641212] ${
                              pathname == `/cheil${childNode.path}`
                                ? "bg-[#641212]"
                                : "bg-[#2b2b2b]"
                            }`}
                          >
                            {childNode.identifier}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default ResSidebar;
