"use client";
import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import axios from "axios";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import MultiSelectRole from "@/app/src/components/multiSelectDropdown/MultiSelectRole";

const Adduser = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [selectedRole, setSelectedRole] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [email, setEmail] = useState("");
  const [initialload, setInitialLoad] = useState(true);

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
  });

  const [errors, setErrors] = useState({});

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
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear errors for the field
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formValues.firstName) {
      newErrors.firstName = "firstName is required.";
    }
    if (!formValues.password) {
      newErrors.password = "Password is required.";
    }
    if (!formValues.email) {
      newErrors.email = "Email is required.";
    }
    if (!formValues.lastName) {
      newErrors.lastName = "lastName is required.";
    }
    if (!formValues.mobileNumber) {
      newErrors.mobileNumber = "Mobile Number is required.";
    }
    if (!formValues.age) {
      newErrors.age = "Age is required.";
    }
    if (!formValues.gender) {
      newErrors.gender = "Gender is required.";
    }
    if (!formValues.monthlyIncome) {
      newErrors.monthlyIncome = "MonthlyIncome is required.";
    }
    if (!formValues.nationalIdentityNumber) {
      newErrors.nationalIdentityNumber = "National Identity Number is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!validateForm()) return;

    if (!emailRegex.test(formValues.email)) {
      toast.error("Invalid email format! Please enter a valid email.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        customerDtoList: [
          {
            firstName: formValues.firstName,
            email: formValues.email,
            roles: selectedRole.map((item)=>({recordId:item})),
            password: formValues.password,
            phone: formValues.phone,
            status: ButtonActive,
            nationalIdentityNumber:formValues.nationalIdentityNumber,
            monthlyIncome:formValues.monthlyIncome,
            gender:formValues.gender,
            age:formValues.age,
            lastName:formValues.lastName
          },
        ],
      };

      console.log(body, "Request body for user");
      console.log(selectedRole, "Selected roles");

      const response = await axios.post(`${api}/admin/customer/edit`, body, {
        headers,
      });

      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/admin/user");
        }, 2000);
      } else {
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      toast.error("Error adding user. Please try again.");
      console.error("Error:", err);
    }
  };

  const breadscrums = "Admin > Add User";
  const pagename = "Add New";
  const [addnewpagebtn, setAddNewPageBtn] = useState(true);

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
        className="flex flex-col w-full p-4 max-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="bg-white p-4 gap-3 rounded-md shadow-md">
          <div className="w-full grid grid-cols-4 gap-5">
            <TextField
              label="Enter Email"
              variant="standard"
              className="text-xs mt-6"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Enter FirstName"
              variant="standard"
              className="text-xs mt-6"
              name="firstName"
              value={formValues.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
             <TextField
              label="Enter LastName"
              variant="standard"
              className="text-xs mt-6"
              name="lastName"
              value={formValues.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
             <TextField
              label="Enter age"
              type="number"
              variant="standard"
              className="text-xs mt-6"
              name="age"
              value={formValues.age}
              onChange={handleInputChange}
              error={!!errors.age}
              helperText={errors.age}
            />
             <TextField
              label="Enter Gender"
              variant="standard"
              className="text-xs mt-6"
              name="gender"
              value={formValues.gender}
              onChange={handleInputChange}
              error={!!errors.gender}
              helperText={errors.gender}
            />
             <TextField
              label="Enter MonthlyIncome"
              type="number"
              variant="standard"
              className="text-xs mt-6"
              name="monthlyIncome"
              value={formValues.monthlyIncome}
              onChange={handleInputChange}
              error={!!errors.monthlyIncome}
              helperText={errors.monthlyIncome}
            />
             <TextField
              label="Enter National Identity Number"
              variant="standard"
              className="text-xs mt-6"
              name="nationalIdentityNumber"
              value={formValues.nationalIdentityNumber}
              onChange={handleInputChange}
              error={!!errors.nationalIdentityNumber}
              helperText={errors.nationalIdentityNumber}
            />
            <TextField
              type="password"
              label="Password"
              variant="standard"
              className="text-xs mt-6"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              type="number"
              label="Mobile Number"
              variant="standard"
              className="text-xs mt-6"
              name="mobileNumber"
              value={formValues.mobileNumber}
              onChange={handleInputChange}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
            />
            <div className="mt-6">
              <MultiSelectRole
                initialload={initialload}
                selectedRoles={selectedRole}
                setSelectedRoles={setSelectedRole}
              />
            </div>
          </div>
          <div className="flex gap-4 items-center w-full mt-4 justify-end">
            <div className="flex flex-row gap-3 items-center">
              {ButtonActive ? (
                <div
                  onClick={() => setButtonActive(false)}
                  className="bg-[#1581ed] text-center cursor-pointer border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px]"
                >
                  Active
                </div>
              ) : (
                <div
                  onClick={() => setButtonActive(true)}
                  className="bg-white border-2 border-gray-400 text-center cursor-pointer rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px]"
                >
                  Inactive
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default Adduser;
