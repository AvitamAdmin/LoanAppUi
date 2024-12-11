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

const Listingpageformedia = ({
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
    breadscrums,
    loading,
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
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isMultipleModalOpen, setIsMultipleModalOpen] = useState(false);
    const [token, setToken] = useState("");
    const [showUploadModal, setShowUploadModal] = useState(false);
    // Calculate the range of visible page numbers
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
    const [searchValues, setSearchValues] = useState(
        fields.reduce((acc, field) => {
            acc[field.value] = "";
            return acc;
        }, {})
    );

    const [editModalOpen, setEditModalOpen] = useState(false);


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
    // const handleExport = () => {
    //     console.log("hii");
    //     const worksheetData = data.map((item) => {
    //         const row = {};
    //         fields.forEach((field) => {
    //             row[field.label] = getFieldValue(item, field.value);
    //         });
    //         return row;
    //     });

    //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    //     const range = XLSX.utils.decode_range(worksheet["!ref"]);

    //     for (let C = range.s.c; C <= range.e.c; ++C) {
    //         const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    //         if (worksheet[cellAddress]) {
    //             worksheet[cellAddress].s = {
    //                 font: { bold: true },
    //             };
    //         }
    //     }

    //     const excelBuffer = XLSX.write(workbook, {
    //         bookType: "xlsx",
    //         type: "array",
    //         cellStyles: true,
    //     });
    //     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    //     const downloadLink = document.createElement("a");
    //     downloadLink.href = URL.createObjectURL(blob);
    //     downloadLink.download = `${breadscrums}.xlsx`;
    //     downloadLink.click();
    //     toast.success("File downloaded successfully");
    // };

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
            <div className="p-1 rounded-md flex flex-row justify-between items-center w-full">
                <div className="flex flex-row gap-3 justify-center items-center">
                    <div className="flex flex-row gap-1">
                        <span className="text-xs font-bold">{breadscrums}</span>
                    </div>
                    <div>
                        {totalPages > 0 && (
                            <div className="flex space-x-3 bg-[#D3D3D3] justify-start items-center p-2 rounded-md">
                                {/* Double arrow button to go to the first page */}
                                <div
                                    onClick={() => onPageChange(0)}
                                    disabled={currentPage === 0}
                                    className="w-[25px] text-center cursor-pointer py-0.5 rounded bg-white items-center justify-center flex flex-row text-gray-700 text-sm"
                                >
                                    <MdOutlineKeyboardDoubleArrowLeft className="text-lg" />

                                </div>

                                {/* Single arrow button to go to the previous page */}
                                <div
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="w-[25px] py-0.5 text-center cursor-pointer rounded bg-white items-center justify-center flex flex-row text-gray-700 text-sm"
                                >
                                    <MdOutlineKeyboardArrowLeft className="text-lg" />

                                </div>

                                {/* Render visible page numbers dynamically */}
                                {visiblePages.map((pageNum) => (
                                    <div
                                        key={pageNum}
                                        className={`w-[25px] py-0.5 rounded ${pageNum - 1 === currentPage
                                                ? "bg-[#cc0001] text-white text-center cursor-pointer"
                                                : "bg-white text-gray-700 text-center cursor-pointer"
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
                                    className="w-[25px] py-0.5 text-center cursor-pointer rounded bg-white items-center justify-center flex flex-row text-gray-700 text-sm"
                                >
                                    <MdOutlineKeyboardArrowRight className="text-lg" />

                                </div>

                                {/* Double arrow button to go to the last page */}
                                <div
                                    onClick={() => onPageChange(totalPages - 1)}
                                    disabled={currentPage === totalPages - 1}
                                    className="w-[25px] py-0.5 text-center cursor-pointer rounded bg-white items-center justify-center flex flex-row text-gray-700 text-sm"
                                >
                                    <MdOutlineKeyboardDoubleArrowRight className="text-lg" />

                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <div className="flex flex-row gap-3 items-center">
                    <div className="flex flex-row">

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
                                        <MdDelete className="text-white bg-[#CC0001] -z-10 p-1.5 rounded-md text-3xl" />
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
                                        <MdDelete className="text-white bg-[#CC0001] -z-10 p-1.5 rounded-md text-3xl" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )}

                    </div>
                    <div
                        className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-white gap-1"
                        onClick={() => {
                            openExportModal();
                        }}
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
                                        {fields.map((field, index) => (
                                            <div
                                                key={index}
                                                className="flex  items-center gap-2  p-1 text-sm w-[33%] "
                                            >
                                                <span>{field.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-row w-full  justify-between items-start pt-2.5 pb-2.5">
                                        {fields.map((field, index) => (
                                            <div
                                                key={index}
                                                className="flex  items-center gap-2 text-sm w-[33%]"
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
                                {data.length < 1 ? (
                                    <div className="text-center text-gray-500 text-sm">
                                        No data found
                                    </div>
                                ) : (
                                    data.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center text-gray-600 text-xs w-full "
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
                                                onClick={() => {
                                                    handleTap(item);
                                                    // dispatch(setMultipleEditRecoedId(item.recordId)); 
                                                }}
                                            >
                                                {fields.map((field, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex text-center pl-1 flex-row w-[31%] overflow-hidden text-ellipsis whitespace-nowrap"
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

            {/* Pagination controls */}
            <div
                style={{ backgroundColor: "#D3D3D3" }}
                className=" p-2 rounded-lg w-full flex justify-between items-center px-2"
            >
                <div className="flex flex-row gap-3 items-center justify-center text-sm">
                    <div className="flex flex-row gap-2">
                        Showing
                        <div className=" flex flex-row gap-2">
                            <span className="  text-center flex bg-[#cc0001] rounded-sm text-white flex-row w-[25px] justify-center ">
                                {startRecord}
                            </span>
                            -
                            <span className="  flex flex-row w-[25px] bg-[#cc0001] rounded-sm text-white justify-center ">
                                {endRecord}
                            </span>
                        </div>
                        of {totalRecord} Entries
                    </div>
                    <TextField
                        className="w-28 text-sm"
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
                <ExportDownloadModal
          // handleclick={handleclick}
          exportDownloadContent={exportDownloadContent}
          handleClose={closeExportModal}
          isOpen={isExportModalOpen}
          setIsModalOpen={setIsExportModalOpen}
        />





            </div>
        </div>
    );
};

export default Listingpageformedia;
