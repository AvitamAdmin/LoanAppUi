import React, { useEffect, useState } from "react";
import {  MdFileUpload} from "react-icons/md";
import Lottie from "react-lottie";
import * as animationData from "../../../../assests/LoadingAnimation.json";
import { useDispatch, useSelector } from "react-redux";
import { getFilterInputValue,
  setMultipleEditRecoedId,
} from "../../Redux/Slice/slice";
import { getCookie } from "cookies-next";
import axios from "axios";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Listingpageforeppsso = ({
  fields,
  data,
  loading,
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

    if (["ssoLink"].some((field) => fieldPath.includes(field))) {
      return <a href={value} target="_blank" style={{color:'blue'}}>SSO Link</a>;
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

          <div
            className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-white gap-1 "
            onClick={()=>{}}
          >
            <MdFileUpload className="text-gray-500 " />
            <span className="text-gray-500 text-xs">Export</span>
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
              <div className="space-y-2 max-w-full ">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-black-600 text-xs w-full "
                  >
                    <div
                      className="flex justify-between cursor-pointer"
                    >
                      {fields.map((field, idx) => (
                        <div
                          key={idx}
                          className="w-[20%] flex justify-between overflow-hidden text-ellipsis"
                          style={{ flex: "1"}}
                        >
                          <span>{getFieldValue(item, field.value)}</span>
                        </div>
                      ))}
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

export default Listingpageforeppsso;
