import React from "react";
import { Modal } from "@mui/material";

import { MdOutlineEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const DetailsSideModal = ({
  open,
  handleClose,
  data,
  cuurentpagemodelname,
  editnewroutepath, // Pass edit route path as a prop
}) => {
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch();

  const formatValue = (key, value) => {
    if (typeof value === "boolean") {
      return value ? "True" : "False";
    }

    if (typeof value === "object" && value !== null) {
      if (value.identifier) {
        return value.identifier;
      }
      return JSON.stringify(value, null, 2);
    }

    if (key === "creationTime" || key === "lastModified") {
      return formatDate(value);
    }

    return value || "-";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="max-w-lg m-3 flex flex-col  justify-center items-end max-h-[96%] ml-[60%]">
        <div className="bg-black rounded-t-md p-2 w-full text-white text-md flex flex-row justify-between">
          <div className="text-white font-bold text-md">
            <p>{cuurentpagemodelname}</p>
          </div>
          <div className="flex flex-row gap-5">
            {/* Edit Icon Button */}
            <div
              onClick={() => router.push(`/cheil${editnewroutepath}`)} // Navigate to edit page
              className="text-white cursor-pointer"
            >
              <MdOutlineEdit className="text-white rounded-md text-xl" />
            </div>

            {/* Close Button */}
            <div onClick={handleClose} className="text-white cursor-pointer">
              <IoClose className="text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gray-200 w-full min-h-[96%] max-h-[96%] overflow-y-scroll relative">
          <div className="flex flex-col justify-center items-center bg-gray-200 p-4 gap-2 rounded-md w-[100%]">
            {data ? (
              <div className="flex flex-col justify-center items-center bg-gray-200 gap-2 rounded-md w-[100%]">
                {Object.entries(data)
                  .filter(([key]) => key !== "id" && key !== "recordId")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-row rounded-md bg-white text-sm items-center w-full"
                    >
                      <div className="bg-[#cbcbcb] rounded-md p-2 w-[30%]">
                        {key}
                      </div>
                      <div className="text-black p-2 bg-white rounded-md w-[70%] truncate">
                        {formatValue(key, value)}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-600">No data available</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsSideModal;
