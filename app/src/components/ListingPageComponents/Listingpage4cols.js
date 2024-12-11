import React, { useEffect, useState } from "react";
import DetailsSideModal from "../modal/DetailsSideModal";
import { MdDelete, MdFileUpload, MdOutlineEdit } from "react-icons/md";
import { FaPlus, FaSearchPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import * as animationData from "../../../../assests/LoadingAnimation.json";
import { IoClose, IoSearch } from "react-icons/io5";
import { IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getdeleteElementId,
  getFilterInputValue,
  setMultipleEditRecoedId,
  clearDeleteElementId,
  triggerDeleteSuccess,
  clearAllEditRecordIds,
} from "../../Redux/Slice/slice";
import AdminEditButton from "../modal/AdminEditbutton";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import AreUSurepage from "../modal/AreUSurepage";
import { getCookie } from "cookies-next";
import axios from "axios";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import UploadModal from "../modal/upload";
import ExportDownloadModal from "../modal/ExportDownloadModal";
import { skipmultipleedit } from "../SkipComponent/Skipmultipleedit";
import AdvanceSearch from "../modal/AdvanceSearch";
import { TbTemplate } from "react-icons/tb";
import { IoMdCloudUpload } from "react-icons/io";
import { GrConfigure } from "react-icons/gr";
import ConfigureListingPages from "../modal/ConfigureListingPages";

const Listingpage4cols = ({
  fields,
  data,
  currentPage,
  sizePerPage,
  totalPages,
  totalRecord,
  onPageChange,
  onSizeChange,
  endRecord,
  startRecord,
  addnewroutepath,
  editnewroutepath,
  breadscrums,
  loading,
  cuurentpagemodelname,
  aresuremodal,
  aresuremodaltype,
  apiroutepath,
  deleteKeyField,
  exportDownloadContent={exportDownloadContent}
}) => {
  const router = useRouter();
  
  const [showInputs, setShowInputs] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvanceSearchModalOpen, setIsAdvanceSearchModalOpen] =
  useState(false);
  const [isConfigureListingModal, setIsConfigureListingModal] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMultipleModalOpen, setIsMultipleModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const configureListingPageModal = useSelector(
    (state) => state.tasks.configureListingPageModal
  );
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openMultipleModal = () => {
    setIsMultipleModalOpen(true);
  };

  const closeMultipleModal = () => {
    setIsMultipleModalOpen(false);
  };
  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false);
  };
  const openConfigureListingModal = () => {
    setIsConfigureListingModal(true);
  };

  const closeConfigureListingModal = () => {
    setIsConfigureListingModal(false);
  };
  const openAdvanceSearchModal = () => {
    setIsAdvanceSearchModalOpen(true);
  };

  const closeAdvanceSearchModal = () => {
    setIsAdvanceSearchModalOpen(false);
  };
  const [searchValues, setSearchValues] = useState(
    fields.reduce((acc, field) => {
      acc[field.value] = "";
      return acc;
    }, {})
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  const toggleInputs = () => setShowInputs(!showInputs);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const getFieldValue = (item, fieldPath) => {
    const value = fieldPath
      .split(".")
      .reduce((obj, key) => (obj ? obj[key] : "-"), item);

    if (["status", "published"].some((field) => fieldPath.includes(field))) {
      return value === true ? "Active" : "Inactive";
    }

    return value === null || value === "" ? "-" : value;
  };
 
  const getVisiblePages = () => {
    let start = Math.max(0, currentPage - 2); // Shift range dynamically
    let end = Math.min(totalPages, start + 5); // Keep 5 pages visible

    // Adjust `start` if `end` reaches the last pages
    if (end - start < 5) {
      start = Math.max(0, end - 5);
    }
    return Array.from({ length: end - start }, (_, i) => start + i + 1);
  };

  const visiblePages = getVisiblePages();
  const handleSearchChange = (e, field) => {
    if (!e || !e.target || !field || !field.value) {
      return; // Safeguard in case e or field is undefined
    }

    const newSearchValues = { ...searchValues, [field.value]: e.target.value };
    setSearchValues(newSearchValues);

    const message = {};
    fields.forEach((f) => {
      if (newSearchValues[f.value]?.trim()) {
        message[f.value] = newSearchValues[f.value];
      }
    });
    dispatch(getFilterInputValue(message));
    console.log("Updated message object for API request:", message);
  };

  const filter = [
    { value: "50", sizePerPage: 50 },
    { value: "100", sizePerPage: 100 },
    { value: "150", sizePerPage: 150 },
    { value: "200", sizePerPage: 200 },
    { value: "Show All", sizePerPage: "all" },
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleOpenModal = (item) => {
    setModalData(item); // Set the item data for the modal
    setModalOpen(true); // Open the modal
  };
  

  let tapTimeout = null; // Store timeout reference
  let lastTapTime = 0; // Store the last tap time to handle double taps

  const handleTap = (item) => {
    const recordId = item.recordId;
    // dispatch(setMultipleEditRecoedId(recordId)); 
    const DOUBLE_TAP_DELAY = 300; // Milliseconds to detect double tap

    const now = Date.now(); // Get the current time

    if (tapTimeout) {
      // Clear the timeout if it's a double tap
      clearTimeout(tapTimeout);
      tapTimeout = null;
    }

    // Check if the difference between taps is less than the double tap delay
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (!selectedID.includes(recordId)) {
        dispatch(setMultipleEditRecoedId(recordId)); // Handle double tap action
      }
      // Navigate to the edit route
      router.push(`/cheil${editnewroutepath}`);
    } else {
     
      // Single tap - set a timeout to distinguish between single and double tap
      tapTimeout = setTimeout(() => {
        if (!selectedID.includes(recordId)) {
          dispatch(setMultipleEditRecoedId(recordId)); // Handle double tap action
        }
        handleOpenModal(item); // Handle single tap event
        tapTimeout = null; // Reset the timeout after handling single tap
      }, DOUBLE_TAP_DELAY);
    }

    lastTapTime = now; // Update the last tap time
  };
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [selectAll, setSelectAll] = useState(false); 
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("SelectedID:", selectedID);
    setSelectAll(selectedID.length === data.length && data.length > 0);
  }, [selectedID, data]);
  
  
  const handleCheckboxClick = (recordId) => {
    console.log("Clicked RecordID:", recordId); 
    dispatch(setMultipleEditRecoedId(recordId));
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      console.log("Deselecting all ID");
      dispatch(setMultipleEditRecoedId([])); 
    } else {
      const allIds = data.map((item) => item.recordId);
      dispatch(setMultipleEditRecoedId(allIds));
    }
  };
  
  

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(clearAllEditRecordIds());

  }
  const handleCloseEditModal = () => setEditModalOpen(false); // Close edit modal

  const [deleteId, setDeleteId] = useState();
  const elementId = useSelector((state) => state.tasks.deleteElementId);

  const handledelete = async () => {
    try {
      console.log("btn triggred");

      const headers = { Authorization: `Bearer ${token}` };
      console.log(elementId, "btn triggred");

      const body = {
        [deleteKeyField]: [{ recordId: elementId }], // Template literal without quotes
      };

      const response = await axios.post(
        `${api}/admin/${apiroutepath}/delete`,
        body,
        {
          headers,
        }
      );
      // console.log(response.data);
      if (response.data.message) {
        closeModal();
        toast.success("Data deleted successfully!!");
        dispatch(triggerDeleteSuccess());
      }
    } catch (error) {
      console.error("Error deleting the record:", error);
    }
  };

  const selectedMultipleID = useSelector(
    (state) => state.tasks.multipleEditRecordId
  );

  const handlemultipledelete = async () => {
    try {
      console.log("btn triggered");

      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        [deleteKeyField]: selectedMultipleID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/${apiroutepath}/delete`,
        body,
        {
          headers,
        }
      );

      if (response.data.message) {
        closeMultipleModal();
        toast.success("Data deleted successfully!!");
        dispatch(triggerDeleteSuccess());
        dispatch(clearDeleteElementId());
      }
    } catch (error) {
      console.error("Error deleting the record:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      console.log(token, "token url");

      const response = await axios.get(`${api}/admin/${apiroutepath}/export`, {
        headers,
      });

      const fileName = response.data.fileName;

      const fullUrl = `${api}${fileName}`;
      window.open(fullUrl, "_blank");
      toast.success("File downloaded successfully");
    } catch (err) {
      setError("Error fetching export URL");
    }
  };

  return (
    <div className="w-[100%] overflow-hidden flex flex-col px-2 gap-3 pb-5  h-[100%]">
      <Toaster />
      <div className="py-1 rounded-md flex flex-col justify-between items-center w-full">
      <div className="flex flex-row gap-1 w-full text-start py-2">
            <span className="text-xs font-bold">{breadscrums}</span>
          </div>
        <div className="flex flex-row gap-3 w-full justify-between items-center">
          
         <div className="flex flex-row gap-5  p-2 rounded-md">
        
          <div className="flex flex-row gap-2 items-center justify-center text-sm">
          <div className="flex flex-row gap-2 ">
            Showing
            <div className=" flex flex-row gap-2">
              <span className="  text-center flex bg-[#cc0001] rounded-sm text-white flex-row w-[25px] justify-center ">
                {startRecord}
              </span>
              -
              <span className="  flex flex-row w-[27px] bg-[#cc0001] rounded-sm text-white justify-center ">
                {endRecord}
              </span>
            </div>
            of {totalRecord} Entries
          </div>
          <TextField
          variant="standard"
            className="w-[55px] text-sm"
            size="small"
            id="outlined-select-currency-native"
            select
            value={sizePerPage === "all" ? "Show All" : sizePerPage.toString()}
            onChange={onSizeChange}
          >
            {filter.map((option) => (
              <MenuItem
                key={option.value}
                value={option.sizePerPage.toString()}
                className="text-sm"
              >
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
            {totalPages > 0 && (
              <div className="flex space-x-2  justify-start items-center p-2 rounded-md">
                {/* Double arrow button to go to the first page */}
                <div
                  onClick={() => onPageChange(0)}
                  disabled={currentPage === 0}
                  className="w-[25px] py-0.5 rounded text-center cursor-pointer bg-[#D3D3D3] items-center justify-center flex flex-row text-gray-700 text-sm"
                >
                  <MdOutlineKeyboardDoubleArrowLeft className="text-lg" />
                </div>

                {/* Single arrow button to go to the previous page */}
                <div
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="w-[25px] py-0.5 rounded text-center cursor-pointer bg-[#D3D3D3] items-center justify-center flex flex-row text-gray-700 text-sm"
                >
                  <MdOutlineKeyboardArrowLeft className="text-lg" />
                </div>

                {/* Render visible page numbers dynamically */}
                {visiblePages.map((pageNum) => (
                  <div
                    key={pageNum}
                    className={`w-[25px] py-0.5 rounded ${
                      pageNum - 1 === currentPage
                        ? "bg-[#cc0001] text-white text-center cursor-pointer"
                        : "bg-[#D3D3D3] text-gray-700 text-center cursor-pointer"
                    } text-sm`}
                    onClick={() => onPageChange(pageNum - 1)}
                  >
                    {pageNum}
                  </div>
                ))}

                {/* Single arrow button to go to the next page */}
                <div
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="w-[25px] py-0.5 rounded text-center cursor-pointer bg-[#D3D3D3] items-center justify-center flex flex-row text-gray-700 text-sm"
                >
                  <MdOutlineKeyboardArrowRight className="text-lg" />
                </div>

                {/* Double arrow button to go to the last page */}
                <div
                  onClick={() => onPageChange(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                  className="w-[25px] py-0.5 rounded text-center cursor-pointer bg-[#D3D3D3] items-center justify-center flex flex-row text-gray-700 text-sm"
                >
                  <MdOutlineKeyboardDoubleArrowRight className="text-lg" />
                </div>
              </div>
            )}
          </div>
         </div>
          <div className="flex flex-row  items-center">
          <div
            className="flex flex-row   "
            onClick={() => setIsConfigureListingModal(true)}
          >
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14], // Adjust tooltip position
                      },
                    },
                  ],
                },
              }}
              title="Configure"
            >
              <IconButton>
                <GrConfigure className="text-white bg-[#1C61A7] p-1.5 rounded-md text-3xl" />
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="flex flex-row   "
            onClick={() => openAdvanceSearchModal()}
          >
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14], // Adjust tooltip position
                      },
                    },
                  ],
                },
              }}
              title="Advanced Search"
            >
              <IconButton>
                <FaSearchPlus className="text-white bg-[#1C61A7] p-1.5 rounded-md text-3xl" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="flex flex-row ">
            {!skipmultipleedit.includes(apiroutepath) ? (
              // If not in skipmultipleedit, enable the edit button and check for selected items
              selectedID.length >= 1 ? (
                <div
                  onClick={() => {
                    router.push(`/cheil${editnewroutepath}`);
                  }}
                >
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
                    title="Edit"
                  >
                    <IconButton>
                      <MdOutlineEdit className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl " />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : (
                <div
                  onClick={() => {
                    toast.error("Select atleast one element to edit");
                  }}
                >
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
                    title="Edit"
                  >
                    <IconButton>
                      <MdOutlineEdit className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl " />
                    </IconButton>
                  </Tooltip>
                </div>
              )
            ) : (
              // If apiroutepath is in skipmultipleedit, show a disabled button
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
                title={`Multiple edit is disabled for ${cuurentpagemodelname}`}
              >
                <span>
                  <IconButton disabled>
                    <MdOutlineEdit
                      style={{
                        cursor: "not-allowed",
                      }}
                      className="text-white  bg-gray-400 p-1.5 rounded-md text-3xl "
                    />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </div>
          <div className="flex flex-row ">
            {selectedMultipleID.length >= 1 ? (
              <div
                onClick={() => {
                  openMultipleModal(); // Open the delete confirmation modal
                }}
              >
                <Tooltip
                  arrow
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14], // Adjust tooltip position
                          },
                        },
                      ],
                    },
                  }}
                  title="Delete"
                >
                  <IconButton>
                    <MdDelete className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl" />
                  </IconButton>
                </Tooltip>
              </div>
            ) : (
              <div
                onClick={() => {
                  toast.error("Select atleast one element to delete"); // Show error if no item is selected
                }}
              >
                <Tooltip
                  arrow
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14], // Adjust tooltip position
                          },
                        },
                      ],
                    },
                  }}
                  title="Delete"
                >
                  <IconButton>
                    <MdDelete className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
          <div
            onClick={() => {
              router.push(`/cheil${addnewroutepath}`);
            }}
            className=""
          >
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14], // Adjust tooltip position
                      },
                    },
                  ],
                },
              }}
              title="Add New"
            >
              <IconButton>
                <FaPlus className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl" />
              </IconButton>
            </Tooltip>
          </div>
          <div
            className=""
            onClick={() => {
              openExportModal();
            }}
          >
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14], // Adjust tooltip position
                      },
                    },
                  ],
                },
              }}
              title="Export"
            >
              <IconButton>
                <MdFileUpload className="text-white bg-[#000] p-1.5 rounded-md text-3xl" />
              </IconButton>
            </Tooltip>
          </div>

          <div onClick={handleDownload} className="">
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14], // Adjust tooltip position
                      },
                    },
                  ],
                },
              }}
              title="Template"
            >
              <IconButton>
                <TbTemplate className="text-white bg-[#000] p-1.5 rounded-md text-3xl" />
              </IconButton>
            </Tooltip>
          </div>
          <div
            onClick={() => {
              setShowUploadModal(true);
            }}
            // href="/cheil/admin/trgmapping/add-mapping"
            className=""
          >
            <Tooltip
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14], // Adjust tooltip position
                      },
                    },
                  ],
                },
              }}
              title="Upload"
            >
              <IconButton>
                <IoMdCloudUpload className="text-white bg-[#000] p-1.5 rounded-md text-3xl" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        </div>
        
      </div>


      {/* Search bar and inputs */}
      <div className="bg-white  rounded-md ">
        <div className="gap-3 flex flex-col  rounded-md   overflow-y-auto">
          <div
            style={{ backgroundColor: "#D3D3D3" }}
            className=" rounded-md shadow w-full pl-4 pr-4"
          >
            <div className="flex items-center w-full flex-row">
              <div className="flex flex-row w-full">
              <div className="flex items-center gap-2 text-sm w-[5%]">
              <input
        type="checkbox"
        checked={selectAll}
        onChange={handleSelectAll}
      />{' '}
        {/* <span>Select All</span> */}
      </div>

                {!showInputs ? (
                  <div className="w-[90%] flex flex-row  justify-between items-center pt-2.5 pb-2.5">
                     {configureListingPageModal.length > 1
                      ? configureListingPageModal.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-1 text-sm "
                            style={{
                              width: `${
                                100 / configureListingPageModal.length
                              }%`, // Dynamically calculate width
                            }}
                          >
                            <span>{item.label}</span>
                          </div>
                        ))
                      : fields.map((field, index) => (
                        <div
                          key={index}
                          className="flex  items-center gap-2  p-1 text-sm w-[25%] "
                        >
                          <span>{field.label}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-row w-full  justify-between items-start pt-2.5 pb-2.5">
                    {configureListingPageModal.length > 1
                      ? configureListingPageModal.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm "
                            style={{
                              width: `${
                                100 / configureListingPageModal.length
                              }%`, // Dynamically calculate width
                            }}
                          >
                            <input
                              placeholder={`Search ${item.label}`}
                              value={searchValues[item.value] || ""}
                              onChange={(e) => handleSearchChange(e, item)}
                              className="input-class text-sm flex items-start justify-start p-1"
                            />
                          </div>
                        ))
                      : fields.map((field, index) => (
                        <div
                          key={index}
                          className="flex  items-center gap-2 text-sm w-[25%]"
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
                <div className="flex flex-row items-center justify-end  gap-2 text-sm w-[5%]">
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
            className=" p-4 max-h-[490px] min-h-[490px] rounded-md overflow-y-scroll"
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
                {data.length < 1 ? (
                  <div className="text-center text-gray-500 text-sm">
                    No data found
                  </div>
                ) : (
                  data.map((item, index) => (
                    <div
                      key={index}
                      className="flex  items-center text-gray-600 text-xs w-full "
                    >
                               <div className="flex items-center gap-2 text-sm w-[5%]">
                               <input
              type="checkbox"
              checked={selectedID.includes(item.recordId)}
              onChange={() => handleCheckboxClick(item.recordId)}
            />
          </div>


                      <div
                        className="flex w-[90%]  justify-between cursor-pointer"
                        onClick={() => {handleTap(item);
                          // dispatch(setMultipleEditRecoedId(item.recordId)); 
                        }}
                      >
                        {configureListingPageModal.length > 1
                          ? configureListingPageModal.map((modalItem, idx) => (
                              <div
                                key={idx}
                                className="flex text-center pl-1 flex-row  overflow-hidden text-ellipsis whitespace-nowrap"
                                style={{
                                  width: `${
                                    90 / configureListingPageModal.length
                                  }%`, // Dynamically calculate width
                                }}
                              >
                               <span>
        {(() => {
          const value = getFieldValue(item, modalItem.value);
          if (typeof value === "boolean") {
            return value ? "True" : "False";
          }
          if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === "object") {
              // Array of objects (e.g., sourceTargetParamMappings)
              return value
                .map((entry) => entry?.identifier)  // Get the 'identifier' value
                .filter((identifier) => identifier !== null && identifier !== "-") // Exclude null and empty values
                .join(", ");
            } else {
              // Simple array (e.g., subsidiaries)
              return value.join(", ");
            }
          } else {
            // Single value
            return value || "-";
          }
        })()}
      </span>
                              </div>
                            ))
                          : fields.map((field, idx) => (
                              <div
                                key={idx}
                                className="flex text-center pl-1 flex-row w-[23%] overflow-hidden text-ellipsis whitespace-nowrap"
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
                        className="gap-3 w-[5%] flex flex-row "
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
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        
      </div>

     
        <DetailsSideModal
          open={modalOpen}
          handleClose={handleCloseModal}
          data={modalData}
          cuurentpagemodelname={cuurentpagemodelname}
          editnewroutepath={editnewroutepath}
        />

        <AdminEditButton
          EditModal={editModalOpen}
          data={data}
          handleCloseEdit={handleCloseEditModal}
        />
        <AreUSurepage
          handleclick={handledelete}
          aresuremodaltype={aresuremodaltype}
          aresuremodal={aresuremodal}
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
         <AreUSurepage
          handleclick={handlemultipledelete}
          aresuremodaltype={aresuremodaltype}
          aresuremodal={aresuremodal}
          isOpen={isMultipleModalOpen}
          setIsModalOpen={setIsMultipleModalOpen}
        />
        <AdvanceSearch
          isOpen={isAdvanceSearchModalOpen}
          handleClose={closeAdvanceSearchModal}
          deleteKeyField={deleteKeyField}
          apiroutepath={apiroutepath}

        />
        <ExportDownloadModal
          // handleclick={handleclick}
          exportDownloadContent={exportDownloadContent}
          handleClose={closeExportModal}
          isOpen={isExportModalOpen}
          setIsModalOpen={setIsExportModalOpen}
        />
        <ConfigureListingPages
          apiroutepath={apiroutepath}
          handleClose={closeConfigureListingModal}
          isconfigureOpen={isConfigureListingModal}
          setIsconfigureModalOpen={setIsConfigureListingModal}
        />
        <UploadModal
          routepath={apiroutepath}
          isOpen={showUploadModal}
          setIsModalOpen={setShowUploadModal}
        />
      
    </div>
  );
};

export default Listingpage4cols;
