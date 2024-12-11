"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/envfile/api";
import {
  CircularProgress,
  InputLabel,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Input,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import SelectRole from "@/app/src/components/dropdown/Role";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import logo from "../../../assests/cheil.png";
import MultiSelectRole from "@/app/src/components/multiSelectDropdown/MultiSelectRole";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Signup() {
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialload, setInitialLoad] = useState(true);
  const [inputFields, setInputFields] = useState({
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
  const { firstName, password, lastName, phone, email,age,gender ,monthlyIncome,nationalIdentityNumber} =
    inputFields;
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  const handleSubmit = async () => {
    setErrorMessage("");

    // Validate form fields
    if (!firstName) {
      setErrorMessage("FirstName is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }
    if (!lastName) {
      setErrorMessage("LastName is required.");
      return;
    }
    if (!email) {
      setErrorMessage("email is required.");
      return;
    }
    if (!phone) {
      setErrorMessage("phoneNumber is required.");
      return;
    }
    if (!age) {
      setErrorMessage("Age is required.");
      return;
    }
    if (!gender) {
      setErrorMessage("Gender is required.");
      return;
    }
    if (!monthlyIncome) {
      setErrorMessage("MonthlyIncome is required.");
      return;
    }
    if (!nationalIdentityNumber) {
      setErrorMessage("National Identity Number is required.");
      return;
    }

    try {
      setLoading(true);
      const requestData = 
        
          {
            firstName: firstName,
            password: password,
            lastName: lastName,
            phone: phone,
            email: email,
            age:age,
            gender:gender,
            monthlyIncome:monthlyIncome,
            nationalIdentityNumber:nationalIdentityNumber
          }
        
      
      console.log("req body", requestData);
     
      const response = await axios.post(api + "/register", requestData);
      console.log(response.data, "registration response");
      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          console.log("gokul25@gmail.com");
          router.push("/login");
        }, 2000);
      } else if (response.data.success === false) { // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else { // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
      setLoading(false);
    } catch (error) {
      console.error(error, "registration error");
      setErrorMessage("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col min-h-screen justify-start lg:justify-center items-center p-1 pt-5 lg:pt-2 md:p-5">
      <Toaster />
      <div className="mb-5 flex justify-center w-48 h-20">
        <Image priority src={logo} alt="Zero-in Logo" />
      </div>

      <div className="flex flex-col gap-3 w-[100%] md:w-[90%] lg:w-[40%] justify-center items-center rounded-lg p-8">
        <div className="text-lg font-semibold flex justify-start w-full flex-col text-start">
          Register
        </div>
        <div className="flex items-center rounded-md w-full gap-10">
          <TextField
            value={firstName}
            onChange={(e) =>
              setInputFields({ ...inputFields, firstName: e.target.value })
            }
            label="FirstName"
            variant="standard"
            className="text-xs w-full"
          />
           <TextField
            value={lastName}
            onChange={(e) =>
              setInputFields({ ...inputFields, lastName: e.target.value })
            }
            label="LastName"
            variant="standard"
            className="text-xs w-full"
          />
        </div>

        {/* Password Field with Visibility Toggle */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-20 w-[100%]">
          <FormControl
            className="flex flex-col w-full md:w-[100%]"
            variant="standard"
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                setInputFields({ ...inputFields, password: e.target.value })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Confirm Password Field with Visibility Toggle */}
         
        </div>

        <div className="flex flex-col w-full gap-3">
          <TextField
            value={phone}
            onChange={(e) =>
              setInputFields({ ...inputFields, phone: e.target.value })
            }
            label="Phone Number"
            variant="standard"
            className="text-xs w-[100%]"
          />
        </div>

       

        <div className="flex flex-col w-full gap-3">
          <TextField
            value={email}
            onChange={(e) =>
              setInputFields({ ...inputFields, email: e.target.value })
            }
            label="Email"
            variant="standard"
            className="text-xs w-[100%]"
          />
        </div>
        <div className="flex items-center rounded-md w-full gap-10">
          <TextField
            value={age}
            onChange={(e) =>
              setInputFields({ ...inputFields, age: e.target.value })
            }
            label="Age"
            variant="standard"
            className="text-xs w-full"
          />
           <TextField
            value={gender}
            onChange={(e) =>
              setInputFields({ ...inputFields, gender: e.target.value })
            }
            label="Gender"
            variant="standard"
            className="text-xs w-full"
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <TextField
            value={monthlyIncome}
            onChange={(e) =>
              setInputFields({ ...inputFields, monthlyIncome: e.target.value })
            }
            type="number"
            label="Monthly Income"
            variant="standard"
            className="text-xs w-[100%]"
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <TextField
            value={nationalIdentityNumber}
            onChange={(e) =>
              setInputFields({ ...inputFields, nationalIdentityNumber: e.target.value })
            }
            label="National Identity Number"
            variant="standard"
            className="text-xs w-[100%]"
          />
        </div>
        <div className="flex flex-col w-full mt-4">
          {errorMessage && (
            <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
          )}
          {loading ? (
            <div
              onClick={handleSubmit}
              className="bg-black cursor-pointer px-5 py-3.5 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
            >
              <CircularProgress size={28} color="inherit" />
            </div>
          ) : (
            <div
              onClick={handleSubmit}
              className="h-14 bg-black cursor-pointer px-5 py-2 text-white rounded-md text-xl text-center"
            >
              Submit
            </div>
          )}
        </div>

        <div className="mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black border-b-2 border-solid border-black"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="text-white mt-8 text-center text-sm">
        © Cheil 2022
        <div>Contact hybris.sup@cheil.com</div>
      </div>
    </div>
  );
}

export default Signup;
