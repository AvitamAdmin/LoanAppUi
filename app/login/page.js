"use client";
import { api } from "@/envfile/api";
import {
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setToken } from "../src/Redux/Slice/slice";
import logo from "../../assests/cheil.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch()
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { email, password } = inputFields;

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(setToken(token));
      router.push("/loanApplication");
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // toast((t) => (
    //   <span>
    //     Custom and <b>bold</b>
    //     <div onClick={() => toast.dismiss(t.id)} style={{ marginLeft: '10px' }}>
    //       Dismiss
    //     </div>
    //   </span>
    // ), {
    //   duration: 10000, // Set duration to 5 seconds (5000ms)
    // });

    if (!email) {
      setErrorMessage("Username is required.");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      console.log({ email, password }, "login credentials");
      setLoading(true);

      // Login API call
      const response = await axios.post(api + "/api/authenticate", {
        username: email,
        password,
      });
      console.log(response.data, "response from backend");

      if (response.data.jwtToken == "Error") {
        toast.error("Invalid credentials.");
      } else {
        const token = response.data.jwtToken;
        console.log(response.data, "response from backend");
        // Store token in localStorage and cookies
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('email', email);
        setCookie("jwtToken", token);
        toast.success("Login successfully");

        // Fetch menu data immediately after login
        await fetchMenuData(token);

        // Redirect to /cheil on success
        router.push("/loanApplication");
      }
    } catch (error) {
      console.log(error, "user login error");
      toast.error("User login error. Please try again.");
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  // Fetch menu data after successful login
  const fetchMenuData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        page: 0,
        sizePerPage: 50

      }
      const response = await axios.get(api + '/admin/interface/getMenu', { headers });
      console.log(response, "response from api");

      localStorage.setItem('menuData', JSON.stringify(response.data));

    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast.error("Failed to load menu data.");
    }
  };

  return (
    <>
      <div
        className="bg-white flex flex-col min-h-screen justify-start lg:justify-center items-center p-1 pt-5 lg:pt-0 md:p-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <Toaster />
        <div className="mb-5 flex justify-center w-48 h-20">
          <Image src={logo} alt="Zero-in Logo" />
        </div>

        <div className="flex flex-col gap-3 w-[100%] md:w-[70%] lg:w-[30%] justify-center items-center rounded-lg p-8">
          <div className="text-lg font-semibold flex justify-start w-full flex-col text-start">
            Login
          </div>
          <div className="flex flex-col w-full gap-3">
            <TextField
              label="Email"
              variant="standard"
              className="text-xs w-[100%]"
              value={email}
              onChange={(e) =>
                setInputFields({ ...inputFields, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-center w-full">
              <FormControl variant="standard" className="w-[100%]">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  value={password}
                  onChange={(e) =>
                    setInputFields({ ...inputFields, password: e.target.value })
                  }
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        className="text-lg"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </div>

          <div className="flex items-center w-full gap-2">
            <input type="checkbox" />
            <label>Remember me</label>
          </div>

          <div className="flex flex-col w-full mt-4">
            {errorMessage && (
              <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
            )}
            {loading ? (
              <div
                // onClick={handleSubmit}
                className="bg-black cursor-pointer px-5 py-2 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
              >
                <CircularProgress size={28} color="inherit" />
              </div>
            ) : (
              <div
                onClick={handleSubmit}
                className="bg-black cursor-pointer px-5 py-2 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
              >
                Login
              </div>
            )}
          </div>

          <div>
            <Link
              href="/login/resetpassword"
              className="hover:text-gray-400 mt-2 cursor-pointer transition-all"
            >
              Reset the Password
            </Link>
          </div>

          <div className="flex items-center mt-4 w-full">
            <div className="flex-grow border-b border-gray-500"></div>
            <span className="mx-2 text-gray-500">Or</span>
            <div className="flex-grow border-b border-gray-500"></div>
          </div>

          <div className="flex flex-col w-full mt-4">
            <Link
              href="/login/signup"
              className="bg-black cursor-pointer px-5 py-2 text-white rounded-md text-xl text-center"
            >
              Register
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            © Cheil 2022
            <div>Contact hybris.sup@cheil.com</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
