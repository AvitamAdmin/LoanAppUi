"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import LocalesDropdown from "@/app/src/components/dropdown/Locales";
import toast, { Toaster } from "react-hot-toast";

const Addsubsidiary = () => {
  const [ButtonActive, setButtonActive] = useState(false);
  const [selectedLocales, setSelectedLocales] = useState([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [initialload, setInitialLoad] = useState(true);

  const [formValues, setFormValues] = useState({
    identifier: "",
    shortDescription: "",
    isoCode: "",
    cluster: "",
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

    if (!formValues.identifier.trim()) {
      newErrors.identifier = "Identifier is required.";
    }
    if (!formValues.shortDescription.trim()) {
      newErrors.shortDescription = "Description is required.";
    }
    // if (selectedSubsidiary.length === 0) {
    //   toast.error("Please select Subsidiary."); // Show toast error for node selection
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSaveClick = async () => {
    if (!validateForm()) return; // Stop execution if form is invalid
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        subsidiaries: [
          {
            identifier: formValues.identifier,
            shortDescription: formValues.shortDescription,
            isoCode: formValues.isoCode,
            cluster: formValues.cluster,
            localeLanguage: selectedLocales,
            status: ButtonActive, // Use button active status (true or false)
          },
        ],
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/subsidiary/edit`, body, {
        headers,
      });
      console.log(response.data, "response from api");
      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setTimeout(() => {
          router.push("/cheil/data/subsidiary");
        }, 2000);
      } else if (response.data.success === false) {
        // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      setError("Error fetching subsidiary data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > subsidiary";
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
        <div className="flex flex-col bg-gray-200 rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-center  flex-col">
              <TextField
                label="Enter Identifier"
                variant="standard"
                fullWidth
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
                error={!!errors.identifier}
                helperText={errors.identifier}
              />
              <TextField
                label="Short Description"
                variant="standard"
                fullWidth
                name="shortDescription"
                value={formValues.shortDescription}
                onChange={handleInputChange}
                error={!!errors.shortDescription}
                helperText={errors.shortDescription}
              />
              <TextField
                label="Cluster ID"
                variant="standard"
                fullWidth
                name="cluster"
                value={formValues.cluster}
                onChange={handleInputChange}
              />
              <TextField
                label="Iso code"
                variant="standard"
                fullWidth
                name="isoCode"
                value={formValues.isoCode}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex  gap-4 mb-4 items-start w-[25%] justify-center  flex-col">
              <LocalesDropdown
                initialload={initialload}
                setLocales={setSelectedLocales}
                locales={selectedLocales}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
                {ButtonActive ? (
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

export default Addsubsidiary;
