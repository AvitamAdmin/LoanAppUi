"use client";
import React, { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import toast, { Toaster } from "react-hot-toast";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const EditDataRelation = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editInputfields, setEditInputfields] = useState([]);
  const router = useRouter();
  const [email, setEmail] = useState("");
 
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [listingPageSuccess, setListingPageSuccess] = useState(false)
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const dispatch = useDispatch();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
      // getfetchInputFields();
    }
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: { ...item.parentNode, identifier: value },
          };
        }
        return { ...item, [name]: value };
      }
      return item;
    });

    // Clear errors for the current field
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Update state with modified fields
    setEditInputfields(updatedFields);
  };
  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
  };


  const [errors, setErrors] = useState([]);

  const validateFields = () => {
    const newErrors = editInputfields.map((field) => ({
      identifier: !field.identifier ? "Identifier is required" : "",
      name: !field.name
        ? "name is required"
        : "",
    }));

    setErrors(newErrors);

    // If any field has an error, return false to stop submission
    return newErrors.every((err) => !err.identifier && !err.name);
  };

  const handlePostClick = async () => {
    if (!validateFields()) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        roleDtoList: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "",
          name: item.name || "",
          status: item.ButtonActive,
         
        })),
      };

      console.log(body, "Filtered Request Body");

      const response = await axios.post(
        `${api}/admin/role/edit`,
        body,
        { headers }
      );
      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setListingPageSuccess(true);
      } else if (response.data.success === false) {
        // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }

      console.log(response.data, "API Response");
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  

  const handleFetchData = async (jwtToken) => {
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = {
        roleDtoList: selectedID.map((id) => ({ recordId: id })),
      };

      
      const response = await axios.post(
        `${api}/admin/role/edit`,
        body,
        { headers }
      );
      
      console.log(response.data.roleDtoList, "API Response");
      
      const dataWithDefaults = response.data.roleDtoList.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
       
      }));

      

      setEditInputfields(dataWithDefaults);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const contentname = "Role";


  return (
    <AddNewPageButtons
      lastmodifideBy={lastmodifideBy}
      modifiedBy={modifiedBy}
      creator={creator}
      creationTime={creationTime}
      email={email}
      pagename="Edit"
      breadscrums="Admin > Role"
      handleSaveClick={handlePostClick}
    >
      {loading ? (
        <>
          <div className="flex flex-row justify-center items-center w-full h-40">
            <div className="gap-5 flex flex-col items-center justify-center">
              <CircularProgress size={36} color="inherit" />
              <div>Loading...</div>
            </div>
          </div>
        </>
      ) : (
        <>
          {editInputfields.length < 1 ? (
            <div className="w-full flex flex-col  h-40 justify-center items-center">
              <div className="opacity-35 ">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data found...</div>
            </div>
          ) : (
            <>
              <Toaster />
              <div className="p-2">
                <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
                  {editInputfields.map((item, index) => (
                    <div
                      key={item.recordId}
                      className="bg-white p-4 rounded-md shadow-md"
                    >
                      <div className="grid grid-cols-3 gap-5 mb-4">
                        <TextField
                          label="Identifier"
                          variant="standard"
                          name="identifier"
                          value={item.identifier || ""}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors[index]?.identifier} // Check if there's an error
                          helperText={errors[index]?.identifier} // Display error message
                        />

                        <TextField
                          label="Name"
                          variant="standard"
                          name="name"
                          value={item.name || ""}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors[index]?.name} // Check if there's an error
                          helperText={errors[index]?.name} // Display error message
                        />

                        <div className="flex flex-row gap-6 justify-end items-end">
                          {item.ButtonActive ? (
                            <div
                              onClick={() => handleButtonClick(index)}
                              className="bg-[#1581ed] text-center cursor-pointer  border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px]"
                            >
                              Active
                            </div>
                          ) : (
                            <div
                              onClick={() => handleButtonClick(index)}
                              className="bg-[#fff] border-2 border-solid border-gray-400 text-center cursor-pointer rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px]"
                            >
                              Inactive
                            </div>
                          )}

                          
                        </div>
                      </div>

                     
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
      <ListingpageSuccessModal
          contentname={contentname}
          isOpen={listingPageSuccess}
          setIsModalOpen={setListingPageSuccess}
        />
    </AddNewPageButtons>
  );
};

export default EditDataRelation;
