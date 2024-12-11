import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import * as animationData from "../../../../assests/LoadingAnimation.json";
import { IoClose, IoSearch } from "react-icons/io5";
import { useDispatch} from "react-redux";
import {getFilterInputValue,} from "../../Redux/Slice/slice";
import { getCookie } from "cookies-next";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Listingpageforfind = ({
    fields,
    data,
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
    //     // Prepare the worksheet data
    //     console.log("hii");
    //     const worksheetData = data.map((item) => {
    //         const row = {};
    //         fields.forEach((field) => {
    //             row[field.label] = getFieldValue(item, field.value);
    //         });
    //         return row;
    //     });

    //     // Create a worksheet and a workbook
    //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    //     // Get the range of the worksheet
    //     const range = XLSX.utils.decode_range(worksheet["!ref"]);

    //     // Apply bold styling to headers
    //     for (let C = range.s.c; C <= range.e.c; ++C) {
    //         const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Get the header cell address
    //         if (worksheet[cellAddress]) {
    //             worksheet[cellAddress].s = {
    //                 font: { bold: true }, // Apply bold font style
    //             };
    //         }
    //     }

    //     // Convert the workbook to binary and create a downloadable link
    //     const excelBuffer = XLSX.write(workbook, {
    //         bookType: "xlsx",
    //         type: "array",
    //         cellStyles: true,
    //     });
    //     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    //     // Download the file
    //     const downloadLink = document.createElement("a");
    //     downloadLink.href = URL.createObjectURL(blob);
    //     downloadLink.download = `data.xlsx`;
    //     downloadLink.click();
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


    return (
        <div className="w-[100%] overflow-hidden flex flex-col px-2 gap-3 pb-5  h-[100%]">
            <Toaster />
            

            {/* Search bar and inputs */}
            <div className="bg-white  rounded-md ">
                <div className="gap-3 flex flex-col  rounded-md   overflow-y-auto">
                    <div
                        style={{ backgroundColor: "#D3D3D3" }}
                        className=" rounded-md shadow pl-4 pr-4"
                    >
                        <div className="flex items-center flex-row">
                            <div className="flex flex-row w-full">
                               
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

                                        <div
                                            className="flex w-[90%] justify-between cursor-pointer"

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

export default Listingpageforfind;
