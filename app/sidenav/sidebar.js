"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import axios from "axios";
import { api } from "@/envfile/api";
import { deleteCookie, getCookie } from "cookies-next";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToolkitRoutePath } from "../src/Redux/Slice/slice";
import logo from "../../assests/logo.png";

import "tailwind-scrollbar";
import { Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { CgMenu } from "react-icons/cg";


import "animate.css";
import { IoExitOutline } from "react-icons/io5";

const Sidebar = ({ setSidebarVisible }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [token, setToken] = useState("");
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
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

  const handleLogout = () => {
    window.location.href = "/";
    deleteCookie("jwtToken");
    localStorage.clear();
  };

  const toggleParent = (parentId) => {
    if (activeParent === parentId) {
      // If the clicked parent is already active, close it
      setActiveParent(null);
    } else {
      // Otherwise, set the clicked parent as active and close others
      setActiveParent(parentId);
    }
    // setActiveParent(activeParent === parentId ? null : parentId);
  };
  const dispatch = useDispatch();

  const handleChildClick = (path, childId) => {
    const fullPath = `/loanApplication${path}`;

    // Set the path in the browser's address bar
    window.history.pushState({}, "", fullPath);
    if (path.includes("toolkit")) {
      // Extract the part after "toolkit/"
      const extractedPath = path.split("toolkit/")[1];
      dispatch(setToolkitRoutePath(extractedPath));

      // console.log("extractedPath file redirected", extractedPath);
      toast.success(`Dropdown toolkit/${extractedPath} has been selected`, {
        className: "text-xs",
      });

      router.push(`/loanApplication/toolkit/reports`);
    } else {
      router.push(`/loanApplication/${path}`);
    }

    console.log(`/loanApplication/${path}`);
    setActiveChild(childId);
  };

  return (
    <div
      className={`hidden lg:flex  ${
        show === true ? "w-[16%]" : "w-[5%]"
      } scrollbar-thumb-transparent scrollbar-track-transparent`}
      style={{ fontFamily: "SamsungOne, sans-serif" }}
    >
      <Toaster />
      <div
        className={`bg-black text-white w-full h-screen flex flex-col flex-shrink-0 `}
      >
        <div className="flex flex-row w-full justify-between  items-center">
          <div
            className="cursor-pointer px-2 h-24 gap-3 items-center flex flex-row  "
            onClick={() => {
              setShow((prevShow) => !prevShow);
              setSidebarVisible(!show);
              setActiveParent(null);
            }}
          >
            {show === true ? (
              <div>
                <CgMenu className="text-lg" />
              </div>
            ) : (
              <div></div>
            )}
            {show === false ? (
              <div className=" flex items-center justify-center cursor-pointer">
                <Image src={logo2} alt="Logo" width={35} height={15} priority />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {show && (
            <div
              onClick={() => {
                router.push(`/loanApplication`);
              }}
              className="p-5 flex items-center justify-center cursor-pointer"
            >
              <Image src={logo} alt="Logo" width={130} height={50} priority />
            </div>
          )}
        </div>
        {show && (
          <div className="flex flex-col pb-2 items-center w-full">
            <div className="pb-2 text-xs"> {email}</div>
            <div className="flex flex-row gap-4 w-full justify-around items-center">
              <div
                onClick={handleLogout}
                className="flex items-center justify-center cursor-pointer hover:cursor-pointer p-2 w-24 hover:scale-110 transition-all ease-in-out hover:transition-all text-white   text-sm bg-[#222] rounded-md hover-parent "
              >
                <div>Logout</div>
                <IoExitOutline className="ml-2 text-lg   transition-all" />
              </div>

              <div
                onClick={() => {
                  router.push("/cheil/user-profile-page");
                }}
                className="flex items-center cursor-pointer hover:cursor-pointer justify-center p-2 w-24  bg-[#222] rounded-md hover:scale-110 transition-all ease-in-out hover:transition-all"
              >
                <div className="text-sm text-white">Profile</div>
              </div>
            </div>
          </div>
        )}

        <div className="p-2 gap-3 flex flex-col w-full rounded-t-md overflow-y-scroll scrollbar-none">
          {menuData.map((parentNode, parentId) => (
            <div key={parentId} className="gap-3 flex flex-col">
              <div
                className={`cursor-pointer flex flex-row min-w-[100px] text-md justify-between items-center rounded-sm ${
                  pathname?.split("/")[2] === parentNode?.path?.split("/")[1]
                    ? `${show === true ? "bg-[#641212]" : ""}`
                    : `${show === true ? "bg-[#2b2b2b]" : ""}`
                } ${show === true ? "hover:bg-[#641212] p-1" : "p-1 pb-2.5"}`}
                onClick={() => {
                  setShow(true);
                  toggleParent(parentId);
                }}
              >
                <Button
                  className={`${show && "animate__animated animate__fadeIn "} ${
                    show === true
                      ? ""
                      : "hover:scale-150 hover:translate-x-6 transition-all hover:transition-all ease-in-out"
                  } ease-in-out transition-all  cursor-pointer`}
                  startIcon={<DashboardIcon />}
                  style={{
                    color: "#fff",
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    fontStyle: "normal",
                    textTransform: "capitalize", 
                  }}
                >
                  {show === true ? (
                    parentNode.identifier === null ? "null" :
                    parentNode.identifier.charAt(0).toUpperCase() +
                    parentNode.identifier.slice(1).toLowerCase()
                  ) : (
                    <div></div>
                  )}
                </Button>
                {show && (
                  <div>
                    {activeParent === parentId ? (
                      <MdOutlineArrowDropDown />
                    ) : (
                      <MdOutlineArrowDropUp />
                    )}
                  </div>
                )}
              </div>
              {activeParent === parentId &&
                parentNode.childNodes &&
                parentNode.childNodes.length > 0 && (
                  <div className="rounded-sm  bg-[rgb(43,43,43)] min-w-[100px] gap-2 flex flex-col">
                    {parentNode.childNodes.map((childNode, childId) => {
                      // console.log("Current Pathname:", pathname);
                      // console.log(
                      //   "Child Path to Match:",
                      //   `/loanApplication${childNode.path}`
                      // );
                      return (
                        <div
                          key={`${parentId}-${childId}`}
                          className={`pl-4 p-2 max-w-54 hover:bg-[#641212] cursor-pointer ${
                            pathname == `/loanApplication${childNode.path}`
                              ? "bg-[#641212]"
                              : "bg-[#2b2b2b]"
                          }`}
                          onClick={() =>
                            handleChildClick(childNode.path, childId)
                          }
                          style={{
                            overflow: "hidden", // Hide overflow content
                            textOverflow: "ellipsis", // Add ellipsis for overflowed text
                            whiteSpace: "nowrap", // Prevent the text from wrapping to a new line
                          }}
                        >
                          <div className=" min-w-[230px] overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                            {childNode.identifier}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
