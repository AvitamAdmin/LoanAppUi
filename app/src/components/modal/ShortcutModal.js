"use client"
import React, { useEffect, useState } from "react";
import { Modal, TextField, Switch, Autocomplete } from "@mui/material";
import "animate.css";
import { getCookie } from "cookies-next";
import axios from "axios";
import { api } from "@/envfile/api";

function ShortcutModal({ open, handleClose }) {
  // const [sites, setSites] = useState([]);
  // const [testPlan, setTestPlan] = useState([]);
  // const [enviroment, setEnviroment] = useState([]);
  const [token, setToken] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const [skuinputField, setSkuinputField] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedTestPlan, setSelectedTestPlan] = useState([]);
  const [selectedTestProfile, setSelectedTestProfile] = useState([]);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);

  const [testPlanList, setTestPlanList] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [sitesList, setSitesList] = useState([]);
  const [testProfile, setTestProfile] = useState([]);
  const [subsidiary, setSubsidiary] = useState([]);

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      setToken(token);
      // Ensure all data fetch calls happen after the token is set
      getAllEnvironments(token);
      getSitesData(token);
      getTestPlanData(token);
      getAllTestProfile(token);
      getAllSubsidiaries();
    }
  }, []);

  const getAllEnvironments = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/environment/get", {
        headers,
      });
      setEnvironments(response.data.environments);
      // console.log(response.data.environments, "environments fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };
  const getSitesData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/site/get", {
        headers,
      });
      setSitesList(response.data.sites); // Update the local node list state
      console.log(response.data.sites,"response.data.sites");
    } catch (error) {
      console.log(error, "Error fetching sites");
    }
  };
  const getTestPlanData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/qa/get", {
        headers,
      });
      setTestPlanList(response.data.testPlans); // Update the local node list state
      // console.log(response.data.testPlans);
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };
  const getAllTestProfile = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      console.log(token, "token from testProfile");
      const response = await axios.get(api + "/admin/profile/get", {
        headers,
      });
      setTestProfile(response.data.testProfiles);
      // console.log(response.data.testProfiles, "environments fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };
  const getAllSubsidiaries = async () => {
    try {
      const response = await axios.get(api + "/admin/subsidiary/get");
      setSubsidiary(response.data.subsidiaries);
      // console.log(response.data.subsidiaries, "subsidiaries fetched");
    } catch (error) {
      console.log(error, "error fetching subsidiaries");
    }
  };
  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Map only the `recordId` from environment
      // const environmentId =
      //   enviroment.length > 0 ? String(enviroment[0].recordId) : "";
      const subsidiaryId =
        subsidiary.length > 0 ? String(subsidiary[0].recordId) : "";
      const testProfileId =
        testProfile.length > 0 ? String(testProfile[0].recordId) : "";
        // // console.log(enviroment, "enviroment req body from user");
        // console.log(selectedSites.recordId, "selectedSites req body from user");
        // // console.log(subsidiary, "req body from user");

      const body = {
        subsidiary: subsidiaryId,
        siteIsoCode: selectedSites.recordId,
        environment: selectedEnvironment.recordId,
        testPlan: selectedTestPlan.recordId || "",
        skus: skuinputField,
        testProfile: testProfileId,
        enableBtn: buttonActive,
      };

      // console.log(body, "req body from user");
      const response = await axios.post(`${api}/qa/testPlans`, body, {
        headers,
      });
      console.log(response.data, "response from api");
      // router.push("/cheil/admin/mapping");
    } catch (err) {
      console.error("Error fetching mapping data", err);
    }
  };

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setButtonActive(event.target.checked);
  };

  const handlesubsidiaryChange = async (newValue) => {
    if (!newValue || !newValue.recordId) {
      console.log("Invalid subsidiary selected");
      return;
    }
  
    const recordId = newValue.recordId;
    const headers = { Authorization: "Bearer " + token };
    const body = {
      recordId: recordId,
    };
  
    try {
      const enviromentresponse = await axios.post(`${api}/qa/getEnvironmentsForSubsidiary`, body,{
        headers,
        params: { recordId },
      });  
      setEnvironments(enviromentresponse.data);

      const sitesresponse = await axios.post(api + "/qa/getSitesForSubsidiary",  body,{
        headers,
      });
      setSitesList(sitesresponse.data); 
      console.log(sitesList,"sitesList sitesListsitesList");

      const testplanresponse = await axios.post(api + "/qa/getTestPlanForSubsidiary",  body,{
        headers,
      });
      setTestPlanList(testplanresponse.data);    
      
      const testprofileresponse = await axios.post(api + "/qa/getTestProfileForSubsidiary",  body,{
        headers,
      });
      setTestProfile(testprofileresponse.data);
    } catch (error) {
      console.error("Error fetching environments for subsidiary", error);
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="w-3/4 max-w-lg ml-[40%] flex flex-col items-center m-h-screen">
        <div
          style={{ marginTop: 100, fontFamily: "SamsungOne, sans-serif" }}
          className="w-full flex flex-col items-center "
        >
          <div className="bg-white w-[100%] rounded-md overflow-hidden shadow-lg animate__animated animate__fadeInDownBig">
            <div className="flex justify-between items-center bg-black text-white text-center cursor-pointer p-4">
              <h2 id="modal-title" className="text-lg font-bold">
                Run Test
              </h2>
              <div onClick={handleClose} className="text-xl font-bold">
                x
              </div>
            </div>

            <div
              id="modal-description"
              className="p-6 flex flex-col gap-5 mt-8"
            >
              <Autocomplete
  options={subsidiary || []}
  getOptionLabel={(option) => option.identifier || ""}
  value={selectedSubsidiary || null}
  onChange={(event, newValue) => {
    setSelectedSubsidiary(newValue);
    handlesubsidiaryChange(newValue);
  }}
  isOptionEqualToValue={(option, value) => option.recordId === value?.recordId}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Subsidiary"
      variant="standard"
    />
  )}
/>

<Autocomplete
  options={testPlanList || []}
  getOptionLabel={(option) => option.identifier || ""}
  value={selectedTestPlan || null}
  onChange={(event, newValue) => {
    setSelectedTestPlan(newValue);
  }}
  isOptionEqualToValue={(option, value) => option.recordId === value?.recordId}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Test Plan"
      variant="standard"
    />
  )}
/>

<Autocomplete
  options={sitesList || []}
  getOptionLabel={(option) => option.identifier || ""}
  value={selectedSites || null}
  onChange={(event, newValue) => {
    setSelectedSites(newValue);
  }}
  isOptionEqualToValue={(option, value) => option.recordId === value?.recordId}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Sites"
      variant="standard"
    />
  )}
/>

<Autocomplete
  options={environments || []}
  getOptionLabel={(option) => option.identifier || ""}
  value={selectedEnvironment || null}
  onChange={(event, newValue) => {
    setSelectedEnvironment(newValue);
  }}
  isOptionEqualToValue={(option, value) => option.recordId === value?.recordId}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Environment"
      variant="standard"
    />
  )}
/>

<Autocomplete
  options={testProfile || []}
  getOptionLabel={(option) => option.identifier || ""}
  value={selectedTestProfile || null}
  onChange={(event, newValue) => {
    setSelectedTestProfile(newValue);
  }}
  isOptionEqualToValue={(option, value) => option.recordId === value?.recordId}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Test Profile"
      variant="standard"
    />
  )}
/>


              <div className="flex items-center justify-between p-1">
                <p>Select from the default SKU list</p>
                <Switch checked={checked} onChange={handleChange} />
              </div>

              <TextField
                label="Please enter SKU's"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                className="bg-gray-100 rounded"
                value={skuinputField}
                onChange={(e) => setSkuinputField(e.target.value)} // Update the state here
              />

              <div
                onClick={handleSaveClick}
                className="bg-[#2b2b2b] w-full p-2 text-white rounded-md hover:bg-gray-700"
              >
                Submit
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ShortcutModal;
