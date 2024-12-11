"use client";
import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LuCopyPlus, LuUser2 } from "react-icons/lu";
import { AiOutlineUserAdd } from "react-icons/ai";
import { TbClockPlus, TbClockEdit } from "react-icons/tb";
import { IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds } from "../../Redux/Slice/slice";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineMoreTime } from "react-icons/md";

const AddNewPageButtons = ({
  children,
  handleSaveClick,
  modifiedBy,
  lastmodifideBy,
  email,
  breadscrums,
  pagename,
  creator,
  creationTime,
  setshow = false
}) => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");

  const dispatch = useDispatch();
  // Function to format the date and time to local time
  const formatDate = (date) => {
    return date.toLocaleString("en-GB", { hour12: true }); // This will give you date and time in local format (24-hour clock)
  };

  useEffect(() => {
    // Set the current time when the component mounts
    const now = new Date();
    setCurrentTime(formatDate(now));

    // Optionally, you can set an interval to keep updating the time
    const interval = setInterval(() => {
      const updatedTime = new Date();
      setCurrentTime(formatDate(updatedTime));
    }, 1000); // Update every second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  const lastmodifideTime = creationTime;
  const lastmodifidetime = new Date(lastmodifideTime).toLocaleString();

  const createdTime = lastmodifideBy;
  const creationtime = new Date(createdTime).toLocaleString();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  return (
    <div
      className="flex flex-col w-full  gap-5"
      style={{ fontFamily: "SamsungOne, sans-serif" }}
    >
      {/* Top Bar with Icons */}
      <div className="flex justify-end items-center bg-white p-2 gap-5">
        {selectedID.length == 1 && (
          <div className="flex flex-row gap-5">
             <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [4, -14],
                      },
                    },
                  ],
                },
              }}
              title="  Creator  "
            >
              <div className="flex flex-row gap-1 items-center">
              <AiOutlineUserAdd size={18} />

                <p className="text-md text-black">{creator}</p>
              </div>
            </Tooltip>
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [4, -14],
                      },
                    },
                  ],
                },
              }}
              title="  Creation Time "

            >
              <div className="flex flex-row gap-1 items-center">
                <MdOutlineMoreTime size={18} />
                <p className="text-md text-black">{creationtime}</p>
              </div>
            </Tooltip>
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [4, -14],
                      },
                    },
                  ],
                },
              }}
               title="  Modified By  "
            >
              <div className="flex flex-row gap-1 items-center">
                <LuUser2 size={18} />
                <p className="text-md text-black">{modifiedBy}</p>
              </div>
            </Tooltip>
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [4, -14],
                      },
                    },
                  ],
                },
              }}
              title="  Modified Time  "
            >
              <div className="flex flex-row gap-1 items-center">
                <IoTimeOutline />
                <p>{lastmodifidetime}</p> {/* Display current date and time */}
              </div>
            </Tooltip>
          </div>
        )}
 {(setshow || selectedID.length >= 2) && (
          <div className="flex flex-row gap-5">
            <Tooltip slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [4, -14],
                      },
                    },
                  ],
                },
              }} title="Modified By" arrow>
              <div className="flex flex-row gap-1 items-center">
                <AiOutlineUserAdd size={18} />
                <p>{email}</p>
              </div>
            </Tooltip>

            <Tooltip slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [4, -14],
                      },
                    },
                  ],
                },
              }} title="Modified Time" arrow>
              <div className="flex flex-row gap-1 items-center">
                <TbClockPlus />
                <p>{currentTime}</p>
              </div>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="bg-gray-200 flex flex-col pb-5">
        <div className="flex justify-between items-center p-4">
          <div>
            <h2 className="text-lg font-semibold">{pagename}</h2>
            <div className="flex items-center gap-1 text-xs">
              <span>{breadscrums}</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {/* <div className='border border-solid border-[#1581ED] rounded-md text-white bg-[#1581ed] text-center cursor-pointer  h-8 px-2 items-center flex-row flex text-center justify-center'>
              <LuCopyPlus />
            </div>
            <div
              className="border p-2 rounded-md text-xs w-[70px] bg-[#1581ed] text-center cursor-pointer  text-white text-center flex flex-row gap-3 items-center justify-center"
              onClick={handleRunClick}
            >
              <FaPlay /> 
              <div>Run</div>
            </div> */}
            <div
              onClick={() => {
                router.back(); // Correctly invoking the router.back() method
                dispatch(clearAllEditRecordIds());
              }}
              className="border p-2 rounded-md text-xs w-[70px]  cursor-pointer bg-[#2b2b2b] text-white text-center"
            >
              Cancel
            </div>

            <div
              className="border p-2 rounded-md text-xs w-[70px]  cursor-pointer text-white bg-[#cc0001] text-center"
              onClick={handleSaveClick}
            >
              <div>Save</div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AddNewPageButtons;
