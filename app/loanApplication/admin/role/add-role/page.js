"use client";
import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Autocomplete, TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";

const AddRole = () => {
  const [token, setToken] = useState("");
  const [ButtonActive, setButtonActive] = useState(false);
  const [EnableGenerator, setenableGenerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [params, setParams] = useState([]);

  const [formValues, setFormValues] = useState({
    identifier: "",
    name: "",
  });
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);



  // Handle change for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const [formErrors, setFormErrors] = useState({
    identifier: false,
    name: false,
   
  });

  const handleSaveClick = async () => {
    const errors = {
      identifier: !formValues.identifier,
      name: !formValues.name,
     
    };

    setFormErrors(errors);
   
   
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        roleDtoList: [
          {
            identifier: formValues.identifier,
            name: formValues.name,
            status: ButtonActive, 
            
          },
        ],
      };
console.log(token,"token");

      console.log(body, "req body from role");
      console.log(token, "token");

      const response = await axios.post(
        `${api}/admin/role/edit`,
        body,
        { headers }
      );

      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/admin/role");
        }, 2000);
      } else if (response.data.success === false) {
      
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
      console.log(response.data, "response from api");
    } catch (err) {
      setError("Error fetching role data");
    } finally {
      setLoading(false);
    }
  };
  const breadscrums = "Admin > Role";
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
        className="flex flex-col w-full p-3 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <Toaster />
        <div className="flex flex-col bg-gray-200 rounded-md shadow ">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-3 gap-5 mb-4">
              <TextField
                required
                label="Enter Identifier"
                variant="standard"
                fullWidth
                className="text-xs w-full"
                name="identifier"
                error={formErrors.identifier}
                value={formValues.identifier}
                onChange={handleInputChange}
              />
              <TextField
                required
                label="Name"
                variant="standard"
                fullWidth
                className="text-xs w-full"
                name="name"
                error={formErrors.name}
                value={formValues.name}
                onChange={handleInputChange}
              />
              <div className="flex flex-row gap-6 justify-end items-end">
                

                <div>
                  {ButtonActive ? (
                    <div
                      onClick={() => setButtonActive(!ButtonActive)}
                      className="bg-[#1581ed] text-center cursor-pointer  border-2 border-solid border-gray-400  rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                    >
                      Active
                    </div>
                  ) : (
                    <div
                      onClick={() => setButtonActive(!ButtonActive)}
                      className="bg-[#fff] border-2 border-solid border-[#1581ed] rounded-md text-gray-500 text-center cursor-pointer text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                    >
                      Inactive
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </AddNewPageButtons>
  );
};

export default AddRole;
