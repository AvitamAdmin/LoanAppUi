import React, { useEffect, useState } from "react";
import { Modal, TextField } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllEditRecordIds,
  clearDeleteElementId,
  triggerDeleteSuccess,
} from "../../Redux/Slice/slice";
import { getCookie } from "cookies-next";
import axios from "axios";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";

const SavedQueries = ({ isOpen, setIsModalOpen,deleteKeyField,apiroutepath }) => {
    const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);
    console.log(advanceSearchInputs,"advanceSearchInputs advanceSearchInputs advanceSearchInputs");
    console.log(deleteKeyField,"PGA-2711");

  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearAllEditRecordIds());
  };

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);
  const [inputField, setInputField] = useState({
    identifier: "",
    shortDescription: "",
  });
  const { identifier, shortDescription } = inputField;
  const handleChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input field
    setInputField({
      ...inputField, // Spread the current state to preserve other fields
      [name]: value, // Dynamically update the changed field
    });
  };
 
  const handleSaveQuery = async () => {
    try {
      console.log("handleSaveQuery btn triggered");
  
      const headers = { Authorization: `Bearer ${token}` };
  
      // Validate that deleteKeyField exists in advanceSearchInputs and is an array
      const dynamicData = advanceSearchInputs[deleteKeyField];
      if (!dynamicData || !Array.isArray(dynamicData)) {
        throw new Error(
          `Invalid deleteKeyField: ${deleteKeyField}. Expected an array in advanceSearchInputs.`
        );
      }
  
      // Construct the `queries` array from the dynamic field
      const queries = dynamicData
        .map((node) =>
          Object.entries(node).map(([key, value]) => {
            const [val, condition] = value.split("|");
            return {
              attribute: key,
              condition,
              value: val.trim(),
            };
          })
        )
        .flat(); // Flatten the nested array
  
      console.log(queries, "queries queries");
  
      // Create the body for the request
      const body = {
        identifier,
        shortDescription,
        operator: advanceSearchInputs.operator,
        queries,
      };
  
      console.log("Request Body:", body);
  
      // Uncomment to make the API call
      const response = await axios.post(
        `${api}/admin/${apiroutepath}/saveSearchQuery`,
        body,
        {
          headers,
        }
      );
  
      // Uncomment to handle the response
      if (response.data=== "Success") {
        closeModal();
        toast.success("Data saved successfully!");
        dispatch(triggerDeleteSuccess());
        dispatch(clearDeleteElementId());
      }
    } catch (error) {
      console.error("Error saving the query:", error);
    }
  };
  


  
  

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      className="flex flex-col w-full justify-center items-center backdrop-blur-sm p-2"
    >
      <div className="flex flex-col w-[30%] justify-center  items-center ">
        <Toaster />
        <div className="bg-gray-300 w-[100%] flex flex-col justify-center items-center  rounded-md gap-4 p-3">
          <div className=" w-full flex flex-row justify-end items-end">
            <div
              className="text-end flex flex-row cursor-pointer"
              onClick={closeModal}
            >
              <IoClose className="text-xl" />
            </div>
          </div>
          <div className="text-xl font-semibold">Save Search</div>
          <div className="flex flex-row justify-center items-center gap-5">
            <TextField
              name="identifier" // Add a name attribute to identify the field
              variant="standard"
              size="small"
              placeholder="Enter Identifier"
              value={identifier}
              onChange={handleChange} // Pass the handleChange function
            />
            <TextField
              name="shortDescription" // Add a name attribute to identify the field
              variant="standard"
              size="small"
              placeholder="Enter Short Description"
              value={shortDescription}
              onChange={handleChange} // Pass the handleChange function
            />
          </div>
          <div className="flex flex-row w-full justify-around items-center">
            <div
              className=" text-white font-semibold p-2 rounded-md text-xs w-[70px] bg-[#2b2b2b] cursor-pointer text-center"
              onClick={closeModal}
            >
              Cancel
            </div>

            <div
              className=" text-white font-semibold  p-2 rounded-md text-xs w-[70px] bg-[#cc0000dc] cursor-pointer text-center "
              onClick={() => handleSaveQuery()}

            >
              Save
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SavedQueries;
