"use client";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CircularProgress, TextField } from "@mui/material";
import { TbClockEdit, TbClockPlus } from "react-icons/tb";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import environment from "../page";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import toast, { Toaster } from "react-hot-toast";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const Editnotification = () => {
  useEffect(() => {
    console.log("initial call");

    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);

      console.log("JWT Token retrieved:", jwtToken);
    } else {
      console.log("No token found");
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

  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listingPageSuccess, setListingPageSuccess] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [editInputfields, seteditInputfields] = useState([]);
  const [initialload, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState({});
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  const [formValues, setFormValues] = useState({
    text: "",

  });
  const { text, } = formValues;

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);



  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: { ...item.parentNode, text: value },
          };
        }
        return { ...item, [name]: value };
      }
      return item;
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    seteditInputfields(updatedFields);
  };

  const validateForm = () => {
    let newErrors = {};
    let hasEmptySubsidiary = false;

    // Validate each field in editInputfields
    editInputfields.forEach((item, index) => {
      if (!item.text.trim()) {
        newErrors[`text-${index}`] = "Text is required.";
      }


    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  };

  const handlePostClick = async () => {
    if (!validateForm()) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        notificationDtoList: editInputfields.map((item) => ({
          recordId: item.recordId,
          text: item.text || "-",
          status: item.status,
        })),
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/notification/edit`, body, {
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


      console.log(response.data, "response from API");
    } catch (err) {
      setError("Error saving Datasource data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleButtonActive = (index) => {
    seteditInputfields((prevFields) => {
      return prevFields.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            ButtonActive: !item.ButtonActive,
          };
        }
        return item;
      });
    });
  };
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const handlefetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { notificationDtoList: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(
        `${api}/admin/notification/getedit`,
        body,
        { headers }
      );
      setlastmodifideBy(response.data.notificationDtoList[0]?.lastModified || "");
      setmodifiedBy(response.data.notificationDtoList[0]?.modifiedBy || "");
      setcreationTime(response.data.notificationDtoList[0]?.creationTime || "");
      setcreator(response.data.notificationDtoList[0]?.creator || "");

      const notificationDtoList = response.data.notificationDtoList.map((item) => ({
        ...item,
        ButtonActive: item.status,

      }));

      seteditInputfields(notificationDtoList);


    } catch (err) {
      setError("Error fetching notification data");
    } finally {
      setLoading(false);
    }
  };



  const handleRunClick = () => {
    alert("Run function executed from EditNotification!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Notification";
  const contentname = "Notification";

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
            <div className="w-full flex flex-col h-40 justify-center items-center">
              <div className="opacity-35">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data found...</div>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex flex-col bg-gray-200 p-2 gap-5">
                {editInputfields.map((item, index) => {
                  console.log(editInputfields, "editInputfields editInputfields"); // Debugging logs

                  return (
                    <div key={item.recordId} className="flex flex-col bg-white rounded-md">
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="grid p-3 rounded-md grid-cols-1 gap-5 items-center">
                          <TextField
                            label="Enter Text"
                            variant="standard"
                            name="text"
                            value={item.text || ""}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </div>
                        <div className="flex flex-row gap-3 items-center w-full justify-end">
                          {item.ButtonActive ? (
                            <div
                              onClick={() => handleToggleButtonActive(index)}
                              className="bg-[#1581ed] text-center cursor-pointer  border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                            >
                              Active
                            </div>
                          ) : (
                            <div
                              onClick={() => handleToggleButtonActive(index)}
                              className="bg-[#fff] border-2 border-solid border-gray-400 text-center cursor-pointer rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                            >
                              InActive
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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

export default Editnotification;
