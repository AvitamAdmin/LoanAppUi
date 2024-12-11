import React, { useState } from "react";
import { Modal } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearAllEditRecordIds } from "../../Redux/Slice/slice";

const ListingpageSuccessModal = ({
  isOpen,
  setIsModalOpen,
  contentname,
  aresuremodaltype,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleclick = () => {
    dispatch(clearAllEditRecordIds());
    router.back();
  };
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      className="flex flex-col w-full justify-center items-center backdrop-blur-sm p-2"
    >
      <div className="flex flex-col w-[35%] justify-center  items-center ">
        <div className="bg-gray-300 w-[100%] flex flex-col justify-center items-center  rounded-md gap-2 p-3">
          <div className=" w-full flex flex-row justify-end items-end">
            <div
              className="text-end flex flex-row cursor-pointer"
              onClick={closeModal}
            >
              <IoClose className="text-xl" />
            </div>
          </div>
          <div className="pb-4">
            Data Successfully modified on {contentname}
          </div>
          <div className="flex flex-row w-full justify-around items-center">
            <div
              className=" text-white font-semibold  p-2 rounded-md text-xs w-[150px] bg-[#cc0000dc] cursor-pointer text-center "
              onClick={() => {
                handleclick();
                // router.push("/cheil/admin/interface");
              }}
            >
              Listing Page
            </div>

            <div
              className=" text-white font-semibold p-2 rounded-md text-xs w-[150px] bg-[#2b2b2b] cursor-pointer text-center"
              onClick={closeModal}
            >
              Close
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ListingpageSuccessModal;
