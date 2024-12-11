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

const AddloanStatus = () => {
  const [ButtonActive, setButtonActive] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [initialload, setInitialLoad] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const [formValues, setFormValues] = useState({});

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
      newErrors.identifier = "Name is required.";
    }
   

    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 0 
    );
  };
  const handleSaveClick = async () => {
    if (!validateForm()) return; // Stop execution if form is invalid
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        loanStatusDtos: [
          {
            name: formValues.name,
            status: ButtonActive,
          },
        ],
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/loans/loanStatus/edit`, body, {
        headers,
      });
      console.log(response.data, "response from api");
      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/loans/loanStatus");
        }, 2000);
      } else if (response.data.success === false) {
        // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      setError("Error fetching loanStatus data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > loanStatus";
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
      <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <Toaster />
        <div className="flex flex-col bg-gray-200  rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-1 gap-4 mb-4 items-center justify-center  flex-col">
              <TextField
                label="Enter Name"
                variant="standard"
                fullWidth
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
             
            
            </div>

            

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
                {ButtonActive ? (
                  <div
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#1581ed]   border-2 border-solid border-gray-400 text-center cursor-pointer rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse"
                  >
                    Active
                  </div>
                ) : (
                  <div
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#fff] border-2 border-solid border-[#1581ed] text-center cursor-pointer rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse"
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

export default AddloanStatus;
