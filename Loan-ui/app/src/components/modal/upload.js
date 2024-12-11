import React, { useEffect, useState, useRef } from "react";
import { Modal } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { getCookie } from "cookies-next";
import axios from "axios";
import { api } from "@/envfile/api";
import Lottie from "react-lottie";
import * as animationData from "../../../../assests/uploadaminamtion.json";
import { triggerDeleteSuccess } from "../../Redux/Slice/slice";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const UploadModal = ({ isOpen, setIsModalOpen, routepath }) => {
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
  const [token, setToken] = useState("");
  const [errorname, setErrorname] = useState("");
  const errorMsg = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  // console.log(routepath, "routepath routepath");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        console.error("No file selected.");
        return;
      }

      // Validate file format (allow CSV, XLSX, PDF, JPEG, PNG)
      const allowedFormats = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // XLSX format
      ];

      if (!allowedFormats.includes(selectedFile.type)) {
        console.error("Unsupported file format.");
        // toast.error("Unsupported file format.");
        return;
      }

      // Create a FormData object
      const formData = new FormData();
      formData.append("file", selectedFile); // 'file' should match your backend's expected form field name

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      console.log(token, "token");
      console.log(selectedFile, "selectedFile");

      // Make the POST request
      const response = await axios.post(
        `${api}/admin/${routepath}/upload`,
        formData,
        {
          headers,
        }
      );
      await setIsModalOpen(false);
      dispatch(triggerDeleteSuccess());
      const fileName = response.data;

      console.log(response.data.success);
      if(!response.data.success){
          errorMsg.current = "Import failed : ";
      } else{
        errorMsg.current = '';
      }
    

      const message = errorMsg.current + response.data.message;
      toast((t) => (
        <div
        style={{ 
          wordBreak: 'break-word', 
        }}
        >
        <span>
           {message}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <div style={{
            backgroundColor: "#ff6363", 
            color: "white",
            padding: "8px 12px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            
          }} onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </div>
          </div>  
        </span>
        </div>
      ), { duration: Infinity });

      console.log(fileName, "File uploaded successfully");
    } catch (err) {
      console.error("Error uploading the file", err);
      // toast.error("Error uploading the file. Please try again.");
    }
  };


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <div className="flex flex-col w-[100%] justify-center items-center min-h-screen backdrop-blur-sm">
        <div className="bg-transparent w-[35%] flex flex-col justify-start items-center bg-white rounded-md gap-4 h-96">
          <div className="bg-black w-full flex flex-row justify-between items-center rounded-md p-2">
            <span className="font-bold text-md text-white">Upload File</span>
            <div onClick={closeModal} className="cursor-pointer">
              <IoClose className="text-white text-xl" />
            </div>
          </div>

          <div className="w-[80%] border border-dashed mt-3 border-gray-500 flex flex-col justify-center items-center p-5 rounded-lg">
            <div className="h-52 p-2 flex flex-col gap-5">
              <div className="relative w-full justify-center items-center">
                <div className="items-center p-5 z-50 ">

                  <input
                    type="file"
                    accept="application/pdf, image/jpeg, image/png, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="border rounded-md w-full h-40 opacity-0"
                    onChange={handleFileChange}
                  />

                </div>

                {/* Display overlay text */}
                <div className="absolute top-2 w-full bg-transparent justify-center flex-col items-center flex pointer-events-none">
                  
                  <Lottie options={defaultOptions} height={140} width={100} />
                  <div>Upload files here</div>

                  {selectedFile && (
                    <div className="flex flex-row gap-5 items-center justify-center mt-1">
                      <div className="text-sm text-gray-500">
                        {selectedFile.name}
                      </div>
                    </div>
                  )}
                  {errorname && <div className="text-sm text-red-600 ">{errorname}</div>}

                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full justify-end gap-3 p-2">
            <div
              onClick={() => setSelectedFile(null)}
              className={`${selectedFile ? "cursor-pointer bg-white" : "cursor-not-allowed bg-gray-300"
                } text-gray-800 border-2 border-gray-200 rounded-md p-1 text-md w-[100px] text-center`}
              style={{ pointerEvents: selectedFile ? "auto" : "none" }} // Disable click if no file
            >
              Clear
            </div>

            <div
              onClick={closeModal}
              className="bg-white cursor-pointer text-gray-800 border-2 border-gray-200 rounded-md p-1 text-md w-[100px] text-center"
            >
              Cancel
            </div>
            <div
              onClick={handleFileUpload}
              ref={errorMsg}
              className="bg-red-500 cursor-pointer rounded-md text-center text-md text-white p-1 w-[100px]"
            >
              Upload
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
