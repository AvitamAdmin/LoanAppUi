"use client";
import React, { useState, useRef, useEffect } from "react";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/uploadaminamtion.json";
import toast, { Toaster } from "react-hot-toast";

const Addmedia = () => {
  const [params, setParams] = useState([]);
  const fileInputRef = useRef(null);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    identifier: "",
  });
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
    }
  }, []);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  const handleSaveClick = async () => {
    if (!selectedFile) {
      console.error("No file selected!");
      return;
    }

    // Validate file format (allow CSV, XLSX, PDF, JPEG, PNG)
    const allowedFormats = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX format
    ];

    if (!allowedFormats.includes(selectedFile.type)) {
      console.error("Unsupported file format.");
      // toast.error("Unsupported file format."); // Optional user notification
      return;
    }

    try {
      setLoading(true); // Start loading state

      // Create a FormData object
      const formData = new FormData();
      formData.append("file", selectedFile); // Ensure 'file' matches backend's field name

      const headers = {
        Authorization: `Bearer ${token}`, // Token for authorization
        "Content-Type": "multipart/form-data",
      };

      console.log(token, "token");
      console.log(selectedFile, "selectedFile");

      // Make the POST request
      const response = await axios.post(`${api}/admin/media/edit`, formData, {
        headers,
      });

      console.log(response.data, "response from API");

      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/data/media");
        }, 2000);
      } else if (response.data.success === false) {
        // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      console.error("Error uploading media:", err);
      setError("Error fetching media data"); // Optional: Display user-friendly error
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const breadscrums = "Admin > media";
  const pagename = "Add New";
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
    >
      <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <Toaster />
        <div className="flex flex-col bg-gray-200 ">
          <div className="bg-white relative flex flex-col gap-5  rounded-md shadow-md">
            <div className="flex flex-col w-full gap-4  items-center justify-center  h-44">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <div
                className="flex items-center justify-center mt-4 p-2 rounded-md bg-transparent text-white w-[100%] h-full"
                onClick={handleFileInputClick}
              >
                Choose file
              </div>
            </div>
            <div className="absolute  w-full h-44 rounded-md bg-gray-300 justify-center flex-col items-center flex pointer-events-none">
              <Lottie options={defaultOptions} height={140} width={100} />
              <div>Upload files here</div>

              {/* {errorname && <div className="text-sm text-red-600 ">{errorname}</div>} */}
            </div>
          </div>
          {selectedFile && (
            <div className="flex flex-row gap-5 min-h-16  items-center justify-center mt-1">
              <div className="text-sm text-gray-500">{selectedFile.name}</div>
            </div>
          )}
          <div className="w-full flex flex-row justify-end mt-5">
            <div
              onClick={() => setSelectedFile(null)}
              className={`${
                selectedFile
                  ? "cursor-pointer bg-white"
                  : "cursor-not-allowed bg-gray-300"
              } text-gray-800 border-2 border-gray-200 rounded-md p-1 text-md w-[100px] text-center cursor-pointer`}
              style={{ pointerEvents: selectedFile ? "auto" : "none" }} // Disable click if no file
            >
              Clear
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default Addmedia;
