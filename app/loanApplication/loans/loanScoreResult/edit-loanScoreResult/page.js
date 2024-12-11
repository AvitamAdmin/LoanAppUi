"use client";
import React, { useState, useEffect } from "react";
import { CircularProgress, MenuItem, TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import SelectCategory from "@/app/src/components/dropdown/Category";
import Models from "@/app/src/components/dropdown/Models";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const EditloanScoreResult = () => {
  const [token, setToken] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();
  const [initialload, setInitialLoad] = useState(true);
  const [listingPageSuccess, setListingPageSuccess] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setEditInputfields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = { ...updatedFields[index], [name]: value };
      return updatedFields;
    });
  };



  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
  };
  const dispatch = useDispatch();
  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        loanScoreDtos: editInputfields.map((item) => ({
          recordId: item.recordId,
          name: item.name || "",
          description: item.description || "",
          status: item.ButtonActive,
        })),
      };

      const response = await axios.post(`${api}/loans/loanScoreResult/edit`, body, {
        headers,
      });
      console.log(response, "response from api");
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
      console.error("Error:", err);
    }
  };

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { loanScoreDtos: selectedID.map((id) => ({ recordId: id })) };
      const response = await axios.post(`${api}/loans/loanScoreResult/edit`, body, {
        headers,
      });
      setlastmodifideBy(response.data.loanScoreDtos[0]?.lastModified || "");
      setmodifiedBy(response.data.loanScoreDtos[0]?.modifiedBy || "");
      setcreationTime(response.data.loanScoreDtos[0]?.creationTime || "");
      setcreator(response.data.loanScoreDtos[0]?.creator || "");

      const loanScoreDtos = response.data.loanScoreDtos.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
       
      }));
      setEditInputfields(loanScoreDtos);
    } catch (err) {
      setError("Error fetching variant data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const pagename = "Edit loanScoreResult";
  const breadscrums = "Admin > loanScoreResult";
  const contentname = "loanScoreResult";


  return (
    <AddNewPageButtons
      lastmodifideBy={lastmodifideBy}
      modifiedBy={modifiedBy}
      creator={creator}
      creationTime={creationTime}
      pagename={pagename}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
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
              <div className="flex flex-col w-full p-3 min-h-screen gap-5">
                <Toaster />
                {editInputfields.map((item, index) => (
                  <div
                    key={item.recordId}
                    className="bg-white p-4 rounded-md shadow-md"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <TextField
                        label="Enter name"
                        variant="standard"
                        fullWidth
                        name="name"
                        value={item.name || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <TextField
                        label="Enter Description"
                        variant="standard"
                        fullWidth
                        name="description"
                        value={item.description || ""}
                        onChange={(e) => handleInputChange(e, index)}
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

export default EditloanScoreResult;
