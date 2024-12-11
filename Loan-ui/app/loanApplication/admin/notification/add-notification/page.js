"use client";
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import { FaMinus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const Addnotification = () => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [ButtonActive, setButtonActive] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState([]);
  const [initialload, setInitialLoad] = useState(true);
  useEffect(() => {
    const storedEmail = localStorage.getItem('username');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleAddParamClick = () => {
    setParams((prevParams) => [
      ...prevParams,
      {
        url: '',
        loginName: '',
        loginPassword: '',
        loginNameUiSelector: '',
        loginPasswordSelector: '',
        actionElement: '',
        shortDescription: '',
        afterUrl: false,
        beforeUrl: false,
        afterClick: false,
        beforeClick: false,
      },
    ]);
  };
 

  const handleRemoveParamClick = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };
  const handleInputFieldChange = (index, fieldName, value) => {
    setParams((prevParams) => {
      const updatedParams = [...prevParams];
      updatedParams[index] = {
        ...updatedParams[index],
        [fieldName]: value,
      };
      return updatedParams;
    });
  };
  const toggleButtonState = (index, buttonType) => {
    const newInputs = [...params];
    
    // Toggle only the specific button for this row
    newInputs[index][buttonType] = !newInputs[index][buttonType];
    
    setParams(newInputs);
  };


  const [formValues, setFormValues] = useState({
    text: "",
  
  });
  
  const [errors, setErrors] = useState({}); // Track field errors
  const { text, } = formValues;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  
    // Clear error when the input is corrected
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);





  

  const handleSaveClick = async () => {
    const newErrors = {};
  
    // Validate fields
    if (!text.trim()) newErrors.text = "Text is mandatory";
    
  
  
    // Set errors if any
    setErrors(newErrors);
  
    // If there are errors, stop execution
    if (Object.keys(newErrors).length > 0) return;
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
  
  
      const body = {
        notificationDtoList: [
          {
            text: text,
           
            status: ButtonActive,
            
          },
        ],
      };
  
      console.log(body, "Request body");
      const response = await axios.post(`${api}/admin/notification/edit`, body, { headers });
      console.log(response.data, "API response");
      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/admin/notification");
        }, 2000);
      } else if (response.data.success === false) {
        // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      setError("Error fetching environment data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > notification";
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
          <div className="grid grid-cols-1 gap-3 mb-4 items-center justify-center flex-col">
  <TextField
    label="Enter text"
    variant="standard"
    fullWidth
    className="mt-3"
    name="text"
    value={formValues.text}
    onChange={handleInputChange}
    error={!!errors.text} // Display error state
    helperText={errors.text} // Show error message
  />




</div>


            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
              {ButtonActive ? (
                  <div
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#1581ed]   border-2 border-solid border-gray-400 text-center cursor-pointer rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                   Active
                  </div>
                ) : (
                  <div
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#fff] border-2 border-solid border-[#1581ed] rounded-md text-gray-500 text-xs text-center cursor-pointer px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
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

export default Addnotification;
