"use client";
import React, { useEffect, useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import MultiSelectCategories from "@/app/src/components/multiSelectDropdown/MultiSelectCategories";
import toast, { Toaster } from "react-hot-toast";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const EditloanLimit = () => {
  const [token, setToken] = useState("");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editInputFields, setEditInputFields] = useState([]);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [listingPageSuccess, setListingPageSuccess] = useState(false)
  const [initialload, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState([]);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
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
      console.log(jwtToken, "jwtToken response");
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

    const updatedFields = editInputFields.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value };
      }
      return item;
    });

    setEditInputFields(updatedFields);
  };

  const dispatch = useDispatch();

  const validateForm = () => {
    let newErrors = {};
    let hasEmptySubsidiary = false;

    // Validate each field in editInputfields
    editInputFields.forEach((item, index) => {
      // Validate name
      if (!item.name.trim()) {
        newErrors[`name-${index}`] = "name is required.";
      }

      // Validate short description
      if (!item.description || item.description.trim() === "") {
        newErrors[`description-${index}`] =
          "Short description is required.";
      }

    
    });

    // Set errors in state
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0 
  };

  const handlePostClick = async () => {
    try {
      if (!validateForm()) return;

      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        loanLimitDtos: editInputFields.map((item) => ({
          recordId: item.recordId,
          name: item.name || "",
          description: item.description || "",
          status: item.ButtonActive,
        })),
      };

      // Log the data being sent to the API
      console.log(body, "Submitting form data");

      const response = await axios.post(`${api}/loans/loanLimit/edit`, body, {
        headers,
      });

      // Log the response from the API
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
      setError("Error saving model data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async (jwtToken) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { loanLimitDtos: selectedID.map((id) => ({ recordId: id })) };
      const response = await axios.post(`${api}/loans/loanLimit/edit`, body, {
        headers,
      });
      setlastmodifideBy(response.data.loanLimitDtos[0]?.lastModified || "");
      setmodifiedBy(response.data.loanLimitDtos[0]?.modifiedBy || "");
      setcreationTime(response.data.loanLimitDtos[0]?.creationTime || "");
      setcreator(response.data.loanLimitDtos[0]?.creator || "");
      const loanLimitDtos = response.data.loanLimitDtos.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
       
      }));

      
      setEditInputFields(loanLimitDtos);

      setLoading(false);
      console.log(response.data.models, "response from API");
    } catch (err) {
      setError("Error fetching locator data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pagename = "Edit loanLimit";
  const breadscrums = "Loans > loanLimit";
  const contentname = "loanLimit";

  const handleButtonClick = (index) => {
    const updatedFields = [...editInputFields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputFields(updatedFields);
  };
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
          {editInputFields.length < 1 ? (
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
                  {editInputFields.length > 0 ? (
                    editInputFields.map((item, index) => (
                      <div key={item.recordId}>
                        <div className="flex flex-col bg-gray-200 p-2 rounded-md ">
                          <div className="bg-white p-4 rounded-md shadow-md">
                            <div className="grid grid-cols-2 gap-4 mb-4 items-center justify-center  flex-col">
                              <TextField
                                className="mt-5"
                                label="Enter Name"
                                variant="standard"
                                fullWidth
                                name="name"
                                value={item.name}
                                onChange={(e) => handleInputChange(e, index)}
                                error={!!errors[`name-${index}`]}
                                helperText={errors[`name-${index}`]}
                              />
                              <TextField
                                className="mt-5"
                                label="Enter Description"
                                variant="standard"
                                fullWidth
                                name="description"
                                value={item.description}
                                onChange={(e) => handleInputChange(e, index)}
                                error={!!errors[`description-${index}`]}
                                helperText={errors[`description-${index}`]}
                              />
                              
                            </div>

                            <div className="flex flex-col gap-4">
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
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No locator data available.</p>
                  )}
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

export default EditloanLimit;
