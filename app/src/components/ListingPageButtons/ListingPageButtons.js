import { MenuItem, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";

function ListingPageButtons({
  children,
  handleSizeChange,
  sizePerPage,
  count,
  setCount,
  totalRecord,
  pageNumbers,
}) {
  const router = useRouter();

  const currentPath = router.pathname;
  const breadcrumbName = breadcrumbMap[currentPath] || "Dashboard"; // Fallback

  const filter = [
    { value: "50", sizePerPage: 50 },
    { value: "100", sizePerPage: 100 },
    { value: "150", sizePerPage: 150 },
    { value: "200", sizePerPage: 200 },
    { value: "Show All", sizePerPage: "all" },
  ];

  // Calculate the start and end record for the current page
  const startRecord = count * sizePerPage + 1;
  const endRecord =
    sizePerPage === "all"
      ? totalRecord
      : Math.min(totalRecord, (count + 1) * sizePerPage);

  useEffect(() => {
    // Update the current page when the size per page changes
    setCount(0); // Reset to the first page
  }, [sizePerPage]);

  return (
    <div className="w-full flex flex-col ">
      <div className="p-1 rounded-md flex flex-row justify-between items-center w-full">
        <div className="flex flex-row gap-1">
          <span className="text-xs font-bold">Admin</span>
          <span className="text-xs font-bold">{">"}</span>
          <span className="text-xs font-bold">{breadcrumbName}</span>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div>
            <Image
              src={require("../../../../assests/Edit.png")}
              width={32}
              height={32}
              alt="Edit"
            />
          </div>
          <div>
            <Image
              src={require("../../../../assests/Delete.png")}
              width={32}
              height={32}
              alt="Delete"
            />
          </div>
          <Link className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-white gap-1">
            <MdFileUpload className="text-gray-500" />
            <span className="text-gray-500 text-xs">Export</span>
          </Link>
          <Link
            href="/cheil/admin/toolkitCronjobs"
            className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-[#CC0001] gap-1"
          >
            <FaPlus className="text-white" />
            <span className="text-white text-xs">Add New</span>
          </Link>
          <Link
            // href="/cheil/admin/trgmapping/add-mapping"
            className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-[#2b2b2b] gap-1"
          >
            <span className="text-white text-xs">Template</span>
          </Link>
          <Link
            // href="/cheil/admin/trgmapping/add-mapping"
            className="flex flex-row p-2 border-2 border-gray-400 text-center cursor-pointer items-center rounded-md bg-[#2b2b2b] gap-1"
          >
            <span className="text-white text-xs">Upload</span>
          </Link>
        </div>
      </div>

      {children}

      <div className="bg-white p-2 rounded-lg w-[100%] flex justify-between items-center px-2">
        <div className="flex flex-row text-xs items-center w-full gap-3">
          <div>
            <p>
              Showing {startRecord} - {endRecord} of {totalRecord} Entries
            </p>
          </div>

          <TextField
            className="w-28"
            size="small"
            id="outlined-select-currency-native"
            select
            value={sizePerPage === "all" ? "Show All" : sizePerPage.toString()}
            onChange={handleSizeChange}
          >
            {filter.map((option) => (
              <MenuItem
                key={option.value}
                value={option.sizePerPage.toString()}
              >
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="flex justify-center mt-4 space-x-3">
          {pageNumbers.map((pageNum) => (
            <div
              key={pageNum}
              className={`px-3 py-1 rounded ${
                pageNum - 1 === count
                  ? "bg-[#cc0001] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setCount(pageNum - 1);
                console.log(pageNum, "page number");
              }}
            >
              {pageNum}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListingPageButtons;
