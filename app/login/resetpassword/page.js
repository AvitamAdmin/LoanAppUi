"use client"
import { api } from '@/envfile/api'
import { TextField } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ResetPassword = () => {
    const router = useRouter();

    const [inputfield, setInputfield] = useState({ email: "" });
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const { email } = inputfield;

    const handleInputChange = (e) => {
        setInputfield({
            ...inputfield,
            [e.target.name]: e.target.value
        });
    };

    const handlesubmit = async () => {
        try {
            const response = await axios.post(api + "/forgotpassword", {
                username: email
            });
            console.log(response, "email response");


            if (response.data.success === true) {
                setShow(true)
                setMessage(response.data.message);
                return
            }
        } catch (error) {
            console.error("Error sending reset link:", error);
            setMessage("Failed to send reset link. Please try again.");
        }
    };

    return (
        <div className='flex flex-row min-h-screen justify-center items-start p-1 mt-10'>
            <div className="flex flex-col gap-5 w-[100%] md:w-[70%] lg:w-[40%] justify-center items-center rounded-lg">
                {show === false ? (
                    <>
                        <div className='text-lg font-semibold'>Enter Email to Reset Password</div>

                        <div className='w-[80%]'>
                            <TextField
                                variant='standard'
                                name="email"
                                value={email}
                                onChange={handleInputChange}
                                label="Username/Email"
                                id="outlined-size-small"
                                size="small"
                                className='w-full text-sm border-2'
                            />
                        </div>

                        <div onClick={handlesubmit} className='w-[80%] text-sm bg-black p-2 cursor-pointer text-center rounded-md'>
                            <div className='text-white'>Send Link</div>
                        </div>

                        <div className='text-black text-xs font-semibold'>
                            Back to <span onClick={() => router.push("/login")} className='underline cursor-pointer hover:text-gray-400'>Signin</span>
                        </div>
                    </>
                ) : (
                    <div className='text-center'>
                        <div className='text-green-500 font-semibold mb-4'>{message}</div>
                        <div
                            onClick={() => router.push("/login")}
                            className='text-blue-500 underline cursor-pointer hover:text-blue-700'>
                            Click here to Login
                        </div>
                    </div>
                )}

                <div className="mt-4 gap-2 flex flex-col text-center text-xs">
                    <div> © Cheil 2022</div>
                    <div>Contact hybris.sup@cheil.com</div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
