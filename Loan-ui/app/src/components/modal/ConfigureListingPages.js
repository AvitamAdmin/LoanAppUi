import { api } from "@/envfile/api";
import { Modal } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setConfigureListingPageModal } from "../../Redux/Slice/slice";
import toast, { Toaster } from "react-hot-toast";
import { SkipConfigureListingPages } from "../SkipComponent/SkipConfigureListingPages";

const ConfigureListingPages = ({
  setIsconfigureModalOpen,
  isconfigureOpen,
  handleClose,
  apiroutepath
}) => {
  const dispatch = useDispatch();
    const [token, setToken] = useState("");
  const [selectedContent, setSelectedContent] = useState([]); 
  const [getAdvancedSearchData, setGetAdvancedSearchData] = useState([])
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    console.log(jwtToken,"jwttoken from configure modal");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);
  const fetchFilterInputs = useSelector(
    (state) => state.tasks.configureListingPageModal
  );
  console.log("fetchFilterInputs content:", fetchFilterInputs); // Log the updated state

  useEffect(() => {
    if (token) {
      getAdvancedSearch();
    }
  }, [token]);

  const getAdvancedSearch = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${api}/admin/${apiroutepath}/getAdvancedSearch`,
        { headers }
      );
      setGetAdvancedSearchData(response.data || []);
    } catch (error) {
      console.error("Error fetching getAdvancedSearch:", error);
    }
  };

  const closeModal = () => {
    setIsconfigureModalOpen(false);
  };

  const handleSelectContent = (value, label) => {
    setSelectedContent((prevSelected) => {
      const exists = prevSelected.find((item) => item.value === value);
      const updatedSelected = exists
        ? prevSelected.filter((item) => item.value !== value) // Remove if already exists
        : [...prevSelected, { label, value }]; // Add if not exists
  
      console.log("Updated selected content:", updatedSelected); // Log local state
      return updatedSelected; // Update local state only
    });
  };
  
  const handleclick = () => {
    if (selectedContent.length < 3) {
      toast.error("Select atleast 3 items");
      return;
    }
  
    if (selectedContent.length > 5) {
      toast.error("You can select a maximum of 5 items.");
      return;
    }
  
    // Dispatch the selected content to Redux
    dispatch(setConfigureListingPageModal(selectedContent));
    console.log("Selected content applied:", selectedContent); // Confirm what is dispatched
    setIsconfigureModalOpen(false);

  };
  const reset = () => {
    const selectedContent = [];
    setSelectedContent([]);
    // Dispatch the selected content to Redux
    dispatch(setConfigureListingPageModal(selectedContent));
    setIsconfigureModalOpen(false);

  };
  

  return (
    <Modal
      open={isconfigureOpen}
      onClose={handleClose}
      className="flex flex-col w-full justify-center items-center backdrop-blur-sm p-2"
    >
      
      <div className="flex flex-col w-[70%] bg-transparent justify-center items-center">
      <Toaster />
        <div className="bg-gray-300 w-[100%] pb-4 flex flex-col rounded-xl gap-4">
          {/* Modal Header */}
          <div className="w-full flex flex-row justify-between items-center p-3 rounded-t-lg bg-black">
            <div className="text-white text-md">Configure</div>
            <div className="text-end flex flex-row cursor-pointer" onClick={closeModal}>
              <IoClose className="text-xl text-white" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-2">
            <div className="mt-4 w-full grid grid-cols-4 gap-5">
              {getAdvancedSearchData.filter((item) => !SkipConfigureListingPages.includes(item.attribute)).map((item,id) => (
                <div
                key={id}
                onClick={() => handleSelectContent(item.attribute, item.label)}
                className={` w-full gap-2 justify-start items-center transition-all hover:bg-[#cc0000bb] hover:text-white text-left flex flex-row text-sm px-4 py-2 rounded-lg cursor-pointer ${
                  selectedContent.find((obj) => obj.value === item.attribute)
                    ? "bg-[#CC0001] text-white"
                    : "bg-gray-200 hover:bg-[#CC0001]"
                }`}
              >
                {/* Checkbox */}
                {/* <div className="flex flex-row justify-center items-center">
                  <input
                    type="checkbox"
                    checked={!!selectedContent.find((obj) => obj.value === item.attribute)} // Check if the object exists
                    onChange={() => handleSelectContent(item.attribute, item.label)} // Handle checkbox change
                  />
                </div> */}
                <div className="overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                  {item.label}
                </div>
              </div>
              
              ))}
            </div>
          </div>
          <div className="w-full flex flex-row gap-10 justify-end px-10">
          <div onClick={reset} className="bg-[#4d4d4d] text-white text-sm  px-5 py-1 rounded-md cursor-pointer">Reset & Exit</div>
            <div onClick={() => setSelectedContent([])} className="bg-[#4d4d4d] text-white text-sm  px-5 py-1 rounded-md cursor-pointer">Clear</div>
            <div onClick={handleclick} className="bg-[#CC0001] text-white text-sm px-5 py-1 rounded-md cursor-pointer">Apply</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigureListingPages;
