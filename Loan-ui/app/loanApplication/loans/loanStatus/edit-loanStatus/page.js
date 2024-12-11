"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";

import * as animationData from "../../../../../assests/LoadingAnimation.json";
import Lottie from "react-lottie";
import toast, { Toaster } from "react-hot-toast";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const EditloanStatus = () => {
  const [token, setToken] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const dispatch = useDispatch();
  const [listingPageSuccess, setListingPageSuccess] = useState(false)
  
  const [errors, setErrors] = useState([]);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
    }
  }, []);
  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...editInputfields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setEditInputfields(updatedFields);
  };

  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
  };

  

  const validateForm = () => {
    let newErrors = {};
    let hasEmptySubsidiary = false;

    // Validate each field in editInputfields
    editInputfields.forEach((item, index) => {
      // Validate identifier
      if (!item.name.trim()) {
        newErrors[`name-${index}`] = "Name is required.";
      }

    });

    // Set errors in state
    setErrors(newErrors);

    
    return Object.keys(newErrors).length === 0
  };

  const handlePostClick = async () => {
    if (!validateForm()) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        loanStatusDtos: editInputfields.map((item) => ({
          recordId: item.recordId,
          name: item.name,
          status: item.ButtonActive,
        })),
      };

      console.log(body, "req body from user");
      const response = await axios.post(`${api}/loans/loanStatus/edit`, body, {
        headers,
      });
      console.log(response.data, "response from API");
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
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on selected record IDs
  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { loanStatusDtos: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(`${api}/loans/loanStatus/edit`, body, {
        headers,
      });
      setlastmodifideBy(response.data.loanStatusDtos[0]?.lastModified || "");
      setmodifiedBy(response.data.loanStatusDtos[0]?.modifiedBy || "");
      setcreationTime(response.data.loanStatusDtos[0]?.creationTime || "");
      setcreator(response.data.loanStatusDtos[0]?.creator || "");
      setLoading(false);
      const loanStatusdata = response.data.loanStatusDtos.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
      }));
      console.log(loanStatusdata, "req body from edit-loanstatus");

      setEditInputfields(loanStatusdata);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditloanStatus!");
  };

  const pagename = "Edit";
  const breadscrums = "Data > loanStatus";
  const contentname = "loanStatus";


  return (
    <AddNewPageButtons
      lastmodifideBy={lastmodifideBy}
      modifiedBy={modifiedBy}
      creator={creator}
      creationTime={creationTime}
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
      handleRunClick={handleRunClick}
    >
      {" "}
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
              <div className="p-2">
                <Toaster />
                <div className="flex flex-col bg-gray-200 min-h-screen w-full p-2 gap-3 rounded-md">
                  {editInputfields.map((item, index) => (
                    <div
                      key={item.recordId}
                      className="bg-white p-4 rounded-md shadow-md"
                    >
                      <div className="grid grid-cols-1 gap-4 mb-4 items-center justify-center  flex-col">
                        <TextField
                          label="Enter name"
                          variant="standard"
                          fullWidth
                          name="name"
                          value={item.name || ""}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors[`identifier-${index}`]}
                          helperText={errors[`identifier-${index}`]}
                        />
                       
                      </div>
                      <div className="flex gap-4 items-center justify-end">
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

export default EditloanStatus;
