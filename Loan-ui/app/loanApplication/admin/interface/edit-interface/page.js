"use client";
import React, { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import toast, { Toaster } from "react-hot-toast";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const EditInterface = () => {
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [buttonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialload, setInitialLoad] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [listingPageSuccess, setListingPageSuccess] = useState(false)
  const [editInputfields, setEditInputfields] = useState([]);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleAddParamClick = () => {
    setParams([...params, ""]);
  };

  const handleRemoveParamClick = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  // Handle change for form inputs
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: item.parentNode
              ? { ...item.parentNode, identifier: value }
              : { identifier: value },
          };
        }
        return { ...item, [name]: value };
      }
      return item;
    });

    setEditInputfields(updatedFields);
  };

  const dispatch = useDispatch();
  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        nodeDtos: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "",
         
          displayPriority: item.displayPriority || "",
          path: item.path || "",
          // Check if parentNode is an object or a string, and handle accordingly
          parentNode:
            typeof item.parentNode === "object"
              ? { recordId: item.parentNode.recordId }
              : { recordId: item.parentNode },
          status: item.ButtonActive,
        })),
      };

      console.log(body, "req body from user");

      const response = await axios.post(`${api}/admin/interface/edit`, body, {
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
      setError("Error saving Datasource data");
      console.error(err);
    }
  };

  const handleFetchData = async (jwtToken) => {
    setLoading(true); // Set loading state
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = {
        nodeDtos: selectedID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/interface/edit`,
        body,
        { headers }
      );
      setlastmodifideBy(response.data.nodeDtos[0]?.lastModified || "");
      setmodifiedBy(response.data.nodeDtos[0]?.modifiedBy || "");
      setcreationTime(response.data.nodeDtos[0]?.creationTime || "");
      setcreator(response.data.nodeDtos[0]?.creator || "");
      const nodeDtos = response.data.nodeDtos.map((item) => ({
        ...item,
        ButtonActive: item.status || false, // Ensure ButtonActive is properly initialized
      }));
      setEditInputfields(nodeDtos);
      console.log(response.data.nodeDtos, "response from API");
    } catch (err) {
      setError("Error fetching Datasource data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditInterface!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Interface";
  const contentname = "Interface";

  // Toggle ButtonActive for a specific field
  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
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
                <div className="flex flex-col bg-gray-200  p-2 gap-3 rounded-md">
                  {editInputfields.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-md shadow-md"
                    >
                      <div className="grid grid-cols-4 gap-5 mb-4">
                        <TextField
                          label="Identifier"
                          variant="standard"
                          className="text-xs"
                          name="identifier"
                          value={item.identifier || ""}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      

                        <TextField
                          label="Path"
                          variant="standard"
                          className="text-xs w-full"
                          name="path"
                          value={item.path || ""}
                          onChange={(e) => handleInputChange(e, index)} // Pass index
                        />
                        <NodeDropdown
                          initialload={initialload}
                          selectedNode={item.parentNode || null} // Pass selected node
                          setSelectedNode={(newNode) => {
                            const updatedFields = editInputfields.map(
                              (field, i) => {
                                if (i === index) {
                                  return { ...field, parentNode: newNode }; // Update node data
                                }
                                return field;
                              }
                            );
                            setEditInputfields(updatedFields); // Update state
                          }}
                        />
                        <TextField
                          label="Display Order"
                          variant="standard"
                          type="number"
                          className="text-xs"
                          name="displayPriority"
                          value={item.displayPriority || ""}
                          onChange={(e) => handleInputChange(e, index)} // Pass index
                        />
                      </div>
                      <div className="flex gap-4 items-center w-[100%] justify-end">
                        <div className="flex flex-row gap-3 items-center">
                          {item.ButtonActive ? (
                            <div
                              onClick={() => handleButtonClick(index)}
                              className="bg-[#1581ed]  border-2 border-solid  border-[#1581ed] text-center cursor-pointer rounded-md text-white text-xs px-2 py-0.5 w-[80px]"
                            >
                              Active
                            </div>
                          ) : (
                            <div
                              onClick={() => handleButtonClick(index)}
                              className="bg-[#fff] border-2 border-solid  border-gray-400  text-center cursor-pointer rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px]"
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

export default EditInterface;
