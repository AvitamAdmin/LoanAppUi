"use client";
import React, { useEffect, useState } from "react";
import {
    CircularProgress,
    InputLabel,
    InputAdornment,
    IconButton,
    FormControl,
    Input,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";
import logo from "../../../assests/cheil.png";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";

function UpdatePassword() {
    const [loading, setLoading] = useState(false);
    const [inputFields, setInputFields] = useState({
        password: "",
        passwordConfirm: "",
    });
    const { password, passwordConfirm, } =
        inputFields;
    const [token, setToken] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = queryParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            console.log(tokenFromUrl, "tokenFromUrl tokenFromUrl");
        } else {
            console.log("Token not found in URL.");
        }
    }, []);
    
    const handleSubmit = async () => {
        setErrorMessage("");
    
        if (!password) {
            setErrorMessage("Password is required.");
            return;
        }
        if (!passwordConfirm) {
            setErrorMessage("Password confirmation is required.");
            return;
        }
        if (password !== passwordConfirm) {
            setErrorMessage("Passwords do not match.");
            return;
        }
    
        try {
            const response = await axios.post(api + "/resetpassword", {
                resetPasswordToken: token,
                password: password,
            });
    
            console.log(response, "email response");
    
            if (response.data.success === true) {
                toast.success(response.data.message);
                router.push("/login");
                return;
            }
        } catch (error) {
            console.error("Error sending reset link:", error);
            setErrorMessage(
                error.response?.data?.message || "Failed to reset password. Please try again."
            );
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
                <div className="text-lg font-semibold flex justify-center items-center w-full flex-col text-start">
                    Reset Password
                </div>
                <div className="flex flex-col md:flex-col gap-3  w-[70%]">
                    <FormControl
                        className="flex flex-col w-full "
                        variant="standard"
                    >
                        <InputLabel htmlFor="password">New Password</InputLabel>
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
                </div>
                <div className="flex flex-col md:flex-col gap-3  w-[70%]">
                    <FormControl
                        className="flex flex-col "
                        variant="standard"
                    >
                        <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                        <Input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            value={passwordConfirm}
                            onChange={(e) =>
                                setInputFields({
                                    ...inputFields,
                                    passwordConfirm: e.target.value,
                                })
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
                </div>
                <div className="flex flex-col w-[50%] mt-4">
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
                    )}
                    {loading ? (
                        <div

                            className="bg-black cursor-pointer px-5 py-2 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
                        >
                            <CircularProgress size={28} color="inherit" />
                        </div>
                    ) : (
                        <div
                            onClick={handleSubmit}
                            className="bg-black cursor-pointer px-5 py-2 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
                        >
                            Submit
                        </div>
                    )}
                </div>
                <div className="mt-4 gap-2 flex flex-col text-center text-xs">
                    <div> © Cheil 2022</div>
                    <div>Contact hybris.sup@cheil.com</div>
                </div>

            </div>

            <div className="text-white mt-8 text-center text-sm">
                © Cheil 2022
                <div>Contact hybris.sup@cheil.com</div>
            </div>
        </div>
    );
}

export default UpdatePassword;
