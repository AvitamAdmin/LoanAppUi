"use client";
import React, { useState, useEffect } from "react";
import { FaMinus } from "react-icons/fa";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import SelectCategory from "@/app/src/components/dropdown/Category";
import Models from "@/app/src/components/dropdown/Models";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import toast, { Toaster } from "react-hot-toast";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";

const Addvariant = () => {
  const [ButtonActive, setButtonActive] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };


  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        loanScoreDtos: [
          {
            name: formValues.name,
            description: formValues.description,
            status: ButtonActive,
          },
        ],
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/loans/loanScoreResult/edit`, body, {
        headers,
      });
      console.log(response.data, "response from api");
      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/loans/loanScoreResult");
        }, 2000);
      } else if (response.data.success === false) {
        // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      setError("Error fetching loanScoreResult data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Loans > loanScoreResult";
  const pagename = "Add New";

  
  const [addnewpagebtn, setaddnewpagebtn] = useState(true);
  return (
    <AddNewPageButtons
      pagename={pagename}
      setshow={addnewpagebtn}
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
            <div className="grid grid-cols-2 gap-4 mb-4 items-center justify-center  flex-col">
              <TextField
                label="Enter Name"
                variant="standard"
                fullWidth
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />

              <TextField
                label="Enter Description"
                variant="standard"
                fullWidth
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
              />

             
            </div>

         


            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
                {ButtonActive == true ? (
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

export default Addvariant;
