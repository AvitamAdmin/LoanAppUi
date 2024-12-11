"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";

import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import toast, { Toaster } from "react-hot-toast";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const EditloanType = () => {
  const [token, setToken] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const dispatch = useDispatch();
  const [listingPageSuccess, setListingPageSuccess] = useState(false)
  const [errors, setErrors] = useState([]);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const [initialload, setInitialLoad] = useState(true);
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
      fetchloanTypeData(jwtToken);
    }
  }, []);

  const fetchloanTypeData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const response = await axios.post(
        `${api}/loans/loanType/edit`,
        {
          loanTypeDtoList: selectedID.map((id) => ({ recordId: id })),
        },
        { headers }
      );
      console.log(response, "response from api");
      setlastmodifideBy(response.data.loanTypeDtoList[0]?.lastModified || "");
      setmodifiedBy(response.data.loanTypeDtoList[0]?.modifiedBy || "");
      setcreationTime(response.data.loanTypeDtoList[0]?.creationTime || "");
      setcreator(response.data.loanTypeDtoList[0]?.creator || "");
      const loanTypeDtoList = response.data.loanTypeDtoList.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
       
      }));

      setEditInputfields(loanTypeDtoList);
    } catch (error) {
      setError("Error fetching loanTypeDtoList data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setEditInputfields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index][name] = value;
      return updatedFields;
    });
  };
  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
  };
  // const handleloanTypeChange = (loanType, index, type) => {
  //   console.log(loanType, type, "loanType selected");

  //   setEditInputfields((prevFields) =>
  //     prevFields.map((field, i) =>
  //       i === index
  //         ? {
  //             ...field,
  //             [type === "parent"
  //               ? "parentId"
  //               : type === "child"
  //               ? "childIds"
  //               : "subsidiaries"]: loanType,
  //           }
  //         : field
  //     )
  //   );
  // };

  const validateForm = () => {
    let newErrors = {};
    let hasEmptySubsidiary = false;

    // Validate each field in editInputfields
    editInputfields.forEach((item, index) => {
      // Validate name
      if (!item.name.trim()) {
        newErrors[`name-${index}`] = "name is required.";
      }

      // Validate  description
      if (!item.description || item.description.trim() === "") {
        newErrors[`description-${index}`] =
          "description is required.";
      }

    
    });

    // Set errors in state
    setErrors(newErrors);

    // Return true only if there are no errors and subsidiary is selected
    return Object.keys(newErrors).length === 0 
  };

  const handlePostClick = async () => {
    if (!validateForm()) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        loanTypeDtoList: editInputfields.map((item) => ({
          recordId: item.recordId,
          name: item.name,
          description: item.description,
          status: item.ButtonActive,
        })),
      };

      const response = await axios.post(`${api}/loans/loanType/edit`, body, {
        headers,
      });
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

      console.log("Response:", response);
    } catch (error) {
      setError("Error saving data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const contentname = "loanTypeDtoList";

  return (
    <AddNewPageButtons
      lastmodifideBy={lastmodifideBy}
      modifiedBy={modifiedBy}
      creator={creator}
      creationTime={creationTime}
      pagename="Edit"
      breadscrums="Data > loanTypeDtoList"
      handleSaveClick={handlePostClick}
      email={email}
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
              <div className="p-2">
                <Toaster />
                <div className="flex flex-col bg-gray-200 min-h-screen w-full p-2 gap-3 rounded-md">
                  {editInputfields.map((item, index) => (
                    <div
                      key={item.recordId}
                      className="bg-white p-4 rounded-md shadow-md"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="mt-5">
                          <TextField
                            label="Enter name"
                            variant="standard"
                            fullWidth
                            name="name"
                            value={item.name || ""}
                            onChange={(e) => handleInputChange(e, index)}
                            error={!!errors[`name-${index}`]}
                            helperText={errors[`name-${index}`]}
                          />
                        </div>

                        <div className="mt-5">
                          <TextField
                            label="Enter Description"
                            variant="standard"
                            fullWidth
                            name="description"
                            value={item.description || ""}
                            onChange={(e) => handleInputChange(e, index)}
                            error={!!errors[`description-${index}`]}
                            helperText={errors[`description-${index}`]}
                          />
                        </div>
                        
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

export default EditloanType;
