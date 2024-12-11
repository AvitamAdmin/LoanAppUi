import { Modal } from "@mui/material";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const ExportDownloadModal = ({
  setIsModalOpen,
  isOpen,
  handleClose,
  handleclick,
  exportDownloadContent,
}) => {
  const [selectedContent, setSelectedContent] = useState([]); // Track selected content as an array

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectContent = (value) => {
    setSelectedContent((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value) // Remove if already selected
        : [...prevSelected, value] // Add if not selected
    );
    handleclick(value); // Call handleclick with the selected content
    console.log("Selected content:", value);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className="flex flex-col w-full justify-center items-center backdrop-blur-sm p-2"
    >
      <div className="flex flex-col w-[70%] bg-transparent justify-center items-center">
        <div className="bg-gray-300 w-[100%] pb-4 flex flex-col rounded-xl gap-4">
          {/* Modal Header */}
          <div className="w-full flex flex-row justify-between items-center p-3 rounded-t-lg bg-black">
            <div className="text-white text-md">Export</div>
            <div className="text-end flex flex-row cursor-pointer" onClick={closeModal}>
              <IoClose className="text-xl text-white" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-2">
            <div className="px-2 text-[#636363]">Select Category to Download</div>
            <div className="mt-4 w-full grid grid-cols-4 gap-5">
              {exportDownloadContent.map((item) => (
                <div
                  key={item.value}
                  onClick={() => handleSelectContent(item.value)}
                  className={` w-full gap-2 justify-start items-center transition-all hover:bg-[#cc0000bb] hover:text-white text-left flex flex-row text-sm px-4 py-2 rounded-lg cursor-pointer ${
                    selectedContent.includes(item.value)
                      ? "bg-[#CC0001] text-white"
                      : "bg-gray-200 hover:bg-[#CC0001]"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex flex-row justify-center items-center">
                    <input
                  onClick={() => handleSelectContent(item.value)}
                  type="checkbox"
                      checked={selectedContent.includes(item.value)} // Set checkbox checked based on selection
                      onChange={() => handleSelectContent(item.value)} // Handle checkbox change
                    />
                  </div>
                  <div className=" overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-row gap-10 justify-end px-10">
            <div className="bg-[#4d4d4d] text-white text-sm  px-5 py-1 rounded-md cursor-pointer">Cancel</div>
            <div className="bg-[#CC0001] text-white text-sm px-5 py-1 rounded-md cursor-pointer">Export</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportDownloadModal;
