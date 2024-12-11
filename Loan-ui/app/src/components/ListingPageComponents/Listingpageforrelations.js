import React, { useEffect, useState } from "react";
import DetailsSideModal from "../modal/DetailsSideModal";
import { MdDelete, MdFileUpload, MdOutlineEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import * as animationData from "../../../../assests/LoadingAnimation.json";
import { IoClose, IoSearch } from "react-icons/io5";
import { IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getdeleteElementId,
  getFilterInputValue,
  setchooesEditOrAdd,
  setMultipleEditRecoedId,
} from "../../Redux/Slice/slice";
import AdminEditButton from "../modal/AdminEditbutton";
import AreUSurepage from "../modal/AreUSurepage";
import Upload from "../modal/upload";
import { getCookie } from "cookies-next";
import axios from "axios";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Listingpageforrelation = ({
  fields,
  data,
  addnewroutepath,
  loading,
  cuurentpagemodelname
  // homeroutepath
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showInputs, setShowInputs] = useState(false);
  const [token, setToken] = useState("");
  const toggleInputs = () => setShowInputs(!showInputs);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  const [searchValues, setSearchValues] = useState(
    fields.reduce((acc, field) => {
      acc[field.value] = "";
      return acc;
    }, {})
  );

  // Function to safely access nested fields (e.g., parentNode.identifier)
  const getFieldValue = (item, fieldPath) => {
    const value = fieldPath
      .split(".")
      .reduce((obj, key) => (obj ? obj[key] : "-"), item);

    if (["status", "published"].some((field) => fieldPath.includes(field))) {
      // Convert boolean status or published to "active" or "inactive"
      return value === true ? "Active" : "Inactive";
    }

    return value === null || value === "" ? "-" : value;
  };
  // const handleExport = () => {
  //   // Prepare the worksheet data
  //   console.log("hii");
  //   const worksheetData = data.map((item) => {
  //     const row = {};
  //     fields.forEach((field) => {
  //       row[field.label] = getFieldValue(item, field.value);
  //     });
  //     return row;
  //   });

  //   // Create a worksheet and a workbook
  //   const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  //   // Get the range of the worksheet
  //   const range = XLSX.utils.decode_range(worksheet["!ref"]);

  //   // Apply bold styling to headers
  //   for (let C = range.s.c; C <= range.e.c; ++C) {
  //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Get the header cell address
  //     if (worksheet[cellAddress]) {
  //       worksheet[cellAddress].s = {
  //         font: { bold: true }, // Apply bold font style
  //       };
  //     }
  //   }

  //   // Convert the workbook to binary and create a downloadable link
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //     cellStyles: true,
  //   });
  //   const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  //   // Download the file
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = URL.createObjectURL(blob);
  //   downloadLink.download = `data.xlsx`;
  //   downloadLink.click();
  // };

  const handleSearchChange = (e, field) => {
    if (!e || !e.target || !field || !field.value) {
      return; // Safeguard in case e or field is undefined
    }
  
    // Update the search values state
    const newSearchValues = { ...searchValues, [field.value]: e.target.value };
    setSearchValues(newSearchValues);
  
    // Filter out empty fields and build the message object
    const message = {};
    fields.forEach((f) => {
      if (newSearchValues[f.value]?.trim()) {
        message[f.value] = newSearchValues[f.value];
      }
    });
    dispatch(getFilterInputValue(message));
    console.log("Updated message object for API request:", message);
    
    // Optional: Pass `message` to the API call or do something with it
    // You can implement the API call or filter logic here if needed
  };
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  let tapTimeout = null;

  const handleTap = (item) => {
    if (tapTimeout) {
      clearTimeout(tapTimeout); // Double tap detected
      tapTimeout = null;
      // Open the edit modal
    } else {
      tapTimeout = setTimeout(() => {
        handleOpenModal(item); // Handle single tap event
        tapTimeout = null;
      }, 300); // 300ms timeout for distinguishing between single and double tap
    }
  };

  const handleCheckboxClick = (recordId) => {
    // Or you can log it to the console
    // console.log("Record ID:", recordId);
    dispatch(setMultipleEditRecoedId(recordId));
  };

  const selectedMultipleID = useSelector(
    (state) => state.tasks.multipleEditRecordId
  );

  const handlemultipledelete = async () => {
    try {
      console.log("btn triggered");

      const headers = { Authorization: `Bearer ${token}` };

      // Create an array of objects, each with a single recordId
      const body = {
        [deleteKeyField]: selectedMultipleID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/${apiroutepath}/delete`,
        body,
        {
          headers
        }
      );

      if (response.data.message) {
        toast.success("Multiple Data deleted successfully!!");
        // router.push(`/cheil${homeroutepath}`);
        window.location.reload();
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting the record:", error);
      // Handle the error here (e.g., show a message to the user)
    }
  };

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  // console.log("Record ID by redux:", selectedID);
  // console.log("Record ID by redux length:", selectedID.length);

  return (
    <div className="w-[100%] overflow-hidden flex flex-col px-2 gap-3 pb-5  h-[100%]">
      <Toaster />
      <div className="p-1 rounded-md flex flex-row justify-between items-center w-full">
        <div className="flex flex-row gap-3 items-center">
          <div className="flex flex-row">
            
            <div onClick={handlemultipledelete}>
              <Tooltip
                arrow
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -14],
                        },
                      },
                    ],
                  },
                }}
                title="Delete"
              >
                <IconButton>
                  <MdDelete className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl " />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div
            className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-white gap-1"
            onClick={()=>{}}
          >
            <MdFileUpload className="text-gray-500 " />
            <span className="text-gray-500 text-xs">Export</span>
          </div>
          <div
            onClick={() => {
              router.push(`/cheil${addnewroutepath}`);
            }}
            className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-[#CC0001] gap-1"
          >
            <FaPlus className="text-white" />
            <span className="text-white text-xs">Add New</span>
          </div>
        </div>
      </div>

      {/* Search bar and inputs */}
      <div className="bg-white  rounded-md ">
        <div className="gap-3 flex flex-col  rounded-md   overflow-y-auto">
          <div
            style={{ backgroundColor: "#D3D3D3" }}
            className=" rounded-md shadow pl-4 pr-4"
          >
            <div className="flex items-center flex-row">
              <div className="flex flex-row w-full">
                <div className="flex items-center gap-2 text-sm w-20">
                  <input type="checkbox" />
                </div>
                {!showInputs ? (
                  <div className="w-full flex flex-row justify-between items-center pt-2.5 pb-2.5">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-1 text-sm w-[30%] "
                      >
                        <span>{field.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-row w-full justify-between items-start pt-2.5 pb-2.5">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm w-[30%]"
                      >
                        <input
                          key={index}
                          placeholder={`Search ${field.label}`}
                          value={searchValues[field.value]}
                          onChange={(e) => handleSearchChange(e, field)}
                          className="input-class text-sm flex items-start justify-start p-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-row items-center justify-end  gap-2 text-sm w-[10%]">
                  {showInputs ? (
                    <IoClose
                      className="cursor-pointer"
                      onClick={toggleInputs}
                    />
                  ) : (
                    <IoSearch
                      className="cursor-pointer"
                      onClick={toggleInputs}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Display the filtered data */}
          <div
            style={{ backgroundColor: "#fff" }}
            className=" p-4 max-h-96 min-h-96 rounded-md overflow-y-scroll"
          >
            {loading ? (
              <div className="w-full flex flex-col  h-80 justify-center items-center">
                <div className="opacity-25 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>Loading data...</div>
              </div>
            ) : (
              <div className="space-y-2 max-w-[100%]">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-600 text-xs w-full "
                  >
                    <div className="flex items-center gap-2 text-sm w-[5%]">
                      <input
                        checked={selectedID.includes(item.recordId)}
                        type="checkbox"
                        onChange={(e) => handleCheckboxClick(item.recordId)}
                      />
                    </div>
                    <div
                      className="flex w-[90%] justify-between cursor-pointer"
                      onClick={() => handleTap(item)}
                    >
                      {fields.map((field, idx) => (
                        <div
                          key={idx}
                          className="flex text-center  flex-row w-[25%] overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                          <span>{getFieldValue(item, field.value)}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      onClick={() => {
                        dispatch(getdeleteElementId(item.recordId));
                        openModal();
                      }}
                      className="gap-3 flex flex-row "
                    >
                      <Tooltip
                        arrow
                        placement="right-start"
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -14],
                                },
                              },
                            ],
                          },
                        }}
                        title="Delete"
                      >
                        <IconButton>
                          <MdDelete className="text-black   rounded-md text-xl " />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
      </div>

    </div>
  );
};

export default Listingpageforrelation;
