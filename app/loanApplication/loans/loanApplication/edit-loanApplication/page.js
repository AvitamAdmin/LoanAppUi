"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import LocalesDropdown from "@/app/src/components/dropdown/Locales";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import toast, { Toaster } from "react-hot-toast";
import ListingpageSuccessModal from "@/app/src/components/modal/ListingpageSuccessModal";

const Editsubsidiary = () => {
  const [formValuesList, setFormValuesList] = useState([]);
  const [selectedSubsidiaryList, setSelectedSubsidiaryList] = useState([]);
  const [buttonActiveList, setButtonActiveList] = useState([]);
  const [selectedLocales, setSelectedLocales] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
    const [listingPageSuccess, setListingPageSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const dispatch = useDispatch();
  const [initialload, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState([]);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
    }
  }, []);
  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = {
        subsidiaries: selectedID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/subsidiary/getedits`,
        body,
        { headers }
      );
      console.log(response, "response from api");

      const subsidiaries = response.data.subsidiaries || [];
      setlastmodifideBy(response.data.subsidiaries[0]?.lastModified || "");
      setmodifiedBy(response.data.subsidiaries[0]?.modifiedBy || "");
      setcreationTime(response.data.subsidiaries[0]?.creationTime || "");
      setcreator(response.data.subsidiaries[0]?.creator || "");
      setFormValuesList(
        subsidiaries.map((item) => ({
          recordId: item.recordId || "",
          identifier: item.identifier || "",
          shortDescription: item.shortDescription || "",
          cluster: item.cluster || "",
          isoCode: item.isoCode || "",
          localeLanguage: item.localeLanguage || "",
        }))
      );

      setSelectedSubsidiaryList(
        subsidiaries.map((item) => item.subsidiaries || [])
      );

      setButtonActiveList(subsidiaries.map((item) => item.status === true));
    } catch (err) {
      setError("Error fetching subsidiaries data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormValues = [...formValuesList];
    updatedFormValues[index][name] = value;
    setFormValuesList(updatedFormValues);
  };

  const validateFields = () => {
    const newErrors = formValuesList.map((field) => ({
      identifier: !field.identifier ? "Identifier is required" : "",
      shortDescription: !field.shortDescription
        ? "Short description is required"
        : "",
    }));

    setErrors(newErrors);

    // If any field has an error, return false to stop submission
    return newErrors.every((err) => !err.identifier && !err.shortDescription);
  };

  const handleSaveClick = async () => {
    if (!validateFields()) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        subsidiaries: formValuesList.map((formValues, index) => {
          return {
            recordId: formValues.recordId,
            identifier: formValues.identifier,
            shortDescription: formValues.shortDescription,
            cluster: formValues.cluster,
            isoCode: formValues.isoCode,
            localeLanguage: formValues.localeLanguage,
            status: buttonActiveList[index],
          };
        }),
      };

      const response = await axios.post(`${api}/admin/subsidiary/edit`, body, {
        headers,
      });
      console.log(response, "response from api");
      if (response.data.success === true) {
        toast.success(`${response.data.message}`, { className: "text-sm" });
        setListingPageSuccess(true);
      } else if (response.data.success === false) {
        // Corrected "else" to "else if"
        toast.error(`${response.data.message}`, { className: "text-sm" });
      } else {
        // Fallback case
        toast.error(`${response.data.message}`, { className: "text-sm" });
      }
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Data > subsidiaries";
  const pagename = "Edit";
  const contentname = "Subsidiaries";


  return (
    <AddNewPageButtons
      lastmodifideBy={lastmodifideBy}
      modifiedBy={modifiedBy}
      creator={creator}
      creationTime={creationTime}
      pagename={pagename}
      breadscrums={breadscrums}
      email={email}
      handleSaveClick={handleSaveClick}
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
          {formValuesList.length < 1 ? (
            <div className="w-full flex flex-col  h-40 justify-center items-center">
              <div className="opacity-35 ">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data found...</div>
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full p-3 min-h-screen gap-5">
                {formValuesList.map((formValues, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-gray-200 rounded-md shadow mb-5"
                  >
                    <Toaster />
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <TextField
                          label="Identifier"
                          variant="standard"
                          fullWidth
                          name="identifier"
                          value={formValues.identifier}
                          onChange={(e) => handleInputChange(index, e)}
                          error={!!errors[index]?.identifier} // Check if there's an error
                          helperText={errors[index]?.identifier} // Display error message
                        />
                        <TextField
                          label="Short Description"
                          variant="standard"
                          fullWidth
                          name="shortDescription"
                          value={formValues.shortDescription}
                          onChange={(e) => handleInputChange(index, e)}
                          error={!!errors[index]?.shortDescription} // Check if there's an error
                          helperText={errors[index]?.shortDescription} // Display error message
                        />
                        <TextField
                          label="Cluster id"
                          variant="standard"
                          fullWidth
                          name="cluster"
                          value={formValues.cluster}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                        <TextField
                          label="IsoCode"
                          variant="standard"
                          fullWidth
                          name="isoCode"
                          value={formValues.isoCode}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                        <LocalesDropdown
                          initialload={initialload}
                          locales={formValues.localeLanguage}
                          setLocales={(newLocale) => {
                            const updatedLocales = [...selectedLocales];
                            updatedLocales[index] = newLocale;
                            setSelectedLocales(updatedLocales);
                            const updatedFormValues = [...formValuesList];
                            updatedFormValues[index].localeLanguage = newLocale;
                            setFormValuesList(updatedFormValues);
                          }}
                        />
                      </div>
                      <div className="flex justify-end">
                        <div
                          onClick={() => {
                            const updatedButtonActive = [...buttonActiveList];
                            updatedButtonActive[index] =
                              !updatedButtonActive[index];
                            setButtonActiveList(updatedButtonActive);
                          }}
                          className={`${
                            buttonActiveList[index]
                              ? "bg-blue-500 text-white"
                              : "bg-white text-blue-500"
                          } border-2 border-blue-500 rounded-md text-center cursor-pointer text-xs w-[80px] px-2 py-0.5`}
                        >
                          {buttonActiveList[index] ? "Active" : "Inactive"}
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

export default Editsubsidiary;
