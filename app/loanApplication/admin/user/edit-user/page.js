"use client";
import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material"; // Import Autocomplete
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectRole from "@/app/src/components/multiSelectDropdown/MultiSelectRole";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import toast, { Toaster } from "react-hot-toast";

import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const EditUser = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [subsidiary, setSubsidiary] = useState([]); // This holds all available subsidiaries
  const [initialload, setInitialLoad] = useState(true);
  const [editInputfields, setEditInputfields] = useState([]);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();
  const [listingPageSuccess, setListingPageSuccess] = useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")

  const [formValues, setFormValues] = useState({
    firstName: "",
    password: "",
    email: "",
    lastName: "",
    phone: "",
    age:"",
    gender:"",
    monthlyIncome:"",
    nationalIdentityNumber:"",
    roles: [],
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
      handlefetchData(jwtToken);
      fetchRoles(jwtToken);

    }
  }, []);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: { ...item.parentNode, identifier: value },
          };
        }
        return { ...item, [name]: value };
      }
      return item;
    });

    // Clear errors for the current field
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Update state with modified fields
    setEditInputfields(updatedFields);
  };

  const dispatch = useDispatch();

  const [ButtonActive, setButtonActive] = useState(formValues.status || false);

 

  // UseEffect to sync ButtonActive with formValues.status on load
  useEffect(() => {
    setButtonActive(formValues.status);
  }, [formValues.status]);

  const validateForm = () => {
    let newErrors = {};
    let hasEmptySubsidiary = false;

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Validate each field in editInputfields
    editInputfields.forEach((field) => {
      if (!field.email) {
        newErrors.email = "Email is required.";
      } else if (!emailRegex.test(field.email)) {
        newErrors.email = "Invalid email format!";
      }

     
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !hasEmptySubsidiary;
  };
  const handlePostClick = async () => {
    console.log("btn trigrred 1");

    if (!validateForm()) return;
  console.log("btn trigrred 2");
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        customerDtoList: editInputfields.map((field) => ({
          recordId: Array.isArray(selectedID) ? selectedID[0] : selectedID,
          firstName: field.firstName,
          email: field.email,
          roles: field.roles.map((role) => ({ recordId: role.recordId })),
          password: field.password,
          phone: field.phone,
          status: field.ButtonActive,
          nationalIdentityNumber: field.nationalIdentityNumber,
          monthlyIncome: field.monthlyIncome,
          gender: field.gender,
          age: field.age,
          lastName: field.lastName,
        })),
      };

  
      console.log(body, "Request Body");
      const response = await axios.post(`${api}/admin/customer/edit`, body, {
        headers,
      });
  
      if (response.data.success) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setListingPageSuccess(true);
      } else {
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      console.error(err.response?.data || err.message, "Error details");
      toast.error("Error submitting data", { className: "text-sm" });
    }
  };
  

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [subsidiariesList, setSubsidiariesList] = useState([]); // To store all subsidiaries
  const handleToggleButtonActive = (index) => {
    setEditInputfields((prevFields) => {
      return prevFields.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            ButtonActive: !item.ButtonActive,
          };
        }
        return item;
      });
    });
  };
  const handlefetchData = async (jwtToken) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { customerDtoList: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(`${api}/admin/customer/edit`, body, {
        headers,
      });
      console.log(response, "response from api");


      const fetchedData = response.data.customerDtoList[0];
      const userfetchedData = response.data.customerDtoList.map((item) => ({
        ...item,
        ButtonActive: item.status,

      }));

      setEditInputfields(userfetchedData);
      console.log(fetchedData, "formValues user roles fetched");
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };
  const [availableRoles, setAvailableRoles] = useState([]);


  const fetchRoles = async (jwtToken) => {
    
    const ROLE_ENDPOINT = `${api}/admin/role`;

    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { page: 0, sizePerPage: 50 };

      const response = await axios.post(ROLE_ENDPOINT, body, { headers });
      if (response.data.roleDtoList) {
        setAvailableRoles(response.data.roleDtoList);
        console.log("Fetched roles:", response.data.roleDtoList);
      } else {
        setRoles([]);
        console.warn("No roles found in API response.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error.message);
      setError("Failed to fetch roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pagename = "Edit";
  const breadscrums = "RoleandUser > Edit User";
  const contentname = "User";
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
      lastmodifideBy={lastmodifideBy}
      modifiedBy={modifiedBy}
      creator={creator}
      creationTime={creationTime}
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
    >
      {loading ? (
        <>
          <div className="flex flex-row justify-center items-center w-full h-40">
            <div className="gap-5 flex flex-col items-center justify-center">
              <CircularProgress size={36} color="inherit" />
              <div>Loading...</div>
            </div>
          </div>
        </>
      ) : (
        <>
          {editInputfields.length < 1 ? (
            <div className="w-full flex flex-col  h-40 justify-center items-center">
              <div className="opacity-35 ">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data found...</div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-10">
                {editInputfields.map((item, index) => (
                  <div
                    key={item.recordId}
                    className="flex flex-col bg-gray-200 min-h-screen w-full m-2 rounded-md  mb-5"
                  >
                    <div className="bg-white p-4 rounded-md shadow-md flex flex-col">
                      <div className="grid grid-cols-4 gap-5 mb-4">
                        <TextField
                          label="Enter Email"
                          variant="standard"
                          className="text-xs"
                          name="email"
                          value={item.email}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.email} // Display error if it exists
                          helperText={errors.email} // Show error message
                        />
                        <TextField
                          label="Enter FirstName"
                          variant="standard"
                          className="text-xs"
                          name="firstName"
                          value={item.firstName}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.firstName} // Display error if it exists
                          helperText={errors.firstName} // Show error message
                        />
                        <TextField
                          label="Enter LastName"
                          variant="standard"
                          className="text-xs"
                          name="lastName"
                          value={item.lastName}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.lastName} // Display error if it exists
                          helperText={errors.lastName} // Show error message
                        />
                        <TextField
                          label="Enter Age"
                          type="number"
                          variant="standard"
                          className="text-xs"
                          name="age"
                          value={item.age}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.age} // Display error if it exists
                          helperText={errors.age} // Show error message
                        />
                        <TextField
                          label="Enter Gender"
                          variant="standard"
                          className="text-xs"
                          name="gender"
                          value={item.gender}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.gender} // Display error if it exists
                          helperText={errors.gender} // Show error message
                        />
                        <TextField
                          label="Enter MonthlyIncome"
                          variant="standard"
                          className="text-xs"
                          name="monthlyIncome"
                          value={item.monthlyIncome}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.monthlyIncome} // Display error if it exists
                          helperText={errors.monthlyIncome} // Show error message
                        />
                        <TextField
                          label="Enter National Identity Number"
                          variant="standard"
                          className="text-xs"
                          name="nationalIdentityNumber"
                          value={item.nationalIdentityNumber}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.nationalIdentityNumber} // Display error if it exists
                          helperText={errors.nationalIdentityNumber} // Show error message
                        />
                        <TextField
                          type="password"
                          label="Password"
                          variant="standard"
                          className="text-xs"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)} // Use e.target.value to update state
                        
                        />
                        <TextField
                          label="Enter Mobile Number"
                          variant="standard"
                          className="text-xs"
                          name="phone"
                          value={item.phone}
                          onChange={(e) => handleInputChange(e, index)}
                          error={!!errors.phone} // Display error if it exists
                          helperText={errors.phone} // Show error message
                        />
                        

                        <Autocomplete
  multiple
  options={availableRoles} 
  getOptionLabel={(option) => option.name}
  value={item.roles.map((role) => {
    // Find matching roles from availableRoles based on recordId
    return availableRoles.find((r) => r.recordId === role.recordId);
  }).filter(Boolean)} // Filter out any undefined results if no match is found
  onChange={(event, newValue) => {
    const updatedFields = editInputfields.map((field, i) => {
      if (i === index) {
        // Filter new roles to keep the ones matching the existing recordId
        const updatedRoles = newValue.map((role) => {
          // Check if the role's recordId is present in the API response
          const existingRole = item.roles.find(existing => existing.recordId === role.recordId);
          // If it exists, use the existing role data, else update with the new role
          return existingRole ? { ...existingRole, ...role } : role;
        });
        
        return { ...field, roles: updatedRoles }; 
      }
      return field;
    });
    setEditInputfields(updatedFields);
  }}
  renderInput={(params) => <TextField {...params} label="Select Roles" variant="standard" />}
/>









                      </div>

                      <div className="flex flex-col gap-3 ">
                        <div className="flex flex-row gap-3 items-center w-full justify-end">
                          {item.ButtonActive ? (
                            <div
                              onClick={() => handleToggleButtonActive(index)}
                              className="bg-[#1581ed] text-center cursor-pointer  border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                            >
                              Active
                            </div>
                          ) : (
                            <div
                              onClick={() => handleToggleButtonActive(index)}
                              className="bg-[#fff] border-2 border-solid border-gray-400 text-center cursor-pointer rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                            >
                              InActive
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <ListingpageSuccessModal
        contentname={contentname}
        isOpen={listingPageSuccess}
        setIsModalOpen={setListingPageSuccess}
      />
    </AddNewPageButtons>
  );
};

export default EditUser;
