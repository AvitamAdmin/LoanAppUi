"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";

import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import toast, { Toaster } from "react-hot-toast";

const AddloanType = () => {
  const [ButtonActive, setButtonActive] = useState(false);

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [initialload, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
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
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  const validateForm = () => {
    let newErrors = {};
  
    if (!formValues.name) {
      newErrors.name = "Name is required.";
    }
    if (!formValues.description) {
      newErrors.description = "Description is required.";
    }
  
    setErrors(newErrors);
  
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveClick = async () => {
    console.log("Button triggered");
  
    // Validate form and exit if invalid
    if (!validateForm()) return;
  
    try {
      setLoading(true); // Indicate loading state
  
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        loanTypeDtoList: [
          {
            name: formValues.name,
            description: formValues.description,
            status: ButtonActive,
          },
        ],
      };
  
      console.log(body, "Request body from user");
      console.log(token, "Token");
  
      const response = await axios.post(`${api}/loans/loanType/edit`, body, { headers });
      console.log(response.data, "Response from API");
  
      if (response.data.success) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/loans/loanType");
        }, 2000);
      } else {
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      console.error("Error saving loan type:", err);
      toast.error("An error occurred while saving the loan type.", { className: "text-sm" });
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  

  const breadscrums = "Admin > loanType";
  const pagename = "Add New";
  const [addnewpagebtn, setaddnewpagebtn] = useState(true);
  return (
    <AddNewPageButtons
      setshow={addnewpagebtn}
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
    >
      <Toaster />
      <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="flex flex-col bg-gray-200 rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md w-full">
            <div className=" grid-cols-3 gap-4 mb-4 items-center w-full justify-between flex flex-row">
              <TextField
                className="w-[100%] mt-5"
                label="Enter Name"
                variant="standard"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                className="w-[100%] mt-5"
                label="Description"
                variant="standard"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
              />

            
            </div>

          

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
                {ButtonActive ? (
                  <div
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#1581ed] text-center cursor-pointer  border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Active
                  </div>
                ) : (
                  <div
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#fff] border-2 border-solid border-gray-400 text-center cursor-pointer rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Inactive
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default AddloanType;
